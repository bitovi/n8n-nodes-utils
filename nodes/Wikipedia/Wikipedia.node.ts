import {
	type IExecuteFunctions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
} from 'n8n-workflow';
import wiki from 'wikipedia';
import { set } from 'lodash';

export class Wikipedia implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Wikipedia',
		icon: 'file:wikipedia.svg',
		name: 'wikipedia',
		group: ['transform'],
		version: 1,
		description: 'Wikipedia Node',
		defaults: {
			name: 'Wikipedia',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Page Name',
				name: 'pageName',
				type: 'string',
				noDataExpression: false,
				required: true,
				default: '',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const pageName = this.getNodeParameter('pageName', i) as string;

			try {
				const page = await wiki.page(pageName, { redirect: true });
				const content = await page.content();

				returnData.push({
					json: {
						pageName,
						content,
					},
				});
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
