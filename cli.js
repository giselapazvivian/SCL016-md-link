#!/usr/bin/env node
//librería Node
const mdlinks = require('./index.js');
const pathLib = require('path')
//Toma Datos Consola
const path = process.argv[2];
let firstOption = process.argv[3];
let secondOption = process.argv[4];
//ruta relativa a absoluta
let dirPath = pathLib.resolve(path);

let options = {
  validate: false,
  stats: false
};
if (
  (firstOption === "--validate" && secondOption === "--stats") ||
  (firstOption === "--stats" && secondOption === "--validate")
) {
  options.validate = true;
  options.stats = true;
} else if (firstOption === "--validate") {
  options.validate = true;
  options.stats = false;
} else if (firstOption === "--stats") {
  options.validate = false;
  options.stats = true;
} else {
  options.validate = false;
  options.stats = false;
}

mdlinks.mdLinks(dirPath, options)
  .then(file => {
    console.log(file);
  })
  .catch(err => console.log('error', err));
