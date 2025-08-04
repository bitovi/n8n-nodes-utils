# @bitovi/n8n-nodes-utils

This is an n8n community node package that provides utility nodes for enhancing your n8n workflows. It includes nodes for JSON schema validation, regex operations, data manipulation, and Wikipedia integration.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### Quick Installation

1. Make sure to allow community nodes with `N8N_COMMUNITY_PACKAGES_ENABLED=true`
2. Once logged in to your N8N web UI, go to `/settings/community-nodes` and type `@bitovi/n8n-nodes-utils`
3. Click install and restart your n8n instance

## Operations

This package includes the following utility nodes:

### JSONSchema Validation
Validates JSON data against a provided JSON schema using the AJV library.

### Regex
Perform regular expression operations on text data.
- **Get Matches**: Extract all matches from text using a regex pattern
- **Replace**: Replace text using regex patterns with support for capture groups

### Skip
Skip a specified number of items from the input data stream.
- **Data filtering**: Remove the first N items from your data flow
- **Pagination support**: Useful for implementing pagination or data chunking

### Wikipedia
Integrate with Wikipedia to fetch content and metadata.
- **Get Content**: Retrieve the full content of a Wikipedia page
- **Get Links**: Extract all links from a Wikipedia page
- These automatically suggest the closest matching page name and follow redirects to the correct page

## Compatibility

- **Minimum n8n version**: Compatible with n8n API version 1
- **Node.js version**: Requires Node.js >= 18.10
- **Package manager**: Uses pnpm >= 9.1

This package has been tested with recent versions of n8n and follows the community node standards.

## Usage

### JSONSchema Validation Example
Use this node to validate API responses or user input data:
```json
{
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "age": { "type": "number", "minimum": 0 },
    "email": { "type": "string", "format": "email" }
  },
  "required": ["name", "email"]
}
```

### Regex Example
Extract email addresses from text:
- **Pattern**: `[\w\.-]+@[\w\.-]+\.\w+`
- **Flags**: `g` (global to find all matches)

### Wikipedia Integration
Fetch content about a topic for AI processing or content generation:
- Set **Page Name** to your topic of interest
- Enable **Auto Suggest** for fuzzy matching
- Use **Get Content** for full article text or **Get Links** for related topics

## Need help or have questions?

Need guidance on leveraging AI agents or N8N for your business? Our [AI Agents workshop](https://hubs.ly/Q02X-9Qq0) will equip you with the knowledge and tools necessary to implement successful and valuable agentic workflows.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [AJV JSON Schema Validator](https://ajv.js.org/)
- [Wikipedia API](https://github.com/dopecodez/Wikipedia)
- [Bitovi GitHub Repository](https://github.com/bitovi/n8n-nodes-utils)

## License

[MIT](./LICENSE.md)
