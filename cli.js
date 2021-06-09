const mdlinks = require('./index.js');
const pathLib = require('path')
const path = process.argv[2];
const regex = /(https?:\/\/[^\s)]+)[^,). ]/;
let dirPath = pathLib.resolve(path);
console.log(dirPath);
let data = '';





mdlinks.fileOrDir(dirPath)
    .then(file => {
            console.log(file);
       })
    .catch(err => console.log('error', err));








