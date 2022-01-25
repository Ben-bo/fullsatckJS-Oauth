const biggestNumber = (number) => {
  if (number.toString().length === 3) {
    let num = number.toString().split("");
    return num.sort((a, b) => Number(b) - Number(a)).join("");
  } else {
    return null;
  }
};
console.log(biggestNumber(123));
