import {
	type IExecuteFunctions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
} from 'n8n-workflow';

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
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const data = this.getNodeParameter('data', i) as string;
			const regexString = this.getNodeParameter('regex', i) as string;
			const flags = this.getNodeParameter('flags', i) as string;

			const regex = new RegExp(regexString, flags);
			const matches = Array.from(data.matchAll(regex), (match) => match[0]);
			returnData.push(...matches.map((match: string) => ({ json: { match } })));
		}

		return [returnData];
	}
}
