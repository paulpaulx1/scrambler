export const formatter = (data) => {
  let arrayOfArrays = data.sentence.split(' ').map((word) => word.split(''));
  arrayOfArrays.map((wordArray) => wordArray.push('?'));
  arrayOfArrays[arrayOfArrays.length - 1].pop();
  return arrayOfArrays;
};
