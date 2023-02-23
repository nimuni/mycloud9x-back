exports.isEmpty = function(value){
  console.log("isEmpty")
  console.log(value)
  if ( value === "" || value === null || value === undefined){
    return true
  } else {
    return false
  }
};
exports.isEmptyObj = function(obj) {
  if ( value != null && typeof value == "object" && !Object.keys(value).length){
    return true
  } else {
    return false
  }
}