import {
	type IExecuteFunctions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
} from 'n8n-workflow';

export class Skip implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Skip',
		icon: 'file:bitovi.svg',
		name: 'skip',
		group: ['transform'],
		version: 1,
		description: 'Skip Node',
		defaults: {
			name: 'Skip',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Items',
				name: 'items',
				type: 'number',
				noDataExpression: false,
				required: true,
				default: 1,
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const skip = this.getNodeParameter('items', 0) as number;
		return [items.splice(skip)];
	}
}
