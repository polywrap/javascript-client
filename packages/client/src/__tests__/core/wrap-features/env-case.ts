import { PluginPackage } from "@polywrap/plugin-js";
import { RecursiveResolver } from "@polywrap/uri-resolvers-js";
import { PolywrapClient } from "../../../PolywrapClient";
import { mockPluginRegistration } from "../../helpers";
import { PolywrapClientConfigBuilder } from "@polywrap/client-config-builder-js";
import { Uri, UriMap } from "@polywrap/core-js";
import { GetPathToTestWrappers } from "@polywrap/test-cases";

jest.setTimeout(200000);

export const envTestCases = (implementation: string) => {
  describe("invoke with env", () => {
    test(`invoke method without env does not require env in ${implementation}`, async () => {
      const wrapperPath = `${GetPathToTestWrappers()}/env-type/00-main/implementations/${implementation}`;
      const wrapperUri = Uri.from(`file/${wrapperPath}`);

      const config = new PolywrapClientConfigBuilder()
        .addDefaults()
        .build();

      const client = new PolywrapClient(config);

      const result = await client.invoke({
        uri: wrapperUri,
        method: "methodNoEnv",
        args: {
          arg: "test",
        },
      });

      if (!result.ok) fail(result.error);
      expect(result.value).toEqual("test");
    });

    test(`invoke method without env works with env in ${implementation}`, async () => {
      const wrapperPath = `${GetPathToTestWrappers()}/env-type/00-main/implementations/${implementation}`;
      const wrapperUri = Uri.from(`file/${wrapperPath}`);

      const env = {
        object: {
          prop: "object string",
        },
        str: "string",
        optFilledStr: "optional string",
        number: 10,
        bool: true,
        en: "FIRST",
        array: [32, 23],
      };

      const envs = {
        [wrapperUri.uri]: env
      };

      const config = new PolywrapClientConfigBuilder()
        .addDefaults()
        .addEnvs(envs)
        .build();

      const client = new PolywrapClient(config);
      
      const result = await client.invoke({
        uri: wrapperUri,
        method: "methodNoEnv",
        args: {
          arg: "test",
        },
      });

      if (!result.ok) fail(result.error);
      expect(result.value).toEqual("test");
    });

    test(`invoke method with required env works with env in ${implementation}`, async () => {
      const wrapperPath = `${GetPathToTestWrappers()}/env-type/00-main/implementations/${implementation}`;
      const wrapperUri = Uri.from(`file/${wrapperPath}`);

      const env = {
        object: {
          prop: "object string",
        },
        str: "string",
        optFilledStr: "optional string",
        number: 10,
        bool: true,
        en: "FIRST",
        array: [32, 23],
      };

      const expectedEnv = {
        str: "string",
        optFilledStr: "optional string",
        optStr: null,
        number: 10,
        optNumber: null,
        bool: true,
        optBool: null,
        object: {
          prop: "object string",
        },
        optObject: null,
        en: 0,
        optEnum: null,
        array: [32, 23],
      };

      const envs = {
        [wrapperUri.uri]: env
      };

      const config = new PolywrapClientConfigBuilder()
        .addDefaults()
        .addEnvs(envs)
        .build();

      const client = new PolywrapClient(config);
      
      const result = await client.invoke({
        uri: wrapperUri,
        method: "methodRequireEnv",
      });

      if (!result.ok) fail(result.error);
      expect(result.value).toEqual(expectedEnv);
    });

    test(`invoke method with required env throws without env registered in ${implementation}`, async () => {
      const wrapperPath = `${GetPathToTestWrappers()}/env-type/00-main/implementations/${implementation}`;
      const wrapperUri = Uri.from(`file/${wrapperPath}`);

      const config = new PolywrapClientConfigBuilder().addDefaults().build();
      const client = new PolywrapClient(config);

      const result = await client.invoke({
        uri: wrapperUri,
        method: "methodRequireEnv",
      });
      
      if (result.ok) fail("Expected error");
      expect(result.error?.message).toMatch(/Environment is not set, and it is required/g);
    });

    test(`invoke method with optional env works with env in ${implementation}`, async () => {
      const wrapperPath = `${GetPathToTestWrappers()}/env-type/00-main/implementations/${implementation}`;
      const wrapperUri = Uri.from(`file/${wrapperPath}`);

      const env = {
        object: {
          prop: "object string",
        },
        str: "string",
        optFilledStr: "optional string",
        number: 10,
        bool: true,
        en: "FIRST",
        array: [32, 23],
      };

      const expectedEnv = {
        str: "string",
        optFilledStr: "optional string",
        optStr: null,
        number: 10,
        optNumber: null,
        bool: true,
        optBool: null,
        object: {
          prop: "object string",
        },
        optObject: null,
        en: 0,
        optEnum: null,
        array: [32, 23],
      };

      const envs = {
        [wrapperUri.uri]: env
      };

      const config = new PolywrapClientConfigBuilder()
        .addDefaults()
        .addEnvs(envs)
        .build();

      const client = new PolywrapClient(config);
      
      const result = await client.invoke({
        uri: wrapperUri,
        method: "methodOptionalEnv",
      });

      if (!result.ok) fail(result.error);
      expect(result.value).toEqual(expectedEnv);
    });

    test(`invoke method with optional env works without env in ${implementation}`, async () => {
      const wrapperPath = `${GetPathToTestWrappers()}/env-type/00-main/implementations/${implementation}`;
      const wrapperUri = Uri.from(`file/${wrapperPath}`);

      const config = new PolywrapClientConfigBuilder().addDefaults().build();
      const client = new PolywrapClient(config);

      const result = await client.invoke({
        uri: wrapperUri,
        method: "methodOptionalEnv",
      });

      if (!result.ok) fail(result.error);
      expect(result.value).toEqual(null);
    });

    test(`env can be registered for any uri in resolution path in ${implementation}`, async () => {
      const wrapperPath = `${GetPathToTestWrappers()}/env-type/00-main/implementations/${implementation}`;
      const wrapperUri = Uri.from(`file/${wrapperPath}`);
      const redirectFromUri = Uri.from(`mock/from`);

      const runTestForEnvUri = async (envUri: Uri) => {
        const env = {
          object: {
            prop: "object string",
          },
          str: "string",
          optFilledStr: "optional string",
          number: 10,
          bool: true,
          en: "FIRST",
          array: [32, 23],
        };
  
        const expectedEnv = {
          str: "string",
          optFilledStr: "optional string",
          optStr: null,
          number: 10,
          optNumber: null,
          bool: true,
          optBool: null,
          object: {
            prop: "object string",
          },
          optObject: null,
          en: 0,
          optEnum: null,
          array: [32, 23],
        };

        const envs = {
          [envUri.uri]: env
        };
        
        const config = new PolywrapClientConfigBuilder()
          .addDefaults()
          .addEnvs(envs)
          .setRedirect(redirectFromUri.uri, wrapperUri.uri)
          .build();
        const client = new PolywrapClient(config);
        
        const result = await client.invoke({
          uri: redirectFromUri,
          method: "methodRequireEnv",
        });
  
        if (!result.ok) fail(result.error);
        expect(result.value).toEqual(expectedEnv);
      };

      await runTestForEnvUri(redirectFromUri);
      await runTestForEnvUri(wrapperUri);
    });
  });

  describe("subinvoke with env", () => {
    test(`subinvoke method without env does not require env in ${implementation}`, async () => {
      const subinvokerPath = `${GetPathToTestWrappers()}/env-type/01-subinvoker/implementations/${implementation}`;
      const subinvokedPath = `${GetPathToTestWrappers()}/env-type/00-main/implementations/${implementation}`;
      const { uri: subinvokerUri } = Uri.from(`file/${subinvokerPath}`);
      const { uri: subinvokedUri } = Uri.from(`file/${subinvokedPath}`);

      const config = new PolywrapClientConfigBuilder()
        .addDefaults()
        .setRedirect("mock/main", subinvokedUri)
        .build();

      const client = new PolywrapClient(config);

      const result = await client.invoke({
        uri: subinvokerUri,
        method: "subinvokeMethodNoEnv",
        args: {
          arg: "test",
        },
      });

      if (!result.ok) fail(result.error);
      expect(result.value).toEqual("test");
    });

    test(`subinvoke method without env works with env in ${implementation}`, async () => {
      const subinvokerPath = `${GetPathToTestWrappers()}/env-type/01-subinvoker/implementations/${implementation}`;
      const subinvokedPath = `${GetPathToTestWrappers()}/env-type/00-main/implementations/${implementation}`;
      const { uri: subinvokerUri } = Uri.from(`file/${subinvokerPath}`);
      const { uri: subinvokedUri } = Uri.from(`file/${subinvokedPath}`);
    
      const subinvokedEnv =  {
        object: {
          prop: "object string",
        },
        str: "string",
        optFilledStr: "optional string",
        number: 10,
        bool: true,
        en: "FIRST",
        array: [32, 23],
      };

      const envs = {
        "mock/main": subinvokedEnv
      };

      const config = new PolywrapClientConfigBuilder()
        .addDefaults()
        .setRedirect("mock/main", subinvokedUri)
        .addEnvs(envs)
        .build();

      const client = new PolywrapClient(config);

      const result = await client.invoke({
        uri: subinvokerUri,
        method: "subinvokeMethodNoEnv",
        args: {
          arg: "test",
        },
      });

      if (!result.ok) fail(result.error);
      expect(result.value).toEqual("test");
    });

    test(`subinvoke method with required env works with env in ${implementation}`, async () => {
      const subinvokerPath = `${GetPathToTestWrappers()}/env-type/01-subinvoker/implementations/${implementation}`;
      const subinvokedPath = `${GetPathToTestWrappers()}/env-type/00-main/implementations/${implementation}`;
      const { uri: subinvokerUri } = Uri.from(`file/${subinvokerPath}`);
      const { uri: subinvokedUri } = Uri.from(`file/${subinvokedPath}`);

      const subinvokedEnv =  {
        object: {
          prop: "object string",
        },
        str: "string",
        optFilledStr: "optional string",
        number: 10,
        bool: true,
        en: "FIRST",
        array: [32, 23],
      };

      const expectedSubinvokedEnv = {
        str: "string",
        optFilledStr: "optional string",
        optStr: null,
        number: 10,
        optNumber: null,
        bool: true,
        optBool: null,
        object: {
          prop: "object string",
        },
        optObject: null,
        en: 0,
        optEnum: null,
        array: [32, 23],
      };

      const envs = {
        "mock/main": subinvokedEnv
      };

      const config = new PolywrapClientConfigBuilder()
        .addDefaults()
        .setRedirect("mock/main", subinvokedUri)
        .addEnvs(envs)
        .build();

      const client = new PolywrapClient(config);

      const result = await client.invoke({
        uri: subinvokerUri,
        method: "subinvokeMethodRequireEnv",
      });

      if (!result.ok) fail(result.error);
      expect(result.value).toEqual(expectedSubinvokedEnv);
    });

    test(`subinvoke method with required env throws without env registered in ${implementation}`, async () => {
      const subinvokerPath = `${GetPathToTestWrappers()}/env-type/01-subinvoker/implementations/${implementation}`;
      const subinvokedPath = `${GetPathToTestWrappers()}/env-type/00-main/implementations/${implementation}`;
      const { uri: subinvokerUri } = Uri.from(`file/${subinvokerPath}`);
      const { uri: subinvokedUri } = Uri.from(`file/${subinvokedPath}`);

      const config = new PolywrapClientConfigBuilder()
        .addDefaults()
        .setRedirect("mock/main", subinvokedUri)
        .build();
      const client = new PolywrapClient(config);

      const result = await client.invoke({
        uri: subinvokerUri,
        method: "subinvokeMethodRequireEnv",
      });

      if (result.ok) fail("Expected error");
      expect(result.error?.message).toMatch(/Environment is not set, and it is required/g);
    });

    test(`subinvoke method with optional env works with env in ${implementation}`, async () => {
      const subinvokerPath = `${GetPathToTestWrappers()}/env-type/01-subinvoker/implementations/${implementation}`;
      const subinvokedPath = `${GetPathToTestWrappers()}/env-type/00-main/implementations/${implementation}`;
      const { uri: subinvokerUri } = Uri.from(`file/${subinvokerPath}`);
      const { uri: subinvokedUri } = Uri.from(`file/${subinvokedPath}`);

      const subinvokedEnv =  {
        object: {
          prop: "object string",
        },
        str: "string",
        optFilledStr: "optional string",
        number: 10,
        bool: true,
        en: "FIRST",
        array: [32, 23],
      };

      const expectedSubinvokedEnv = {
        str: "string",
        optFilledStr: "optional string",
        optStr: null,
        number: 10,
        optNumber: null,
        bool: true,
        optBool: null,
        object: {
          prop: "object string",
        },
        optObject: null,
        en: 0,
        optEnum: null,
        array: [32, 23],
      };

      const envs = {
        "mock/main": subinvokedEnv
      };

      const config = new PolywrapClientConfigBuilder()
        .addDefaults()
        .setRedirect("mock/main", subinvokedUri)
        .addEnvs(envs)
        .build();
      const client = new PolywrapClient(config);

      const result = await client.invoke({
        uri: subinvokerUri,
        method: "subinvokeMethodOptionalEnv",
      });

      if (!result.ok) fail(result.error);
      expect(result.value).toEqual(expectedSubinvokedEnv);
    });

    test(`subinvoke method with optional env works without env in ${implementation}`, async () => {
      const subinvokerPath = `${GetPathToTestWrappers()}/env-type/01-subinvoker/implementations/${implementation}`;
      const subinvokedPath = `${GetPathToTestWrappers()}/env-type/00-main/implementations/${implementation}`;
      const { uri: subinvokerUri } = Uri.from(`file/${subinvokerPath}`);
      const { uri: subinvokedUri } = Uri.from(`file/${subinvokedPath}`);

      const config = new PolywrapClientConfigBuilder()
        .addDefaults()
        .setRedirect("mock/main", subinvokedUri)
        .build();
      const client = new PolywrapClient(config);

      const result = await client.invoke({
        uri: subinvokerUri,
        method: "subinvokeMethodOptionalEnv",
      });

      if (!result.ok) fail(result.error);
      expect(result.value).toEqual(null);
    });

    test(`subinvoker env does not override subinvoked env in ${implementation}`, async () => {
      const subinvokerPath = `${GetPathToTestWrappers()}/env-type/02-subinvoker-with-env/implementations/${implementation}`;
      const subinvokedPath = `${GetPathToTestWrappers()}/env-type/00-main/implementations/${implementation}`;
      const { uri: subinvokerUri } = Uri.from(`file/${subinvokerPath}`);
      const { uri: subinvokedUri } = Uri.from(`file/${subinvokedPath}`);

      const subinvokedEnv = {
        object: {
          prop: "object string B",
        },
        str: "string",
        optFilledStr: "optional string",
        number: 2,
        bool: true,
        en: "FIRST",
        array: [3, 4],
      };

      const expectedSubinvokedEnv = {
        str: "string",
        optFilledStr: "optional string",
        optStr: null,
        number: 2,
        optNumber: null,
        bool: true,
        optBool: null,
        object: {
          prop: "object string B",
        },
        optObject: null,
        en: 0,
        optEnum: null,
        array: [3, 4],
      };

      const envs = {
        [subinvokerUri]: {
          object: {
            prop: "object string A",
          },
          str: "string",
          optFilledStr: "optional string",
          number: 1,
          bool: true,
          en: "FIRST",
          array: [1, 2],
        },
        "mock/main": subinvokedEnv
      };

      const config = new PolywrapClientConfigBuilder()
        .addDefaults()
        .setRedirect("mock/main", subinvokedUri)
        .addEnvs(envs)
        .build();
      const client = new PolywrapClient(config);

      const result = await client.invoke({
        uri: subinvokerUri,
        method: "subinvokeMethodRequireEnv",
      });

      if (!result.ok) fail(result.error);
      expect(result.value).toEqual(expectedSubinvokedEnv);
    });
  });

  describe("env client types", () => {
    test("plugin env types", async () => {
      const implementationUri = Uri.from("wrap://ens/some-implementation.eth");
      const envPlugin = mockPluginRegistration("ens/hello.eth");
      const client = new PolywrapClient({
        resolver: RecursiveResolver.from([
          {
            uri: envPlugin.uri,
            package: envPlugin.package,
          },
          { from: Uri.from("ens/hello.eth"), to: implementationUri },
        ]),
        envs: new UriMap([[Uri.from("wrap://ens/hello.eth"), { arg1: "10" }]]),
      });

      const mockEnv = await client.invoke({
        uri: Uri.from("ens/hello.eth"),
        method: "mockEnv",
      });

      if (!mockEnv.ok) fail(mockEnv.error);
      expect(mockEnv.value).toBeTruthy();
      expect(mockEnv.value).toMatchObject({ arg1: "10" });
    });

    test("inline plugin env types", async () => {
      const implementationUri = "wrap://ens/some-implementation.eth";
      interface MockEnv extends Record<string, unknown> {
        arg1: number;
      }

      const client = new PolywrapClient({
        resolver: RecursiveResolver.from([
          {
            uri: Uri.from(implementationUri),
            package: PluginPackage.from<MockEnv>((module) => ({
              mockEnv: (_, __, env: MockEnv): MockEnv => {
                return env;
              },
            })),
          },
        ]),
        envs: new UriMap([[Uri.from(implementationUri), { arg1: "10" }]]),
      });

      const mockEnv = await client.invoke({
        uri: Uri.from(implementationUri),
        method: "mockEnv",
      });

      if (!mockEnv.ok) fail(mockEnv.error);
      expect(mockEnv.value).toBeTruthy();
      expect(mockEnv.value).toMatchObject({ arg1: "10" });
    });
  });
};
