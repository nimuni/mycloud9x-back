const fs = require('fs');
const { dirname } = require('path');
const appDir = dirname(require.main.filename);
const ServerDirectory = require('../../db/schema/serverDirectory');

// TODO. 서버 루트디렉토리가 없이 여러군데에 저장되는 경우가 있을 수 있으므로.
exports.getServerRootDirectory = async () => {
  try {
    const serverDefaultDirectory = await ServerDirectory.find({});
    return serverDefaultDirectory
  } catch (error) {
    console.log(error)
  }
}
exports.setServerRootDirectory = async (changePath) => {
  try {
    const serverDefaultDirectory = await ServerDirectory.findOneAndUpdate({}, {path:changePath}, {returnOriginal:false});
    return serverDefaultDirectory
  } catch (error) {
    console.log(error)
  }
}

exports.mkdir = async (folderName, path) => {
  try {
    console.log("call mkdir")
    console.log(dirname)
    console.log(appDir)
    // fs.mkdirSync(folderName);
  } catch (error) {
    console.log(error);
  } 
}