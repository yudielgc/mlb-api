var express = require('express');
var router = express.Router();

/* GET samples listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource - samples');
});

/* GET first sample. */
router.get('/first', function(req, res, next) {
    console.log('/first', buildURL());
    res.send('respond with a resource');
});

// See https://erikberg.com/api/methods Request URL Convention for
// an explanation
function buildURL(host, sport, method, id, format, params) {
  var ary = [sport, method, id];
  var path;
  var url;
  var param_list = [];
  var param_string;
  var key;

  path = ary.filter(function (element) {
    return element !== undefined;
  }).join('/');
  url = 'https://' + host + '/' + path + '.' + format;

  // check for parameters and create parameter string
  if (params) {
    for (key in params) {
      if (params.hasOwnProperty(key)) {
        param_list.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
      }
    }
    param_string = param_list.join('&');
    if (param_list.length > 0) {
      url += '?' + param_string;
    }
  }
  return url;
}

//console.log('buildUrl', buildUrl());

module.exports = router;
