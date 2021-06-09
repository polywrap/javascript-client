import { PluginPackage, Uri } from ".";

import { Tracer } from "@web3api/tracing-js";

export interface UriRedirect<TUri = string> {
  /** Redirect from this URI */
  from: TUri;

  /** The destination URI, or plugin, that will now handle the invocation. */
  // TODO: currently UriRedirects are used for: plugins, implementations, and redirects. This is either elegant, or confusing...
  //       Should look at what it looks like to seperate these.
  to: TUri | PluginPackage;
}

export const sanitizeUriRedirects = Tracer.traceFunc(
  "core: sanitizeUriRedirects",
  (input: UriRedirect<string>[]): UriRedirect<Uri>[] => {
    const output: UriRedirect<Uri>[] = [];
    for (const definition of input) {
      const from = new Uri(definition.from);
      const to =
        typeof definition.to === "string"
          ? new Uri(definition.to)
          : definition.to;

      output.push({
        from: from,
        to: to,
      });
    }

    return output;
  }
);

    input: UriInterfaceImplementations[]
  ): UriInterfaceImplementations<Uri>[] => {