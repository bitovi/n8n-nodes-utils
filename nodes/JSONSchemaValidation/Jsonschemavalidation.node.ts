import {
	NodeOperationError,
	type IExecuteFunctions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
} from 'n8n-workflow';
import Ajv from 'ajv';
import { set } from 'lodash';

export class JSONSchemaValidation implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'JSONSchema Validation',
		icon: 'file:ajv.svg',
		name: 'jsonschemavalidation',
		group: ['transform'],
		version: 1,
		description: 'JSONSchema Validation Node',
		defaults: {
			name: 'JSONSchema Validation',
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
		"state": {
			"type": "string"
		},
		"cities": {
			"type": "array",
			"items": {
				"type": "string"
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
			const schema = JSON.parse(this.getNodeParameter('inputSchema', i) as string);

			const ajv = new Ajv();
			const validate = ajv.compile(schema);

			try {
				const valid = validate(items[i].json);

				if (!valid) {
					throw new NodeOperationError(
						this.getNode(),
						`Input data does not match schema: ${ajv.errorsText(validate.errors)}`,
						{ itemIndex: i },
					);
				}

				returnData.push(items[i]);
			} catch (error) {
				if (!this.continueOnFail()) {
					set(error, 'node', this.getNode());
					throw error;
				}
				returnData.push({
					json: {
						error: error.message,
						errors: validate.errors,
					},
					pairedItem: i,
					error,
				});
			}
		}

		return [returnData];
	}
}
