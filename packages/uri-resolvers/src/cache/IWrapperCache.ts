import { MaybeAsync, Uri, Wrapper } from "@polywrap/core-js";

// $start: IWrapperCache
/** A Wrapper cache */
export interface IWrapperCache {
  /** get a Wrapper from the cache, given its URI index */
  get(uri: Uri): MaybeAsync<Wrapper | undefined>;

  /** add a Wrapper to the cache, indexed by a URI */
  set(uri: Uri, wrapper: Wrapper): MaybeAsync<void>;
}
// $end
