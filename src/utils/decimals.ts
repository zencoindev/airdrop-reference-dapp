export function toDecimals(num: bigint | number | string, decimals: number | string): string {
  const dec = Number(decimals);
  const strNum = BigInt(num)
      .toString()
      .padStart(dec + 1, '0');

  const intPart = strNum.slice(0, -dec);
  const fracPart = strNum.slice(-dec).replace(/0+$/, '');

  return [intPart, fracPart].filter(Boolean).join('.');
}
