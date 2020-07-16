import Command from '@oclif/command';
import { prettyPrint, wait } from '@rockset/core/dist/helper';
import _ = require('lodash');
import { RockClientException } from '@rockset/core/dist/exception/exception';
import { CLIError } from '@oclif/errors';
import { ErrorModel } from '@rockset/client/dist/codegen/api';
import { main, auth } from '@rockset/core';
import AbortController from 'abort-controller';

type ThrownError = string | Error | CLIError | ErrorModel | unknown;
export abstract class RockCommand extends Command {
  async catch(err: ThrownError) {
    // This is necessary because oclif seems to throw errors sometimes to exit logic early...
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (err instanceof CLIError && err?.oclif?.exit === 0) {
      return;
    }

    this.logTelemetrics({ error: err });

    const finalErr = `

${_.truncate(prettyPrint(err), { length: 500 })}

${err}
    `;
    this.error(finalErr);
  }

  info(...params: Parameters<typeof console.error>) {
    console.error('[INFO]:', ...params);
  }

  async init() {
    this.logTelemetrics();
  }

  logTelemetrics({
    error,
  }: {
    error?: ThrownError;
  } = {}) {
    try {
      // Don't want to log the actual error object
      const errorId = error && error instanceof RockClientException ? error.id : null;
      const { name: commandClassName } = this.constructor;
      const { version, platform, arch, shell } = this.config;
      const commandName = this.id;
      const timestamp = Date.now();
      const readable = new Date();
      const timestampReadable = readable.toUTCString();
      const type = errorId ? 'ERROR' : 'INFO';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { args, flags } = this.parse(this.constructor as any);

      // Remove all user data before we log args and flags: we only want the names of the args and flags included
      const argsTrimmed = _.isObject(args)
        ? _.chain(args)
            .keys()
            .filter((k) => Boolean((args as Record<string, unknown>)[k]))
            .value()
        : null;

      const flagsTrimmed = _.isObject(flags)
        ? _.chain(flags)
            .keys()
            .filter((k) => Boolean((flags as Record<string, unknown>)[k]))
            .value()
        : null;

      const allTelemetrics = {
        commandClassName,
        version,
        platform,
        arch,
        shell,
        commandName,
        timestamp,
        timestampReadable,
        type,
        argsTrimmed,
        flagsTrimmed,
        errorId,
      };

      // Don't block for this
      if (!process.env.ROCKSET_CLI_TELEMETRY_OPTOUT) {
        const controller = new AbortController();
        main
          .createClient()
          .then(async (client) => {
            const { api_server } = await auth.getAuthProfile();
            const body = JSON.stringify({
              event: allTelemetrics,
            });

            const endpoint = `${api_server}/v1/telemetry`;
            const options = {
              method: 'POST',
              body,
              headers: {
                'Content-Type': 'application/json',
              },
              signal: controller.signal,
            };
            const prom = client._fetch(endpoint, options);

            // cancel the request in 50ms
            // Note that this just rejects the promise, doesn't cancel a request that has been sent
            // Doing this prevents the process from staying alive if the request is taking too long
            await wait(50);
            controller.abort();
            return prom;
          })
          .catch(() => {});
      }
    } catch (_) {
      // Something went wrong, fail silently
    }
  }
}
