import {
  Client,
  Module,
  Input_tryResolveUri,
  Input_getFile,
  UriResolver_MaybeUriOrManifest,
  Bytes,
  Ethereum_Query,
} from "./w3";

import { ethers } from "ethers";
import { Base58 } from "@ethersproject/basex";
import { getAddress } from "@ethersproject/address";

export type Address = string;

export interface Addresses {
  [network: string]: Address;
}

export interface QueryConfig extends Record<string, unknown> {
  addresses?: Addresses;
}

export class Query extends Module<QueryConfig> {
  public static defaultEnsAddress =
    "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";

  constructor(config: QueryConfig) {
    super(config);

    // Sanitize address
    if (this.config.addresses) {
      this._setAddresses(this.config.addresses);
    }
  }

  async tryResolveUri(
    input: Input_tryResolveUri,
    client: Client
  ): Promise<UriResolver_MaybeUriOrManifest | null> {
    if (input.authority !== "ens") {
      return null;
    }

    try {
      const cid = await this.ensToCID(input.path, client);

      if (!cid) {
        return null;
      }

      return {
        uri: `ipfs/${cid}`,
        manifest: null,
      };
    } catch (e) {
      // TODO: logging https://github.com/web3-api/monorepo/issues/33
    }

    // Nothing found
    return { uri: null, manifest: null };
  }

  getFile(_input: Input_getFile, _client: Client): Bytes | null {
    return null;
  }

  async ensToCID(domain: string, client: Client): Promise<string> {
    const ensAbi = {
      resolver:
        "function resolver(bytes32 node) external view returns (address)",
    };
    const resolverAbi = {
      contenthash:
        "function contenthash(bytes32 nodehash) view returns (bytes)",
      content: "function content(bytes32 nodehash) view returns (bytes32)",
    };

    let ensAddress = Query.defaultEnsAddress;

    // Remove the ENS URI scheme & authority
    domain = domain.replace("w3://", "");
    domain = domain.replace("ens/", "");

    // Check for non-default network
    let network = "mainnet";
    const hasNetwork = /^[A-Za-z0-9]+\//i.exec(domain);
    if (hasNetwork) {
      network = domain.substring(0, domain.indexOf("/"));

      // Remove the network from the domain URI's path
      domain = domain.replace(network + "/", "");

      // Lowercase only
      network = network.toLowerCase();

      // Check if we have a custom address configured
      // for this network
      if (this.config.addresses && this.config.addresses[network]) {
        ensAddress = this.config.addresses[network];
      }
    }

    const domainNode = ethers.utils.namehash(domain);

    const callContractView = async (
      address: string,
      method: string,
      args: string[],
      networkNameOrChainId?: string
    ): Promise<string> => {
      const { data, error } = await Ethereum_Query.callContractView(
        {
          address,
          method,
          args,
          connection: networkNameOrChainId
            ? {
                networkNameOrChainId,
              }
            : undefined,
        },
        client
      );

      if (error) {
        throw error;
      }

      if (data) {
        if (typeof data !== "string") {
          throw Error(
            `Malformed data returned from Ethereum.callContractView: ${data}`
          );
        }

        return data;
      }

      throw Error(
        `Ethereum.callContractView returned nothing.\nData: ${data}\nError: ${error}`
      );
    };

    // Get the node's resolver address
    const resolverAddress = await callContractView(
      ensAddress,
      ensAbi.resolver,
      [domainNode],
      network
    );

    // Get the CID stored at this domain
    let hash;
    try {
      hash = await callContractView(
        resolverAddress,
        resolverAbi.contenthash,
        [domainNode],
        network
      );
    } catch (e) {
      try {
        // Fallback, contenthash doesn't exist, try content
        hash = await callContractView(
          resolverAddress,
          resolverAbi.content,
          [domainNode],
          network
        );
      } catch (err) {
        // The resolver contract is unknown...
        throw Error(`Incompatible resolver ABI at address ${resolverAddress}`);
      }
    }

    if (hash === "0x") {
      return "";
    }

    if (
      hash.substring(0, 10) === "0xe3010170" &&
      ethers.utils.isHexString(hash, 38)
    ) {
      return Base58.encode(ethers.utils.hexDataSlice(hash, 4));
    } else {
      throw Error(`Unknown CID format, CID hash: ${hash}`);
    }
  }

  private _setAddresses(addresses: Addresses): void {
    this.config.addresses = {};

    for (const network of Object.keys(addresses)) {
      this.config.addresses[network] = getAddress(addresses[network]);
    }
  }
}