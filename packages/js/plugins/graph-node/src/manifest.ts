import {
  createSchemaDocument,
  PluginManifest
} from "@web3api/core-js";

export const manifest: PluginManifest = {
  // TODO: use the schema.graphql
  // https://github.com/Web3-API/prototype/issues/101
  schema: createSchemaDocument("type Query { dummy: String }"),
  implemented: [],
  imported: []
};
