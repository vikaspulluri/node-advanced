const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');

const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
client.hget = util.promisify(client.hget);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function(options = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || 'default');
  return this;
}

mongoose.Query.prototype.exec = async function() {
  // console.log(this.getQuery());
  // console.log(this.mongooseCollection.name);
  if (!this.useCache) {
    return exec.apply(this, arguments);
  }
  const key = JSON.stringify(Object.assign({}, this.getQuery(), {
    collection: this.mongooseCollection.name
  }));

  const cacheValue = await client.hget(this.hashKey, key);
  if (cacheValue) {
    // console.log(cacheValue); // Stringified JSON object
    const doc = JSON.parse(cacheValue);
    // return JSON.parse(cacheValue); // won't work as exec should return model instance
    return Array.isArray(doc)
      ? doc.map(d => new this.model(d))
      : new this.model(doc);
  }

  const result = await exec.apply(this, arguments);
  // result is not a plain js object. it is mongoose document(model instance)
  // you can verify it from result.validate call

  client.hset(this.hashKey, key, JSON.stringify(result), 'EX', 10); // 10 seconds

  return result; // You have to return what actual mongoose exec will returns
}


module.exports = {
  clearHash(hashKey) {
    client.del(JSON.stringify(hashKey));
  }
}
