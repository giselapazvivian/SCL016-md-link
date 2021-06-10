const fs = require('fs');
const { resolve } = require('path');
// const { pathToFileURL } = require('url');
const indexModule = {};
const path = require('path');
const marked = require('marked');

const fileOrDir = (path_) => {
    return new Promise((resolve, reject) => {
        let statModule = fs.lstatSync(path_);
    if (statModule.isDirectory()) {
        resolve (readMyDir(path_));
    }
    else {
        // console.log("entró a archivo", path_);
        resolve (readMyFile(path_))
    }
})}
const readMyDir = (dirPath) => {
    return new Promise((resolve, reject) => {
        fs.readdir(dirPath, (err, files) => {
            if (err) reject(err);
            // console.log(files)
            // let filesAbs = path.resolve(files);
            // console.log(filesAbs);
            // filesList = files.filter(function (e) {
            //     // const file = path.join(dirPath, e);
            //     //console.log(file);
            //     return path.extname(e).toLowerCase() === '.md'
            // })
            //  resolve(file);
            let filesList = files.map(e => {
                // console.log("dirPath",dirPath);
                let filesAbso = path.join(dirPath, e);
                let statModule = fs.lstatSync(filesAbso);
                if (statModule.isDirectory()) {
                    // console.log("entró a directorio", path_);
                    readMyDir(filesAbso);
                }
                else {
                    // console.log("entró a archivo", path_);
                    readMyFile(filesAbso)
                    .then(result2 => {console.log(result2)})
                }
                // console.log("e", e);
                // fileOrDir(filesAbs);
                // console.log(filesAbs);
            })
            // console.log(filesList);
            // Promise.all(filesList)
            //     .then(result => { console.log(result)})
            // readMyFile(filesAbs);
            // console.log(filesList.length);
            // for (let i = 0; i < filesList.length; i++) {
            //     let array = filesList[i]
            //     console.log(array);
            //     let arrayAbs = path.resolve(array);
            //     console.log(arrayAbs);
            // }
        })
    })
}
const readMyFile = (filePath) => {
    return new Promise((resolve, reject) => {
        if (path.extname(filePath).toLowerCase() === '.md') {
            const regex = /(https?:\/\/[^\s)]+)[^,). ]/g;
            const regExpTxt = /\[([\w\s\d\-]+)\]/g;
            const regExpMsj = /(\*)/g;
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) reject(err);
                // let data = marked(file);
                console.log(data);
                const matchData = data.match(regex);
                
                const textLink = data.matchAll(regExpTxt);
                console.log(textLink);
                const mensLink = data.matchAll(regExpMsj);
                const links = {
                    match: matchData,
                    text: textLink,
                    message: mensLink
                };
                resolve(links);
            })
        } else {
            console.log("No es un archivo md");
            // reject(new Error("No es un archivo md"))
        }
    })
}
indexModule.fileOrDir = fileOrDir;
indexModule.readMyDir = readMyDir;
indexModule.readMyFile = readMyFile;
module.exports = indexModule;


