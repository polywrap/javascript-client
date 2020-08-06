import { ethereum } from '@web3api/wasm-ts'

export function getData(address: string): u32 {
  const res = ethereum.callView(
    address,
    'function get() view returns (uint256)',
    ""
  )

  return u32.parseInt(res)
}
