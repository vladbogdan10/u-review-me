export default function (word: string) {
  return word.endsWith('s') ? word.slice(0, -1) : word;
}
