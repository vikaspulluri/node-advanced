const { Readable } = require('stream');

const peaks = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six'
];

class StreamFromArray extends Readable {
  constructor(array) {
    super({encoding: 'UTF-8'}); // converts binary to string format
    // super({objectMode: true}) // converts binary to any format
    this.array = array;
    this.index = 0;
  }

  _read() {
    if (this.index >= this.array.length) this.push(null);
    const chunk = this.array[this.index];
    /* in case of objectMode: true, you can read the data as object as well
    const chunk = {
      data: this.array[this.index],
      index: this.index
    }
    */
    this.push(chunk);
    this.index++;
  }
}

const peakStream = new StreamFromArray(peaks);

peakStream.on('data', chunk => console.log(chunk));

peakStream.on('end', () => console.log('done'));
