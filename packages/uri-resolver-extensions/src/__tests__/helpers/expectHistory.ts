import { buildCleanUriHistory, IUriResolutionStep } from "@polywrap/core-js";
import { GetPathToTestWrappers } from "@polywrap/test-cases";
import fs from "fs";

export const expectHistory = async (
  receivedHistory: IUriResolutionStep<unknown>[] | undefined,
  historyFileName: string,
  replaceFilePaths?: boolean
): Promise<void> => {
  if (!receivedHistory) {
    fail("History is not defined");
  }

  const expectedCleanHistoryStr = await fs.promises.readFile(
    `${__dirname}/../histories/${historyFileName}.json`,
    "utf-8"
  );
  const expectedCleanHistory = JSON.stringify(JSON.parse(expectedCleanHistoryStr), null, 2);


  let receivedCleanHistory = replaceAll(
    JSON.stringify(buildCleanUriHistory(receivedHistory), null, 2),
    `${GetPathToTestWrappers()}`,
    "$root-wrapper-dir"
  );

  if (replaceFilePaths) {
    receivedCleanHistory = receivedCleanHistory
      .replace(/file: \\"[^"]+\\"/gm, "")
      .replace(/file: "[^"]+"/gm, "");
  }

  expect(receivedCleanHistory).toEqual(expectedCleanHistory);
};

function replaceAll(str: string, strToReplace: string, replaceStr: string) {
  return str.replace(new RegExp(strToReplace, "g"), replaceStr);
}
