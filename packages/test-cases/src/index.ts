import admZip from 'adm-zip';
import axios from "axios";
import shell from "shelljs";

export const GetPathToTestWrappers = () => `${__dirname}/../wrappers`

export async function fetchWrappers(): Promise<void> {
  // function to fetch file from GitHub release
  async function fetchFromGithub(url: string) {
    // fetch file
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    if (response.status !== 200) {
      throw new Error(`Failed to fetch file from ${url}`);
    }
    return response.data;
  }

  function unzipFile(fileBuffer: Buffer, destination: string) {
    // create adm-zip instance
    const zip = new admZip(fileBuffer);
    // extract archive
    zip.extractAllTo(destination, /*overwrite*/ true);
  }

  const tag = "0.1.1"
  const repoName = "wasm-test-harness"
  const url = `https://github.com/polywrap/${repoName}/releases/download/${tag}/wrappers`;

  try {
    const buffer = await fetchFromGithub(url);
    const zipBuiltFolder = GetPathToTestWrappers();
    unzipFile(buffer, zipBuiltFolder);
    shell.exec(`rm -rf node_modules`)
    console.log(`Wrappers folder fetch successful`);
  } catch (error) {
    console.log(`An error occurred: ${error.message}`);
  }
}