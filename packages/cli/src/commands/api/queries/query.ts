/* eslint-disable unicorn/filename-case */
// Generated file, please do not edit directly

import { flags } from '@oclif/command';
import { main } from '@rockset/core';
import { runApiCall, Args } from '../../../helper/util';
import { RockCommand } from '../../../base-command';

import { cli } from 'cli-ux';

class Query extends RockCommand {
  static flags = {
    help: flags.help({ char: 'h' }),
    file: flags.string({
      char: 'f',
      description:
        'The config file to execute this command from. Format must be json. Keys are translated into arguments of the same name. If no BODY argument is specified, the whole object, minus keys used as other arguments, will be passed in as the BODY.',
    }),
    full: flags.boolean({
      description: 'Show the full results JSON object',
    }),
    ...cli.table.flags(),
    loadTestRps: flags.integer({
      char: 'l',
      description:
        'If this flag is active, a load test will be conducted using this apicall. The value passed to this flag determines how many requests per second will be sent',
    }),
    yes: flags.boolean({
      char: 'y',
      description: 'Skip all safety prompts',
      default: false,
    }),
  };

  static args = [
    {
      name: 'body',
      description: 'JSON object',
      required: false,
      hidden: false,
    },
  ];

  static description = `
Query

Make a SQL query to Rockset.

Endpoint: POST: /v1/orgs/self/queries

Endpoint Documentation: https://docs.rockset.com/rest-api#query

This command is a simple wrapper around the above endpoint. Please view further documentation at the url above.

`;

  async run() {
    const { args, flags } = this.parse(Query);

    // Rockset client object
    const client = await main.createClient();

    // Arguments
    const namedArgs: Args = Query.args;

    // apicall
    const apicall = client.queries.query.bind(client.queries);

    // endpoint
    const endpoint = '/v1/orgs/self/queries';
    const method = 'POST';

    await runApiCall.bind(this)({ args, flags, namedArgs, apicall, method, endpoint });
  }
}

export default Query;
