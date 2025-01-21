import BigNumber from "bignumber.js";

export function fromNano(amount: string, decimals: string | number = 9) {
  return new BigNumber(amount).dividedBy(new BigNumber(10).pow(decimals)).toString()
}

export function toNano(amount: string, decimals: string | number = 9) {
  return new BigNumber(amount).multipliedBy(new BigNumber(10).pow(decimals)).toString()
}
