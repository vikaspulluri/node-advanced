const dns = require('dns');
const http = require('http');
const https = require('https');
const tls = require('tls');
const net = require('net');
const request = require('request');
const loopbench = require('loopbench')();

const httpAgent = new http.Agent();
const httpsAgent = new https.Agent();

const createConnection = ({ isHttps = false } = {}) => {
    const connect = isHttps ? tls.connect : net.connect;
    return function(args, cb) {
        return connect({
            port : args.port,
            host : args.host,
            lookup : function(hostname, args, cb) {
                dns.resolve(hostname, function(err, ips) {
                    if (err) { return cb(err); }
                    console.log('dns resolved', ips)
                    return cb(null, ips[0], 4);
                });
            }
        }, cb);
    }
};

httpAgent.createConnection = createConnection();
httpsAgent.createConnection = createConnection({isHttps: true});

function getRequest(reqUrl) {
    request({
        method: 'get',
        url: reqUrl,
        agent: httpAgent
    }, (err, res) => {
        if (err) throw err;
        console.log('custom httpAgent: ', Date.now() - start, ' milliseconds time');
        // console.log(res.body);
    })
}

function getRequestDefault(url) {
  request({
    method: 'get',
    url: url
  }, (err, res) => {
    if (err) throw err;
    console.log('default httpAgent: ', Date.now() - start, ' milliseconds time');
  });
}
const start = Date.now();
getRequestDefault('http://digitalclassroom.wallstreetenglish.com');
getRequest('http://digitalclassroom.wallstreetenglish.com');

console.log(`loop delay: ${loopbench.delay}`);
console.log(`loop delay limit: ${loopbench.limit}`);
console.log(`is loop overloaded: ${loopbench.overlimit}`);
