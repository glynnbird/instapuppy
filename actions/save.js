const cloudant = require('./lib/db.js');
const utils = require('./lib/utils.js');

const main = function(msg) {
  
  // cloudant
  const tokensdb = cloudant.configure(msg.COUCH_HOST, 'instapuppy_tokens');
  const db = cloudant.configure(msg.COUCH_HOST, 'instapuppy');
  
  // no cookie, no entry
  if (msg.cookie) {

    // load cookie data
    return tokensdb.get(msg.cookie).then(function(data) {
      var obj = {
        name: msg.name,
        descr: msg.descr,
        image: msg.image,
        date: new Date().toISOString(),
        postedBy: data.userid,
        thumbnail: null
      }

      return db.insert(obj);
      
    }).then(utils.reply).catch(utils.error);
  } else {
    // missing cookie
    return utils.error({ok: false, err: 'not authorised'});
  }
  
};

exports.main = main;