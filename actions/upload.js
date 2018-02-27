const cloudant = require('./lib/db.js');
const utils = require('./lib/utils.js');

const main = function(msg) {
  
  console.log(msg)
  var ct = msg['__ow_headers']['content-type']
  console.log(ct)
  var matches = ct.match(/boundary=(.+)$/)
  console.log(matches)
  console.log(matches[1])
  return utils.reply({ok: true, body: msg.__ow_body })
};

exports.main = main;