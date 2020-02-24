const fs = require('fs');
const file = './sample.mp4';

// readStream is flowing stream. that means it will read all data chunk by chunk without prompting
const readStream = fs.createReadStream(file);

readStream.on('data', chunk => console.log(chunk.size))

readStream.on('end', () => console.log('readStream finished'));

readStream.on('error', error => console.error(error));

// convert flowing stream to non-flowing stream, that means it will read one chunk at a time and wait for user triggers it manually
readStream.pause();

// process.stdin is non-flowing stream. it will read input one by one as the user enters data in console
process.stdin.on('data', chunk => {
  if (chunk.toString().trim() === 'finish'); {
    readStream.resume(); // stream goes back to flowing mode
  }
  readStream.read();
})
