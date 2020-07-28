import { Signer, ethers } from "ethers";
import {
  ExternalProvider,
  JsonRpcProvider,
  Web3Provider,
} from "@ethersproject/providers";
import { getAddress } from "@ethersproject/address";
import { Base58 } from "@ethersproject/basex";

type Address = string;
type AccountIndex = number;

export type EthereumSigner = Signer | Address | AccountIndex;
export type EthereumProvider = string | ExternalProvider;
export type EthereumClient = JsonRpcProvider | Web3Provider;

export interface IEthereumConfig {
  provider: EthereumProvider;
  signer?: EthereumSigner;
  ens?: Address;
}

export class Ethereum {

  // @ts-ignore: initialized within setProvider
  private _client: EthereumClient;

  constructor(private _config: IEthereumConfig) {
    const { provider, signer, ens } = _config;

    // Sanitize Provider & Signer
    this.setProvider(provider, signer ? signer : 0);

    // Sanitize ENS address
    if (ens) {
      this.setENS(ens);
    }
  }

  public setProvider(provider: EthereumProvider, signer?: EthereumSigner) {
    this._config.provider = provider;

    if (typeof provider === "string") {
      this._client = new JsonRpcProvider(provider);
    } else {
      this._client = new Web3Provider(provider);
    }

    if (signer) {
      this.setSigner(signer);
    }
  }

  public setSigner(signer: EthereumSigner) {
    if (typeof signer === "string") {
      this._config.signer = getAddress(signer);
    } else if (Signer.isSigner(signer)) {
      this._config.signer = signer;

      if (signer.provider !== this._config.provider) {
        throw Error(
          `Signer's connected provider does not match the config's ` +
          `provider. Please call "setProvider(...)" before calling `+
          `"setSigner(...)" if a different provider is desired.`
        )
      }
    } else {
      this._config.signer = signer;
    }
  }

  public setENS(ens: Address) {
    this._config.ens = getAddress(ens);
  }

  public getSigner(): ethers.Signer {
    const { signer } = this._config;

    if (this._config.signer === undefined) {
      throw Error("Signer is undefined, this should never happen.");
    }

    if (typeof signer === "string" || typeof signer === "number") {
      return this._client.getSigner(signer);
    } else if (Signer.isSigner(signer)) {
      return signer;
    } else {
      throw Error(`Signer is an unrecognized type, this should never happen. \n${signer}`);
    }
  }

  public getContract(address: Address, abi: string[]): ethers.Contract {
    return new ethers.Contract(address, abi, this.getSigner());
  }

  public async ensToCID(domain: string): Promise<string> {
    const ensAddress = this._config.ens || "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
    const ensAbi = [
      "function resolver(bytes32 node) external view returns (address)"
    ];
    const resolverAbi = [
      "function contenthash(bytes32 nodehash) view returns (bytes)",
      "function content(bytes32 nodehash) view returns (bytes32)",
    ];
    const ensContract = this.getContract(ensAddress, ensAbi);
    const domainNode = ethers.utils.namehash(domain);

    // Get the node's resolver address
    const resolverAddress = await ensContract.resolver(domainNode);

    const resolverContract = this.getContract(resolverAddress, resolverAbi);

    // Get the CID stored at this domain
    let hash;
    try {
      hash = await resolverContract.contenthash(domainNode);
    } catch (e) {
      try {
        // Fallback, contenthash doesn't exist, try content
        hash = await resolverContract.content(domainNode);
      } catch (err) {
        // The resolver contract is unknown...
        throw Error(`Incompatible resolver ABI at address ${resolverAddress}`);
      }
    }

    if (hash === "0x") {
      return ""
    }

    if (hash.substring(0, 10) === "0xe3010170" && ethers.utils.isHexString(hash, 38)) {
      return Base58.encode(ethers.utils.hexDataSlice(hash, 4));
    } else {
      throw Error(`Unkown CID format, CID hash: ${hash}`);
    }
  }

  public static isENSDomain(domain: string) {
    return ethers.utils.isValidName(domain);
  }
}
