const fs = require('fs');
const http = require('http');
const file = './sample.mp4';

http.createServer((req, res) => {
  res.writeHeader(200, { 'Content-Type': 'video/mp4'});
  fs.createReadStream(file)
    .pipe(res)
    .on('error', console.error);
}).listen(3000, () => console.log('listening on port 3000'));
