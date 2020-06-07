/* eslint-disable unicorn/filename-case */
// Generated file, please do not edit directly

import { flags } from '@oclif/command';
import { main } from '@rockset/core';
import { runApiCall, Args } from '../../../helper/util';
import { RockCommand } from '../../../base-command';

class GetCollection extends RockCommand {
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
      name: 'workspace',
      description: 'name of the workspace',
      required: false,
      hidden: false,
    },
    {
      name: 'collection',
      description: 'name of the collection',
      required: false,
      hidden: false,
    },
  ];

  static description = `
Get Collection

Get details about a collection.

Endpoint: GET: /v1/orgs/self/ws/{workspace}/collections/{collection}

Endpoint Documentation: https://docs.rockset.com/rest-api#getcollection

This command is a simple wrapper around the above endpoint. Please view further documentation at the url above.

`;

  async run() {
    const { args, flags } = this.parse(GetCollection);

    // Rockset client object
    const client = await main.createClient();

    // Arguments
    const namedArgs: Args = GetCollection.args;

    // apicall
    const apicall = client.collections.getCollection.bind(client.collections);

    // endpoint
    const endpoint = '/v1/orgs/self/ws/{workspace}/collections/{collection}';
    const method = 'GET';

    await runApiCall.bind(this)({ args, flags, namedArgs, apicall, method, endpoint });
  }
}

export default GetCollection;
