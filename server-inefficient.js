const fs = require('fs');
const http = require('http');
const file = './sample.mp4';

http.createServer((req, res) => {
  fs.readFile(file, (error, data) => {
    if (error) {
      console.log('error', error);
    }
    res.writeHeader(200, { 'Content-Type': 'video/mp4'});
    res.end(data);
  })
}).listen(3000, () => console.log('listening on port 3000'));
