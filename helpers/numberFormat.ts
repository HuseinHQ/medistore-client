export default function numberFormat(value: number): string {
  return new Intl.NumberFormat('de-DE').format(value);
}
