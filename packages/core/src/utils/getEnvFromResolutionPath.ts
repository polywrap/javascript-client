import { Uri, CoreClient, WrapperEnv } from "../types";

export const getEnvFromResolutionPath = (
  resolutionPath: Uri[],
  client: CoreClient
): Readonly<WrapperEnv> | undefined => {
  for (const uri of resolutionPath) {
    const env = client.getEnvByUri(uri);

    if (env) {
      return env;
    }
  }

  return undefined;
};
