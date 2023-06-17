import { ClientConfigBuilder, BuilderConfig } from "@polywrap/client-config-builder-js";
import { loggerPlugin } from "@polywrap/logger-plugin-js";
import { datetimePlugin } from "@polywrap/datetime-plugin-js";
import { concurrentPromisePlugin } from "@polywrap/concurrent-plugin-js";

export function getBundleConfig(): BuilderConfig {
  const plugins = {
    logger: {
      uri: "plugin/logger@1.0.0",
      plugin: loggerPlugin({}),
      implements: ["ens/wraps.eth:logger@1.0.0"],
    },
    datetime: {
      uri: "plugin/datetime@1.0.0",
      plugin: datetimePlugin({}),
      implements: ["ens/wraps.eth:datetime@1.0.0"]
    },
    concurrent: {
      uri: "plugin/concurrent@1.0.0",
      plugin: concurrentPromisePlugin({}),
      implements: ["ens/wraps.eth:concurrent@1.0.0"],
    },
  };

  const builder = new ClientConfigBuilder();

  // Add all plugin packages
  for (const plugin of Object.values(plugins)) {
    builder.addPackage(plugin.uri, plugin.plugin);

    // Add all interface implementations & redirects
    for (const interfaceUri of plugin.implements) {
      builder.addInterfaceImplementation(interfaceUri, plugin.uri);
      builder.addRedirect(interfaceUri, plugin.uri);
    }
  }

  return builder.config;
}
