import { Result, ResultErr, ResultOk } from "@polywrap/result";

// $start: UriConfig
/** URI configuration */
export interface UriConfig {
  /** URI Authority: allows the Polywrap URI resolution algorithm to determine an authoritative URI resolver. */
  authority: string;

  /** URI Path: tells the Authority where the Wrapper resides. */
  path: string;

  /** Full string representation of URI */
  uri: string;
}
// $end

// $start: Uri
/**
 * A Polywrap URI. Some examples of valid URIs are:
 * wrap://https/domain.com
 * wrap://ipfs/QmHASH
 * wrap://ens/sub.domain.eth
 * wrap://file/directory/file.txt
 *
 * Some example short-hand URIs (utilizing inference):
 * ipfs/QmHASH        -> wrap://ipfs/QmHASH
 * https://domain.com -> wrap://https/domain.com
 *
 * URI inference is performed in the following ways:
 * 1. If wrap:// is missing, it will be added.
 * 2. If non-wrap schema exists, it becomes the authority.
 *
 * Breaking down the various parts of the URI, as it applies
 * to [the URI standard](https://tools.ietf.org/html/rfc3986#section-3):
 * **wrap://** - URI Scheme: differentiates Polywrap URIs.
 * **ens/** - URI Authority: allows the Polywrap URI resolution algorithm to determine an authoritative URI resolver.
 * **sub.domain.eth** - URI Path: tells the Authority where the Wrapper resides.
 */
export class Uri {
  // $end
  private _config: UriConfig;

  // $start: Uri-authority
  /** @returns Uri authority */
  public get authority(): string /* $ */ {
    return this._config.authority;
  }

  // $start: Uri-path
  /** @returns Uri path */
  public get path(): string /* $ */ {
    return this._config.path;
  }

  // $start: Uri-uri
  /** @returns Uri string representation */
  public get uri(): string /* $ */ {
    return this._config.uri;
  }

  // $start: Uri-constructor
  /**
   * Construct a Uri instance from a wrap URI string
   *
   * @remarks
   * Throws if URI string is invalid
   *
   * @param uri - a string representation of a wrap URI
   */
  constructor(uri: string) /* $ */ {
    const result = Uri.parseUri(uri);
    if (!result.ok) {
      throw result.error;
    }
    this._config = result.value;
  }

  // $start: Uri-equals
  /** Test two Uri instances for equality */
  public static equals(a: Uri, b: Uri): boolean /* $ */ {
    return a.uri === b.uri;
  }

  // $start: Uri-isUri
  /**
   * Check if a value is an instance of Uri
   *
   * @param value - value to check
   * @returns true if value is a Uri instance */
  public static isUri(value: unknown): value is Uri /* $ */ {
    return typeof value === "object" && (value as Uri).uri !== undefined;
  }

  // $start: Uri-isValidUri
  /**
   * Test if a URI string is a valid wrap URI
   *
   * @param uri - URI string
   * @param parsed? - UriConfig to update (mutate) with content of URI string
   * @returns true if input string is a valid wrap URI */
  public static isValidUri(uri: string, parsed?: UriConfig): boolean /* $ */ {
    const result = Uri.parseUri(uri);

    if (parsed && result.ok) {
      Object.assign(parsed, result.value);
    }

    return result.ok;
  }

  // $start: Uri-parseUri
  /**
   * Parse a wrap URI string into its authority and path
   *
   * @param uri - a string representation of a wrap URI
   * @returns A Result containing a UriConfig, if successful, or an error
   */
  public static parseUri(input: string): Result<UriConfig, Error> /* $ */ {
    const authorityDelimiter = "/";
    const schemeDelimiter = "://";
    const wrapScheme = "wrap://";

    const validUriExamples =
      "wrap://ipfs/QmHASH\n" +
      "wrap://ens/domain.eth\n" +
      "ipfs/QmHASH\n" +
      "ens/domain.eth\n" +
      "https://domain.com/path\n\n";

    if (!input) {
      return ResultErr(
        Error(
          "The provided URI is empty, here are some examples of valid URIs:\n" +
            validUriExamples
        )
      );
    }

    let processedUri = input.trim();

    // Remove leading "/"
    if (processedUri.startsWith(authorityDelimiter)) {
      processedUri = processedUri.substring(1);
    }

    // Check if the string starts with a non-wrap URI scheme
    if (!processedUri.startsWith(wrapScheme)) {
      const schemeIndex = processedUri.indexOf(schemeDelimiter);
      const authorityIndex = processedUri.indexOf(authorityDelimiter);
      if (schemeIndex !== -1) {
        // Make sure the string before the scheme doesn't contain an authority
        if (!(authorityIndex !== -1 && schemeIndex > authorityIndex)) {
          processedUri =
            processedUri.substring(0, schemeIndex) +
            "/" +
            processedUri.substring(schemeIndex + schemeDelimiter.length);
        }
      }
    } else {
      processedUri = processedUri.substring(wrapScheme.length);
    }

    // Split the string into parts, using "/" as a delimeter
    const parts = processedUri.split(authorityDelimiter);

    if (parts.length < 2) {
      return ResultErr(
        Error(
          `URI authority is missing, here are some examples of valid URIs:\n` +
            validUriExamples +
            `Invalid URI Received: ${input}`
        )
      );
    }

    // Extract the authority and path
    const authority = parts[0];
    const path = parts.slice(1).join("/");

    if (!path) {
      return ResultErr(
        Error(
          `URI path is missing, here are some examples of valid URIs:\n` +
            validUriExamples +
            `Invalid URI Received: ${input}`
        )
      );
    }

    // Add "wrap://" if not already present
    if (!processedUri.startsWith("wrap://")) {
      processedUri = "wrap://" + processedUri;
    }

    return ResultOk({
      uri: processedUri,
      authority,
      path,
    });
  }

  // $start: Uri-from
  /**
   * Construct a Uri instance from a Uri or a wrap URI string
   *
   * @remarks
   * Throws if URI string is invalid
   *
   * @param uri - a Uri instance or a string representation of a wrap URI
   */
  public static from(uri: Uri | string): Uri /* $ */ {
    if (typeof uri === "string") {
      return new Uri(uri);
    } else if (Uri.isUri(uri)) {
      return uri;
    } else {
      throw Error(`Unknown uri type, cannot convert. ${JSON.stringify(uri)}`);
    }
  }

  // $start: Uri-toString
  /** @returns Uri string representation */
  public toString(): string /* $ */ {
    return this._config.uri;
  }

  // $start: Uri-toJSON
  /** @returns Uri string representation */
  public toJSON(): string /* $ */ {
    return this._config.uri;
  }
}
