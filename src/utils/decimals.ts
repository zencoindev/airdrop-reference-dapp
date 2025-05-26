export function toDecimals(num: bigint | number | string, decimals: number | string, isFloat?: boolean): string {
  const dec = Number(decimals);
  const strNum = BigInt(num)
      .toString()
      .padStart(dec + 1, '0');

  const intPart = strNum.slice(0, -dec);
  const fracPart = strNum.slice(-dec).replace(/0+$/, '');
  const summary = [intPart, fracPart].filter(Boolean).join('.');

  if(isFloat) {
    return Math.round(Number(summary)).toString();
  } else {
    return summary;
  }
}
