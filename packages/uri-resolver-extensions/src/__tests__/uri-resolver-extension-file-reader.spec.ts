import { UriResolverExtensionFileReader } from "../UriResolverExtensionFileReader";

import {
  PolywrapClient,
  ClientConfigBuilder,
  Uri
} from "@polywrap/client-js";
import {
  PluginModule,
  PluginWrapper
} from "@polywrap/plugin-js";

const mockUriResolverExtUri = "wrap://mock/uri-resolver-ext";
const mockFile = Uint8Array.from([0, 1, 2]);

class MockUriResolverExt extends PluginModule<{}, {}> {
  callCount: number = 0;

  getCallCount() {
    return this.callCount;
  }

  getFile(args: { path: string }) {
    ++this.callCount;
    if (args.path.includes("throw/now")) {
      throw Error("failed during read file");
    } else if (args.path.includes("not/found")) {
      return null;
    }
    return mockFile;
  }
}

function createMockClient(): PolywrapClient {
  const config = new ClientConfigBuilder()
    .addWrapper(
      mockUriResolverExtUri,
      new PluginWrapper(
        { version: "0.1", type: "plugin", name: "counter", abi: {} },
        new MockUriResolverExt({})
      )
    )
    .build();
  return new PolywrapClient(config);
}

function createUriResolverExtensionFileReader(
  mockClient: PolywrapClient
): UriResolverExtensionFileReader {
  return new UriResolverExtensionFileReader(
    Uri.from(mockUriResolverExtUri),
    Uri.from("wrap://foo/bar"),
    mockClient
  );
}

async function getCallCount(client: PolywrapClient): Promise<number> {
  const result = await client.invoke<number>({
    uri: mockUriResolverExtUri,
    method: "getCallCount"
  });

  if (!result.ok) throw result.error;
  return result.value;
}

describe("UriResolverExtensionFileReader", () => {
  it("resolves a file", async () => {
    const mockClient = createMockClient();
    const fileReader = createUriResolverExtensionFileReader(mockClient);

    const file = await fileReader.readFile("some/path");
    expect(file.ok).toBeTruthy();
    if (!file.ok) throw file.error;
    expect(file.value).toMatchObject(mockFile);
  });

  it("caches files", async () => {
    const mockClient = createMockClient();
    const fileReader = createUriResolverExtensionFileReader(mockClient);

    const file1 = await fileReader.readFile("some/path");
    expect(file1.ok).toBeTruthy();
    if (!file1.ok) throw file1.error;
    expect(file1.value).toMatchObject(mockFile);

    // Ensure the call counter is 1
    expect(await getCallCount(mockClient)).toBe(1);

    // Call again
    const file2 = await fileReader.readFile("some/path");
    expect(file2.ok).toBeTruthy();
    if (!file2.ok) throw file2.error;
    expect(file2.value).toMatchObject(mockFile);

    // Ensure the call counter is still 1
    expect(await getCallCount(mockClient)).toBe(1);
  });

  it("can synchronize parallel requests", async () => {
    const mockClient = createMockClient();
    const fileReader = createUriResolverExtensionFileReader(mockClient);

    const results = await Promise.all([
      fileReader.readFile("some/path"),
      fileReader.readFile("some/path")
    ]);

    for (const result of results) {
      expect(result.ok).toBeTruthy();
      if (!result.ok) throw result.error;
      expect(result.value).toMatchObject(mockFile);
    }

    // Ensure the call counter is 1
    expect(await getCallCount(mockClient)).toBe(1);
  });

  it("can retry when an error is thrown", async () => {
    const mockClient = createMockClient();
    const fileReader = createUriResolverExtensionFileReader(mockClient);

    // It returns an error
    const file1 = await fileReader.readFile("throw/now");
    expect(file1.ok).toBeFalsy();

    // Ensure the call counter is 1
    expect(await getCallCount(mockClient)).toBe(1);

    // Call again
    const file2 = await fileReader.readFile("throw/now");
    expect(file2.ok).toBeFalsy();

    // Ensure the call counter is now 2
    expect(await getCallCount(mockClient)).toBe(2);
  });

  it("caches result when not found", async () => {
    const mockClient = createMockClient();
    const fileReader = createUriResolverExtensionFileReader(mockClient);

    const file1 = await fileReader.readFile("not/found");
    expect(file1.ok).toBeFalsy();

    // Ensure the call counter is 1
    expect(await getCallCount(mockClient)).toBe(1);

    // Call again
    const file2 = await fileReader.readFile("not/found");
    expect(file2.ok).toBeFalsy();

    // Ensure the call counter is still 1
    expect(await getCallCount(mockClient)).toBe(1);
  });
});
