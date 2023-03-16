const fileImpl = require('./impl/fileServiceImpl');
const util = require('../js/common.util');
let defaultFolderPath = "";
const getDefaultFolder = async () => {
  return defaultFolderPath;
}
exports.getDefaultFolder
exports.initUserFolder = async (_id) => {
  fileImpl.mkdir(_id, path)
  return true;
} 