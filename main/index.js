const crypto = require('crypto');

// I'm a child, iam going to act like a server, nothing else
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
    res.send('Hello there!!!');
  });

})

app.get('/fast', (req, res) => {
  res.send('this is fast');
})

app.listen(3000, () => console.log('server listening on 3000'));
// server benchmarks commands
// ab -c 50 -n 500 localhost:3000/fast
// pm2 start index.js -i 0
// the -i 0 above tells the pm2 to create instances based on the logical cores availability
// no. of logical cores = no. of physical cores * no. of processes a core runs at a given time
