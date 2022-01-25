const alternateCase = (str) => {
  let arr = [];
  for (let i = 0; i < str.length; i++) {
    if (str[i] === str[i].toLowerCase()) {
      arr.push(str[i].toUpperCase());
    } else {
      arr.push(str[i].toLowerCase());
    }
  }
  return arr.join("");
};
console.log(alternateCase("AbC"));
