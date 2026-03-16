import {
	NodeOperationError,
	type IDataObject,
	type IExecuteFunctions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
} from 'n8n-workflow';
import $RefParser from '@apidevtools/json-schema-ref-parser';
import { set } from 'lodash';

export class JSONSchemaDereference implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'JSON Schema Dereference',
		icon: 'fa:link',
		name: 'jsonSchemaDereference',
		group: ['transform'],
		version: 1,
		description: 'Dereferences a JSON Schema by resolving all $ref pointers inline',
		defaults: {
			name: 'JSON Schema Dereference',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Input Schema',
				name: 'inputSchema',
				type: 'json',
				noDataExpression: false,
				typeOptions: {
					rows: 10,
				},
				required: true,
				default: `{
	"type": "object",
	"properties": {
		"name": {
			"type": "string"
		},
		"address": {
			"$ref": "#/definitions/Address"
		}
	},
	"definitions": {
		"Address": {
			"type": "object",
			"properties": {
				"street": { "type": "string" },
				"city": { "type": "string" }
			}
		}
	}
}`,
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const schema = JSON.parse(this.getNodeParameter('inputSchema', i) as string);
				const dereferenced = await $RefParser.dereference(schema);

				returnData.push({
					json: dereferenced as IDataObject,
					pairedItem: i,
				});
			} catch (error) {
				if (!this.continueOnFail()) {
					set(error, 'node', this.getNode());
					throw new NodeOperationError(this.getNode(), error.message, { itemIndex: i });
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
