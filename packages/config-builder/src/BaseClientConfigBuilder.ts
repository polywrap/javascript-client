import { BuilderConfig, ClientConfigBuilder } from "./types";
import { BundleName } from "./bundles";

import {
  CoreClientConfig,
  Wrapper,
  IWrapPackage,
  Uri,
} from "@polywrap/core-js";
import { UriResolverLike } from "@polywrap/uri-resolvers-js";

export abstract class BaseClientConfigBuilder implements ClientConfigBuilder {
  protected _config: BuilderConfig = {
    envs: {},
    interfaces: {},
    redirects: {},
    wrappers: {},
    packages: {},
    resolvers: [],
  };

  abstract addDefaults(): ClientConfigBuilder;
  abstract addBundle(bundle: BundleName): ClientConfigBuilder;
  abstract build(): CoreClientConfig;

  get config(): BuilderConfig {
    return this._config;
  }

  add(config: Partial<BuilderConfig>): ClientConfigBuilder {
    if (config.envs) {
      this.addEnvs(config.envs);
    }

    if (config.redirects) {
      this.setRedirects(config.redirects);
    }

    if (config.wrappers) {
      this.setWrappers(config.wrappers);
    }

    if (config.packages) {
      this.setPackages(config.packages);
    }

    if (config.interfaces) {
      for (const [interfaceUri, implementations] of Object.entries(
        config.interfaces
      )) {
        this.addInterfaceImplementations(interfaceUri, implementations);
      }
    }

    if (config.resolvers) {
      this.addResolvers(config.resolvers);
    }

    return this;
  }

  setWrapper(uri: string, wrapper: Wrapper): ClientConfigBuilder {
    this._config.wrappers[this.sanitizeUri(uri)] = wrapper;

    return this;
  }

  setWrappers(uriWrappers: Record<string, Wrapper>): ClientConfigBuilder {
    for (const uri in uriWrappers) {
      this.setWrapper(this.sanitizeUri(uri), uriWrappers[uri]);
    }

    return this;
  }

  removeWrapper(uri: string): ClientConfigBuilder {
    delete this._config.wrappers[this.sanitizeUri(uri)];

    return this;
  }

  setPackage(uri: string, wrapPackage: IWrapPackage): ClientConfigBuilder {
    this._config.packages[this.sanitizeUri(uri)] = wrapPackage;

    return this;
  }

  setPackages(uriPackages: Record<string, IWrapPackage>): ClientConfigBuilder {
    for (const uri in uriPackages) {
      this.setPackage(this.sanitizeUri(uri), uriPackages[uri]);
    }

    return this;
  }

  removePackage(uri: string): ClientConfigBuilder {
    delete this._config.packages[this.sanitizeUri(uri)];

    return this;
  }

  addEnv(uri: string, env: Record<string, unknown>): ClientConfigBuilder {
    const sanitizedUri = this.sanitizeUri(uri);
    this._config.envs[sanitizedUri] = {
      ...this._config.envs[sanitizedUri],
      ...env,
    };

    return this;
  }

  addEnvs(envs: Record<string, Record<string, unknown>>): ClientConfigBuilder {
    for (const [uri, env] of Object.entries(envs)) {
      this.addEnv(this.sanitizeUri(uri), env);
    }

    return this;
  }

  removeEnv(uri: string): ClientConfigBuilder {
    delete this._config.envs[this.sanitizeUri(uri)];

    return this;
  }

  setEnv(uri: string, env: Record<string, unknown>): ClientConfigBuilder {
    this._config.envs[this.sanitizeUri(uri)] = env;

    return this;
  }

  addInterfaceImplementation(
    interfaceUri: string,
    implementationUri: string
  ): ClientConfigBuilder {
    const existingInterface = this._config.interfaces[
      this.sanitizeUri(interfaceUri)
    ];

    if (existingInterface) {
      existingInterface.add(this.sanitizeUri(implementationUri));
    } else {
      this._config.interfaces[this.sanitizeUri(interfaceUri)] = new Set([
        this.sanitizeUri(implementationUri),
      ]);
    }

    return this;
  }

  addInterfaceImplementations(
    interfaceUri: string,
    implementationUris: Array<string> | Set<string>
  ): ClientConfigBuilder {
    const existingInterface = this._config.interfaces[
      this.sanitizeUri(interfaceUri)
    ];

    if (existingInterface) {
      for (const implementationUri of implementationUris) {
        existingInterface.add(this.sanitizeUri(implementationUri));
      }
    } else {
      const sanitizedImplUris = [...implementationUris].map((x) =>
        this.sanitizeUri(x)
      );
      this._config.interfaces[this.sanitizeUri(interfaceUri)] = new Set(
        sanitizedImplUris
      );
    }

    return this;
  }

  removeInterfaceImplementation(
    interfaceUri: string,
    implementationUri: string
  ): ClientConfigBuilder {
    const existingInterface = this._config.interfaces[
      this.sanitizeUri(interfaceUri)
    ];

    if (!existingInterface) return this;

    existingInterface.delete(this.sanitizeUri(implementationUri));

    if (existingInterface.size == 0) {
      delete this.config.interfaces[this.sanitizeUri(interfaceUri)];
    }

    if (existingInterface.size == 0) {
      delete this._config.interfaces[interfaceUri];
    }

    return this;
  }

  setRedirect(from: string, to: string): ClientConfigBuilder {
    this._config.redirects[this.sanitizeUri(from)] = this.sanitizeUri(to);

    return this;
  }

  setRedirects(redirects: Record<string, string>): ClientConfigBuilder {
    for (const uri in redirects) {
      this.setRedirect(this.sanitizeUri(uri), this.sanitizeUri(redirects[uri]));
    }

    return this;
  }

  removeRedirect(from: string): ClientConfigBuilder {
    delete this._config.redirects[this.sanitizeUri(from)];

    return this;
  }

  addResolver(resolver: UriResolverLike): ClientConfigBuilder {
    this._config.resolvers.push(resolver);

    return this;
  }

  addResolvers(resolvers: UriResolverLike[]): ClientConfigBuilder {
    for (const resolver of resolvers) {
      this.addResolver(resolver);
    }

    return this;
  }

  private sanitizeUri(uri: string): string {
    return Uri.from(uri).uri;
  }
}
