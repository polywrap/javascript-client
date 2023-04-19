import { CoreClient } from "..";

import { Uri, IUriResolutionContext } from "@polywrap/wrap-js";
import { Result, ResultOk } from "@polywrap/result";

export const applyResolution = async (
  uri: Uri,
  client: CoreClient,
  resolutionContext?: IUriResolutionContext
): Promise<Result<Uri, unknown>> => {
  const result = await client.tryResolveUri({ uri, resolutionContext });

  if (!result.ok) {
    return result;
  }

  return ResultOk(result.value.uri);
};
