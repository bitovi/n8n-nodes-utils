import {
	type IExecuteFunctions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
} from 'n8n-workflow';
import { set } from 'lodash';

enum Action {
	GET_MATCHES = 'getMatches',
	REPLACE = 'replace',
}

export class Regex implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Regex',
		icon: 'file:bitovi.svg',
		name: 'regex',
		group: ['transform'],
		version: 1,
		description: 'Regex Node',
		defaults: {
			name: 'Regex',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Get Matches',
						value: Action.GET_MATCHES,
					},
					{
						name: 'Replace',
						value: Action.REPLACE,
					},
				],
				default: 'getMatches',
			},
			{
				displayName: 'Data',
				name: 'data',
				type: 'string',
				noDataExpression: false,
				required: true,
				default: '',
			},
			{
				displayName: 'Regex Pattern',
				name: 'regex',
				type: 'string',
				noDataExpression: false,
				required: true,
				default: '',
			},
			{
				displayName: 'Flags',
				name: 'flags',
				type: 'string',
				noDataExpression: false,
				required: true,
				default: 'ig',
			},
			{
				displayName: 'Replacement',
				name: 'replacement',
				type: 'string',
				noDataExpression: false,
				required: true,
				default: '',
				displayOptions: {
					show: {
						operation: [Action.REPLACE],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i);
				const data = this.getNodeParameter('data', i) as string;
				const regexString = this.getNodeParameter('regex', i) as string;
				const flags = this.getNodeParameter('flags', i) as string;

				const regex = new RegExp(regexString, flags);

				switch (operation) {
					case Action.GET_MATCHES: {
						const matches = Array.from(data.matchAll(regex), (match) => match[0]);
						returnData.push(...matches.map((match: string) => ({ json: { match } })));

						break;
					}
					case Action.REPLACE: {
						const replacement = this.getNodeParameter('replacement', i) as string;

						returnData.push({
							json: {
								data: data.replace(regex, replacement),
							},
						});

						break;
					}
					default: {
						// Do nothing
					}
				}
			} catch (error) {
				if (!this.continueOnFail()) {
					set(error, 'node', this.getNode());
					throw error;
				}
				returnData.push({
					json: {
						error: error.message,
					},
					pairedItem: i,
					error,
				});
			}
		}

		return [returnData];
	}
}
