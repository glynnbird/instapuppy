// live account
var apibase = 'https://service.us.apiconnect.ibmcloud.com/gws/apigateway/api/208a8d87f8067eeaa6751e18e1c4efba314ef5ec38793779f4b582b5d6074435/instapuppy/'

var ajax = function(method, data, callback) {
  //console.log('ajax', method, data);
  $.ajax({
    type: 'POST',
    url: apibase + method,
    data: JSON.stringify(data),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    error: function(e) {
//      console.log('ajax error', e.responseText);
      callback(true, null);
    },
    success: function(d) {
      console.log('ajax success', d.title)
      callback(null, d)
    }
  });
};

var getCookies = function() {
  if (document.cookie) {
    var jar = {}
    var bits = document.cookie.split(';');
    bits.forEach(function(bit) {
      var kv = bit.split('=');
      jar[kv[0].trim()] = kv[1];
    });
    return jar;
  } else {
    return null;
  }
};

var clearCookie = function(c) {
  document.cookie = c + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
};

var todayStr = function() {
  var now = new Date();
  var todayUTC = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  return todayUTC.toISOString().slice(0, 10);
};