const { createReadStream, createWriteStream } = require('fs');

const readStream = createReadStream('./sample.mp4');
const writeStream = createWriteStream('./copy.mp4');

readStream.pipe(writeStream) // automatically handles backpressure
  .on('error', console.error)

// any readstream can be piped to any writeStream
//process.stdin.pipe(writeStream)
