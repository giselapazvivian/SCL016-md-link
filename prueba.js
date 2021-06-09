const fs = require('fs');
const indexModule = {};

const fileOrDir = (path_) => {
    let statModule = fs.lstatSync(path_);
    if (statModule.isDirectory()){
        return readMyDir(path_);
    }
    else {
        return readMyFile(path_);
    }
}

const readMyDir = (dirPath) => {
    return new Promise((resolve, reject) => {
        fs.readdir(dirPath, (err, files) => {
            if (err) reject(err);
            filesList = files.filter(function (e) {
                const file = path.join(dirPath, e);
                //console.log(file);
                return path.extname(e).toLowerCase() === '.md'
              })
                //  resolve(file);
            console.log(filesList);
        })
    })
}

const readMyFile = (filePath) => {
    return new Promise ((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) reject(err);
                 resolve(data);
            
        })
    })
}


indexModule.fileOrDir = fileOrDir;
indexModule.readMyDir = readMyDir;
indexModule.readMyFile = readMyFile;

module.exports = indexModule;