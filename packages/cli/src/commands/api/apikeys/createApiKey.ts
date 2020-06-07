/* eslint-disable unicorn/filename-case */
// Generated file, please do not edit directly

import { flags } from '@oclif/command';
import { main } from '@rockset/core';
import { runApiCall, Args } from '../../../helper/util';
import { RockCommand } from '../../../base-command';

class CreateApiKey extends RockCommand {
  static flags = {
    help: flags.help({ char: 'h' }),
    file: flags.string({
      char: 'f',
      description:
        'The config file to execute this command from. Format must be json. Keys are translated into arguments of the same name. If no BODY argument is specified, the whole object, minus keys used as other arguments, will be passed in as the BODY.',
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
Create API Key

Create a new API key for the authenticated user.

Endpoint: POST: /v1/orgs/self/users/self/apikeys

Endpoint Documentation: https://docs.rockset.com/rest-api#createapikey

This command is a simple wrapper around the above endpoint. Please view further documentation at the url above.

`;

  async run() {
    const { args, flags } = this.parse(CreateApiKey);

    // Rockset client object
    const client = await main.createClient();

    // Arguments
    const namedArgs: Args = CreateApiKey.args;

    // apicall
    const apicall = client.apikeys.createApiKey.bind(client.apikeys);

    // endpoint
    const endpoint = '/v1/orgs/self/users/self/apikeys';
    const method = 'POST';

    await runApiCall.bind(this)({ args, flags, namedArgs, apicall, method, endpoint });
  }
}

export default CreateApiKey;
