const fs = require('fs');

// Reads text from the file asynchronously.
// Returns a Promise.
function readPromise(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, "utf8", (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

// Writes given text to a file asynchronously.
// Returns a Promise.
function writePromise(file, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, err => {
      if (err) reject(err);
      resolve('success');
    });
  });
}

module.exports = {
  readPromise,
  writePromise
}