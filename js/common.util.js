exports.isEmpty = function(value){
  console.log("call isEmpty")
  console.log(`type=${typeof value} value=${value}`)
  if ( value === "" || value === null || value === undefined){
    console.log(true)
    return true
  } else {
    console.log(false)
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