const cloudant = require('./lib/db.js');
const utils = require('./lib/utils.js');

const main = function(msg) {
  
  if (!msg.userid) {
    return utils.error({ok: false, err: 'no userid supplied'});
  }

  // cloudant
  const db = cloudant.configure(msg.COUCH_HOST, 'instapuppy');
  var opts = {
    startkey: [msg.userid, '2099-01-01'],
    endkey: [msg.userid, '1970-01-01'],
    descending: true,
    reduce: false,
    include_docs: true,
    limit: 50
  };
  return db.view('query','byPostingUser', opts).then(utils.reply).catch(utils.error);
  
};

exports.main = main;