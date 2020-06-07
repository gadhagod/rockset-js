/* eslint-disable unicorn/filename-case */
// Generated file, please do not edit directly

import { flags } from '@oclif/command';
import { main } from '@rockset/core';
import { runApiCall, Args } from '../../../helper/util';
import { RockCommand } from '../../../base-command';

class ExecuteQueryLambda extends RockCommand {
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
      name: 'queryLambda',
      description: 'name of the Query Lambda',
      required: false,
      hidden: false,
    },
    {
      name: 'version',
      description: 'version',
      required: false,
      hidden: false,
    },
    {
      name: 'body',
      description: 'JSON object',
      required: false,
      hidden: false,
    },
  ];

  static description = `
Run Query Lambda

Run a particular version of a Query Lambda.

Endpoint: POST: /v1/orgs/self/ws/{workspace}/lambdas/{queryLambda}/versions/{version}

Endpoint Documentation: https://docs.rockset.com/rest-api#executequerylambda

This command is a simple wrapper around the above endpoint. Please view further documentation at the url above.

`;

  async run() {
    const { args, flags } = this.parse(ExecuteQueryLambda);

    // Rockset client object
    const client = await main.createClient();

    // Arguments
    const namedArgs: Args = ExecuteQueryLambda.args;

    // apicall
    const apicall = client.queryLambdas.executeQueryLambda.bind(client.queryLambdas);

    // endpoint
    const endpoint = '/v1/orgs/self/ws/{workspace}/lambdas/{queryLambda}/versions/{version}';
    const method = 'POST';

    await runApiCall.bind(this)({ args, flags, namedArgs, apicall, method, endpoint });
  }
}

export default ExecuteQueryLambda;
