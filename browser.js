const { createServer } = require('http');
const { stat, createReadStream, createWriteStream } = require('fs');
const { promisify } = require('util');
const multiparty = require('multiparty');

const file = './sample.mp4';
const fileInfo = promisify(stat);

const respondWithVideo = async (req, res) => {
  const { size } = await fileInfo(file);
  const range = req.headers.range; // bytes=0-5
  if (range) {
    let [ start, end ] = range.replace(/bytes=/, '').split('-');
    start = parseInt(start, 10);
    end = end ? parseInt(end, 10) : size - 1;
    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': (end-start) + 1,
      'Content-Type': 'video/mp4'
    });
    createReadStream(file, { start, end }).pipe(res);
  } else {
    res.writeHead(200, {
      'Content-Type': 'video/mp4',
      'Content-Length': size
    });
    createReadStream(file).pipe(res);
  }

};

createServer((req, res) => {
  if (req.method === 'POST') {
    // without multiparty
    // req.pipe(res);
    // req.pipe(process.stdout);
    // req.pipe(createWriteStream('./upload.file'));

    let form = new multiparty.Form();
    form.on('part', (part) => {
      part.pipe(createWriteStream(`./${part.filename}`))
        .on('close', () => {
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.end(`<h1>File was uploaded: ${part.filename}</h1>`);
        })
    })
    form.parse(req);

  } else if (req.url === '/video') {
    respondWithVideo(req, res);
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(`
      <form enctype="multipart/form-data" method="post" action="/">
        <input type="file" name="upload-file" />
        <button>Upload File</button>
      </form>
    `);
  }
}).listen(3000, () => console.log('server runnig on port 3000'));
