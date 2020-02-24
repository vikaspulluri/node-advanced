const { createReadStream, createWriteStream } = require('fs');

const readStream = createReadStream('./sample.mp4');
const writeStream = createWriteStream('./copy.mp4', {
  highWaterMark: 1628920 // larger hose -> lesser backpressure
});

readStream.on('data', chunk => {
  const result = writeStream.write(chunk);
  if (!result) { // backpressure
    console.log('backpressure')
    readStream.pause();
  }
})

readStream.on('end', () => {
  writeStream.end();
});

readStream.on('error', error => console.error(error));

writeStream.on('drain',  () => {
  console.log('drained');
  readStream.resume();
})

writeStream.on('close', () => {
  process.stdout.write('file copied\n');
})
