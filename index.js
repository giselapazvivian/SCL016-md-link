const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

// const { rejects } = require('assert');
const indexModule = {};



const mdLinks = (Path, options) => {
  return new Promise((resolve, rejects) => {
    if (options.validate === false && options.stats === false) {
      fileOrDir(Path)
        .then(resp => {
          resolve(resp)
        })
        .catch(err => {
          rejects(err)
        })
    } else if (options.validate === true && options.stats === false) {
      fileOrDir(Path)
        .then(links => {
          validateOpt(links)
            .then(res => {
              resolve(res);
            })
        })
        .catch(err => {
          rejects(err)
        });
    } else if (options.validate === false && options.stats === true) {
      fileOrDir(Path)
        .then(res => {
          resolve(stats(res));
        });
    } else if (options.validate === true && options.stats === true) {
      fileOrDir(Path)
        .then(res => {
          resolve(statsValidate(res))
        });
    }

  });
};

//Verificar si es directorio o archivo
const fileOrDir = (Path) => {
  const path_ = path.resolve(Path).replace(/\\/g, "/");
  return new Promise((resolve, reject) => {
    fs.stat(path_, (error_, status_) => {
      if (error_) {
        reject(error_)
      } else if (status_.isFile()) {
        resolve(readFileMd(path_))
      } else if (status_.isDirectory()) {
        resolve(readMyDir(path_));
      }
    });
  });
};

const readFileMd = (filePath) => {
  let exten = path.extname(filePath).toLowerCase()
  if (exten === '.md') {
    return readMyFile(filePath)
  } else {
    console.log("No es un archivo md");
  }
}
//encontrar links en archivo con expresión regular
const findLinks = (fileLinks) => {
  const regex = /\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/g;
  return fileLinks.matchAll(regex);
};

//Leer contenido archivo
const readMyFile = (pathMyFile) => {
  return new Promise((resolve, rejects) => {
    fs.readFile(pathMyFile, "utf-8", (err_, data_) => {
      if (err_) {
        rejects(err_);
      }
      let arr = [];
      let index = 0;
      for (const link_ of findLinks(data_)) {
        const object_ = {
          href: link_[2],
          text: link_[1],
          file: pathMyFile,
        };
        arr[index] = object_;
        index++;
      }
      //resolve(validateOpt(arr));
      resolve(arr);
    });
  });
};

//Agregar status y ok 
const validateOpt = (arrayLinks) => {
  const statusLink = arrayLinks.map((obj) =>
    fetch(obj.href)
    .then((res) => {
      if (res.status === 200) {
        return {
          href: obj.href,
          text: obj.text,
          file: obj.file,
          status: res.status,
          statusText: 'ok',
        };
      } else {
        return {
          href: obj.href,
          text: obj.text,
          file: obj.file,
          status: res.status,
          statusText: 'Fail',
        };
      }
    })
    .catch((err) =>
      ({
        href: obj.href,
        text: obj.text,
        file: obj.file,
        status: 404,
        statusText: 'Fail',
      }),
    ));
  return Promise.all(statusLink);
};

//traer información opción --stats
const stats = (validateOpt) => {
  let statsObj = {}
  statsObj.Total = validateOpt.length;
  statsObj.Unique = 0;
  const uniqueLnks = new Set();
  validateOpt.forEach(obj => {
    uniqueLnks.add(obj.href);
  });
  statsObj.Unique = uniqueLnks.size;
  return statsObj;
};

// Opciones --stats y --validate
const statsValidate = (validateArray) => {
  const statsObject = {};
  statsObject.Total = validateArray.length;
  statsObject.Unique = 0;
  statsObject.Broken = 0;
  const uniqueLinks = new Set();
  validateArray.forEach(object => {
    uniqueLinks.add(object.href);
    if (object.statusText === 'Fail') {
      statsObject.Broken += 1;
    }
  });
  statsObject.Unique = uniqueLinks.size;
  return statsObject;
};

const readMyDir = (dirPath) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, (err, files) => {
      if (err) reject(err);
      let filesList = files.map(e => {
        let filesAbso = path.join(dirPath, e);
        let statModule = fs.lstatSync(filesAbso);
        if (statModule.isDirectory()) {
          readMyDir(filesAbso);
        } else {
          readMyFile(filesAbso)
            .then(result2 => {
              console.log(result2)
            })
        }
      })
    })
  })
}




indexModule.mdLinks = mdLinks;
indexModule.readMyFile = readMyFile;
module.exports = indexModule;
