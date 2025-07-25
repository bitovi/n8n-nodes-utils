import {
	type IExecuteFunctions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
} from 'n8n-workflow';
import wiki from 'wikipedia';
import { set } from 'lodash';

enum Action {
	GET_CONTENT = 'getContent',
	GET_LINKS = 'getLinks',
}

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
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Get Content',
						value: Action.GET_CONTENT,
					},
					{
						name: 'Get Links',
						value: Action.GET_LINKS,
					},
				],
				default: 'getContent',
			},
			{
				displayName: 'Page Name',
				name: 'pageName',
				type: 'string',
				noDataExpression: false,
				required: true,
				default: '',
			},
			{
				displayName: 'Auto Suggest',
				name: 'autoSuggest',
				type: 'boolean',
				noDataExpression: false,
				required: true,
				default: true,
			},
			{
				displayName: 'Redirect',
				name: 'redirect',
				type: 'boolean',
				noDataExpression: false,
				required: true,
				default: true,
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i);
				const pageName = this.getNodeParameter('pageName', i) as string;
				const autoSuggest = this.getNodeParameter('autoSuggest', i) as boolean;
				const redirect = this.getNodeParameter('redirect', i) as boolean;

				const page = await wiki.page(pageName, { autoSuggest, redirect });

				switch (operation) {
					case Action.GET_CONTENT: {
						returnData.push({
							json: {
								pageName,
								content: await page.content({ autoSuggest, redirect }),
							},
						});

						break;
					}
					case Action.GET_LINKS: {
						returnData.push({
							json: {
								pageName,
								links: await page.links({ autoSuggest, redirect }),
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
