import { WrapManifest } from "@polywrap/wrap-manifest-types-js";

export const manifest: WrapManifest = {
  name: "Sha3",
  type: "plugin",
  version: "0.1",
  abi: {
    version: "0.1",
    moduleType: {
      type: "Module",
      kind: 128,
      methods: [
        {
          type: "Method",
          name: "sha3_512",
          required: true,
          kind: 64,
          arguments: [
            {
              type: "String",
              name: "message",
              required: true,
              kind: 34,
              scalar: {
                type: "String",
                name: "message",
                required: true,
                kind: 4,
              },
            },
          ],
          return: {
            type: "String",
            name: "sha3_512",
            required: true,
            kind: 34,
            scalar: {
              type: "String",
              name: "sha3_512",
              required: true,
              kind: 4,
            },
          },
        },
        {
          type: "Method",
          name: "sha3_384",
          required: true,
          kind: 64,
          arguments: [
            {
              type: "String",
              name: "message",
              required: true,
              kind: 34,
              scalar: {
                type: "String",
                name: "message",
                required: true,
                kind: 4,
              },
            },
          ],
          return: {
            type: "String",
            name: "sha3_384",
            required: true,
            kind: 34,
            scalar: {
              type: "String",
              name: "sha3_384",
              required: true,
              kind: 4,
            },
          },
        },
        {
          type: "Method",
          name: "sha3_256",
          required: true,
          kind: 64,
          arguments: [
            {
              type: "String",
              name: "message",
              required: true,
              kind: 34,
              scalar: {
                type: "String",
                name: "message",
                required: true,
                kind: 4,
              },
            },
          ],
          return: {
            type: "String",
            name: "sha3_256",
            required: true,
            kind: 34,
            scalar: {
              type: "String",
              name: "sha3_256",
              required: true,
              kind: 4,
            },
          },
        },
        {
          type: "Method",
          name: "sha3_224",
          required: true,
          kind: 64,
          arguments: [
            {
              type: "String",
              name: "message",
              required: true,
              kind: 34,
              scalar: {
                type: "String",
                name: "message",
                required: true,
                kind: 4,
              },
            },
          ],
          return: {
            type: "String",
            name: "sha3_224",
            required: true,
            kind: 34,
            scalar: {
              type: "String",
              name: "sha3_224",
              required: true,
              kind: 4,
            },
          },
        },
        {
          type: "Method",
          name: "keccak_512",
          required: true,
          kind: 64,
          arguments: [
            {
              type: "String",
              name: "message",
              required: true,
              kind: 34,
              scalar: {
                type: "String",
                name: "message",
                required: true,
                kind: 4,
              },
            },
          ],
          return: {
            type: "String",
            name: "keccak_512",
            required: true,
            kind: 34,
            scalar: {
              type: "String",
              name: "keccak_512",
              required: true,
              kind: 4,
            },
          },
        },
        {
          type: "Method",
          name: "keccak_384",
          required: true,
          kind: 64,
          arguments: [
            {
              type: "String",
              name: "message",
              required: true,
              kind: 34,
              scalar: {
                type: "String",
                name: "message",
                required: true,
                kind: 4,
              },
            },
          ],
          return: {
            type: "String",
            name: "keccak_384",
            required: true,
            kind: 34,
            scalar: {
              type: "String",
              name: "keccak_384",
              required: true,
              kind: 4,
            },
          },
        },
        {
          type: "Method",
          name: "keccak_256",
          required: true,
          kind: 64,
          arguments: [
            {
              type: "String",
              name: "message",
              required: true,
              kind: 34,
              scalar: {
                type: "String",
                name: "message",
                required: true,
                kind: 4,
              },
            },
          ],
          return: {
            type: "String",
            name: "keccak_256",
            required: true,
            kind: 34,
            scalar: {
              type: "String",
              name: "keccak_256",
              required: true,
              kind: 4,
            },
          },
        },
        {
          type: "Method",
          name: "keccak_224",
          required: true,
          kind: 64,
          arguments: [
            {
              type: "String",
              name: "message",
              required: true,
              kind: 34,
              scalar: {
                type: "String",
                name: "message",
                required: true,
                kind: 4,
              },
            },
          ],
          return: {
            type: "String",
            name: "keccak_224",
            required: true,
            kind: 34,
            scalar: {
              type: "String",
              name: "keccak_224",
              required: true,
              kind: 4,
            },
          },
        },
        {
          type: "Method",
          name: "hex_keccak_256",
          required: true,
          kind: 64,
          arguments: [
            {
              type: "String",
              name: "message",
              required: true,
              kind: 34,
              scalar: {
                type: "String",
                name: "message",
                required: true,
                kind: 4,
              },
            },
          ],
          return: {
            type: "String",
            name: "hex_keccak_256",
            required: true,
            kind: 34,
            scalar: {
              type: "String",
              name: "hex_keccak_256",
              required: true,
              kind: 4,
            },
          },
        },
        {
          type: "Method",
          name: "buffer_keccak_256",
          required: true,
          kind: 64,
          arguments: [
            {
              type: "Bytes",
              name: "message",
              required: true,
              kind: 34,
              scalar: {
                type: "Bytes",
                name: "message",
                required: true,
                kind: 4,
              },
            },
          ],
          return: {
            type: "String",
            name: "buffer_keccak_256",
            required: true,
            kind: 34,
            scalar: {
              type: "String",
              name: "buffer_keccak_256",
              required: true,
              kind: 4,
            },
          },
        },
        {
          type: "Method",
          name: "shake_128",
          required: true,
          kind: 64,
          arguments: [
            {
              type: "String",
              name: "message",
              required: true,
              kind: 34,
              scalar: {
                type: "String",
                name: "message",
                required: true,
                kind: 4,
              },
            },
            {
              type: "Int",
              name: "outputBits",
              required: true,
              kind: 34,
              scalar: {
                type: "Int",
                name: "outputBits",
                required: true,
                kind: 4,
              },
            },
          ],
          return: {
            type: "String",
            name: "shake_128",
            required: true,
            kind: 34,
            scalar: {
              type: "String",
              name: "shake_128",
              required: true,
              kind: 4,
            },
          },
        },
        {
          type: "Method",
          name: "shake_256",
          required: true,
          kind: 64,
          arguments: [
            {
              type: "String",
              name: "message",
              required: true,
              kind: 34,
              scalar: {
                type: "String",
                name: "message",
                required: true,
                kind: 4,
              },
            },
            {
              type: "Int",
              name: "outputBits",
              required: true,
              kind: 34,
              scalar: {
                type: "Int",
                name: "outputBits",
                required: true,
                kind: 4,
              },
            },
          ],
          return: {
            type: "String",
            name: "shake_256",
            required: true,
            kind: 34,
            scalar: {
              type: "String",
              name: "shake_256",
              required: true,
              kind: 4,
            },
          },
        },
      ],
    }
  }
};
