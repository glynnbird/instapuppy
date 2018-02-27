const cloudant = require('./lib/db.js');
const utils = require('./lib/utils.js');
const crypto = require('crypto');

const main = function(msg) {
  
  // cloudant
  const db = cloudant.configure(msg.COUCH_HOST, 'instapuppy_users');
  const tokensdb = cloudant.configure(msg.COUCH_HOST, 'instapuppy_tokens');
  var userDisplayName = '';

  if (msg.username && msg.password) {
    return db.get(msg.username).then(function(data) {
      const shasum = crypto.createHash('sha1');
      var hash = shasum.update(data.salt + msg.password).digest('hex');
      if (data.hash === hash) {
        delete data.hash
        delete data.salt
        data.userid = data._id
        delete data._id
        delete data._rev
        userDisplayName = data.userDisplayName
        return tokensdb.insert(data);
      } else {
        return utils.error({ok: false});
      }
    }).then(function(data) {
      return utils.reply({ok: true, userDisplayName: userDisplayName, cookie: data.id });
    }).catch(function(e) {
      return utils.error({ok: false});
    });
  } else {
    return utils.error({ok: false});
  }
  
};

exports.main = main;