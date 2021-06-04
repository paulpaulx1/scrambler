export const shuffle = (v) => [...v].sort((_) => Math.random() - 0.5).join('');

export const scrambler = (string) => {
  let first = string[0];
  let last = string[string.length - 1];
  string =
    first +
    string
      .slice(1, -1)
      .split(' ')
      .map((x) => shuffle(x))
      .join(' ') +
    last;
  console.log(string);
  return string;
};
