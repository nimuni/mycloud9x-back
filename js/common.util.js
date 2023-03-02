exports.isEmpty = (value) =>{
  if ( value === "" || value === null || value === undefined){
    return true
  } else {
    return false
  }
};
exports.isEmptyObj = (obj) => {
  if ( value != null && typeof value == "object" && !Object.keys(value).length){
    return true
  } else {
    return false
  }
}
exports.generateRandomString = (num) => {
  const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < num; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}
