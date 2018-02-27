const cloudant = require('./lib/db.js');
const utils = require('./lib/utils.js');

const main = function(msg) {

  // cloudant
  const db = cloudant.configure(msg.COUCH_HOST, 'instapuppy');
  var opts = {
    descending: true,
    reduce: false,
    include_docs: true,
    limit: 50
  };
  return db.view('query','byDate', opts).then(utils.reply).catch(utils.error);
};

exports.main = main;