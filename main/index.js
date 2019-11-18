const cluster = require('cluster');

// console.log(cluster.isMaster);
// Is the file being executed in master mode?
if (cluster.isMaster) {
  // Cause index.js to be executed *again* but in slave/child mode
  cluster.fork();
  cluster.fork();
  // cluster.fork();
  // cluster.fork();
} else {
  // I'm a child, iam going to act like a server, nothing else
  const express = require('express');
  const app = express();

  function doWork(duration) {
    const start = Date.now();
    while(Date.now() - start < duration) {}
  }

  app.get('/', (req, res) => {
    doWork(5000);
    res.send('Hello there!!!');
  })

  app.get('/fast', (req, res) => {
    res.send('this is fast');
  })

  app.listen(3000, () => console.log('server listening on 3000'));
}
// server benchmarks commands
// ab -c 50 -n 500 localhost:3000/fast
