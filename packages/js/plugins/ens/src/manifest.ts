import {
  createSchemaDocument,
  PluginManifest,
  Uri
} from "@web3api/core-js";

export const manifest: PluginManifest = {
  // TODO: use the schema.graphql
  schema: createSchemaDocument("type Query { dummy: String }"),
  implemented: [new Uri("w3/api-resolver")],
  imported: [new Uri("ens/ethereum.web3api.eth")]
};
