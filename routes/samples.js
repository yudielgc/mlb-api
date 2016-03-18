(function () {
    //'use strict';

    var express = require('express'),
        https = require('https'),
        router = express.Router();

    var ACCESS_TOKEN = '',
        USER_AGENT = 'mybot/0.1 (https://erikberg.com/)',
        TIME_ZONE = 'America/New_York';

    /* GET samples listing. */
    router.get('/', function(req, res, next) {
        res.send('respond with a resource - samples');
    });

    /* GET first sample. */
    router.get('/first', function(req, res, next) {
        console.log('first: calling main');
        main();
        res.send('respond with a resource');
    });

    function main() {
        var host   = 'erikberg.com',
            sport  = undefined,
            method = 'events',
            id     = undefined,
            format = 'json',
            params = {
                'sport': 'nba',
                'date': '20130414'
            };

        var url,
            default_opts,
            chunks,
            buffer,
            encoding;

        url = buildURL(host, sport, method, id, format, params);
        
        default_opts = {
            'host': host,
            //'path': '/events.json?sport=nba&date=20130414',
            'path': url,
            'headers': {
                'Accept-Encoding': 'gzip',
                'Authorization': 'Bearer ' + ACCESS_TOKEN,
                'User-Agent': USER_AGENT
            }
        };

        https.get(default_opts, function (res) {
            chunks = [];
            console.log('url', url, default_opts);
            res.on('data', function (chunk) {
                chunks.push(chunk);
            });
            res.on('end', function () {
                if (res.statusCode !== 200) {
                    // handle error...
                    console.warn("Server did not return a 200 response!\n" + chunks.join(''));
                    process.exit(1);
                }
                encoding = res.headers['content-encoding'];
                /*if (encoding === 'gzip') {
                    buffer = Buffer.concat(chunks);
                    zlib.gunzip(buffer, function (err, decoded) {
                        if (err) {
                            console.warn("Error trying to decompress data: " + err.message);
                            process.exit(1);
                        }
                        printResults(decoded);
                    });
                } else {
                    printResults(chunks.join(''));
                }*/
                console.log('data', chunks);
                });
        }).on('error', function (err) {
            console.warn("Error trying to contact server: " + err.message);
            process.exit(1);
        });

        /*var req = https.request(default_opts, function(res) {
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                console.log('BODY: ' + chunk);
            });
        });
        process.on('uncaughtException', function (err) {
            console.log('uncaughtException', err);
        });
        req.write(chunks);
        req.end();*/

        /* Facebook example ***
        var url = 'http://graph.facebook.com/517267866/?fields=picture';
        https.get(url, function(res){
            var body = '';

            res.on('data', function(chunk){
                body += chunk;
            });

            res.on('end', function(){
                var fbResponse = JSON.parse(body);
                console.log("Got a response: ", fbResponse.picture);
            });
        }).on('error', function(e){
              console.log("Got an error: ", e);
        });*/
    }

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

    module.exports = router;

})();