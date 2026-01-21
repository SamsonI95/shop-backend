export function nairaToKobo(amountNaira: number) {
  return Math.round(amountNaira * 100);
}

export function koboToNaira(amountKobo: number) {
  return amountKobo / 100;
}
