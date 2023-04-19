/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/ban-types */

import { u32 } from "./helpers/types";

export interface WrapImports extends WebAssembly.Imports {
  wrap: {
    __wrap_subinvoke: (
      uriPtr: u32,
      uriLen: u32,
      methodPtr: u32,
      methodLen: u32,
      argsPtr: u32,
      argsLen: u32
    ) => Promise<boolean>;
    __wrap_subinvoke_result_len: () => u32;
    __wrap_subinvoke_result: (ptr: u32) => void;
    __wrap_subinvoke_error_len: () => u32;
    __wrap_subinvoke_error: (ptr: u32) => void;
    __wrap_subinvokeImplementation: (
      interfaceUriPtr: u32,
      interfaceUriLen: u32,
      implUriPtr: u32,
      implUriLen: u32,
      methodPtr: u32,
      methodLen: u32,
      argsPtr: u32,
      argsLen: u32
    ) => Promise<boolean>;
    __wrap_subinvokeImplementation_result_len: () => u32;
    __wrap_subinvokeImplementation_result: (ptr: u32) => void;
    __wrap_subinvokeImplementation_error_len: () => u32;
    __wrap_subinvokeImplementation_error: (ptr: u32) => void;
    __wrap_invoke_args: (methodPtr: u32, argsPtr: u32) => void;
    __wrap_invoke_result: (ptr: u32, len: u32) => void;
    __wrap_invoke_error: (ptr: u32, len: u32) => void;
    __wrap_getImplementations: (uriPtr: u32, uriLen: u32) => Promise<boolean>;
    __wrap_getImplementations_result_len: () => u32;
    __wrap_getImplementations_result: (ptr: u32) => void;
    __wrap_abort: (
      msgPtr: u32,
      msgLen: u32,
      filePtr: u32,
      fileLen: u32,
      line: u32,
      column: u32
    ) => void;
    __wrap_debug_log: (ptr: u32, len: u32) => void;
    __wrap_load_env: (ptr: u32) => void;
  };
  env: {
    memory: WebAssembly.Memory;
  };
}
