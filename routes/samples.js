(function () {
    'use strict';

    var express = require('express'),
        https = require('https'),
        router = express.Router(),
        nodeCache = require('node-cache'),
        util = require('util');
        //zopfli = require('zopfli');

    var config = {
            'access_token': '',
            'user_agent_contact': 'yudielgc@gmail.com',
            'time_zone': 'America/New_York',
            'version': '1.0'
        },
        xmlstatsUrl = {
            host: 'erikberg.com',
            sport: 'mlb',
            endpoint: undefined,
            id: undefined,
            format: 'json',
            params: {
                'status': 'expanded'
            }
        };

    // instruct cache to keep items for 10 minutes
    var cache = new nodeCache({ stdTTL: 600 });

    var userAgent = util.format('xmlstats-exnode/%s (%s)', config.version, config.user_agent_contact);
    var authorization = util.format('Bearer %s', config.access_token);

    /* GET samples listing. */
    router.get('/', function(req, res, next) {
        res.send('respond with a resource - samples');
    });

    /* GET roster from JSON file */
    router.get('/roster-json', function (req, res) {
        var players = require('./players.json');

        res.json(players);
    });

    router.get('/roster-json/:team', function (req, res) {
        var players = require('./players.json');

        res.json(players.filter(function (player) { return player.team.toLowerCase() === req.params.team.toLowerCase(); }));
    });

    /* GET roster. */
    router.get('/roster/:team', function(req, res, next) {
        xmlstatsUrl.endpoint = 'roster';
        xmlstatsUrl.id = req.params.team;
        var url = buildUrl(xmlstatsUrl);

        httpGet(url, function (statusCode, contentType, data) {
            if (statusCode !== 200) {
                console.warn('Server did not return a "200 OK" response! ' +
                    'Got "%s" instead.', statusCode);
                // If error response is of type 'application/json', it will be an
                // XmlstatsError see https://erikberg.com/api/objects/xmlstats-error
                var reason = (contentType === 'application/json')
                    ? data.error.description
                    : data;
                res.status(statusCode).render('error', { code: statusCode, reason: reason });
                return;
            }

            data.players = data.players
                .filter(function (player) {
                    return player.birthplace.toLowerCase().indexOf('cuba') > -1;
                })
                .map(function (player) {
                    player.team = data.team.abbreviation;
                    return player;
                });
            // Store good response in cache
            cache.set(url, data);
            res.json(data);
        });
    });

    /* GET teams. */
    router.get('/teams', function(req, res, next) {
        xmlstatsUrl.endpoint = 'teams';
        xmlstatsUrl.id = undefined;
        var url = buildUrl(xmlstatsUrl);

        httpGet(url, function (statusCode, contentType, data) {
            if (statusCode !== 200) {
                console.warn('Server did not return a "200 OK" response! ' +
                    'Got "%s" instead.', statusCode);
                // If error response is of type 'application/json', it will be an
                // XmlstatsError see https://erikberg.com/api/objects/xmlstats-error
                var reason = (contentType === 'application/json')
                    ? data.error.description
                    : data;
                res.status(statusCode).render('error', { code: statusCode, reason: reason });
                return;
            }

            // Store good response in cache
            cache.set(url, data);
            res.json(data);
        });
    });

    /* GET cubans from teams. */
    router.get('/cubans', function(req, res, next) {
        var teams = [],
            players = [];
        xmlstatsUrl.endpoint = 'teams';
        xmlstatsUrl.id = undefined;
        var url = buildUrl(xmlstatsUrl);

        httpGet(url, function (statusCode, contentType, data) {
            if (statusCode !== 200) {
                console.warn('Server did not return a "200 OK" response! ' +
                    'Got "%s" instead.', statusCode);
                // If error response is of type 'application/json', it will be an
                // XmlstatsError see https://erikberg.com/api/objects/xmlstats-error
                var reason = (contentType === 'application/json')
                    ? data.error.description
                    : data;
                res.status(statusCode).render('error', { code: statusCode, reason: reason });
                return;
            }

            // Store good response in cache
            cache.set(url, data);
            //res.json(data);
            //teams = data;

            data.forEach(function (team) {
                teams.push(team.team_id)
                /*xmlstatsUrl.endpoint = 'roster';
                xmlstatsUrl.id = team.team_id;
                var url = buildUrl(xmlstatsUrl);

                players.concat(getCubanPlayers(url));*/
            });

            res.json(teams);
        });

        /*setTimeout(function() {
            res.json(players);
        }, 10000);*/
    });

    function getCubanPlayers(url) {
        var players = [];
        httpGet(url, function (statusCode, contentType, data) {
            if (statusCode !== 200) {
                console.warn('Server did not return a "200 OK" response! ' +
                    'Got "%s" instead.', statusCode);
                // If error response is of type 'application/json', it will be an
                // XmlstatsError see https://erikberg.com/api/objects/xmlstats-error
                var reason = (contentType === 'application/json')
                    ? data.error.description
                    : data;
                res.status(statusCode).render('error', { code: statusCode, reason: reason });
                return;
            }

            // Store good response in cache
            cache.set(url, data);

            players = data.players.filter(function (player) {return player.birthplace.toLowerCase().indexOf('cuba') > -1;})
            players.forEach(function (player) {
                player.team = data.team.abbreviation;
            });
        });

        return players;
    }

    function httpGet(url, callback) {
        var data = cache.get(url);
        if (data) {
            callback(200, 'application/json', data);
            return;
        }

        var options = {
            hostname: xmlstatsUrl.host,
            path: url,
            headers: {
                //'Accept-Encoding': 'gzip',
                'Authorization': authorization,
                'User-Agent': userAgent
            }
        };

        var req = https.get(options, function(res) {
            var content;
            var data = [];

            /*if (res.headers['content-encoding'] === 'gzip') {
                var gzip = zopfli.createGzip()();
                res.pipe(gzip);
                content = gzip;
            } else {
                content = res;
            }*/
            content = res;

            content.on('data', function (chunk) {
                data.push(chunk);
            });

            content.on('end', function() {
                var json = JSON.parse(Buffer.concat(data));
                callback(res.statusCode, res.headers['content-type'], json);
            });
        });

        req.on('error', function (err) {
            callback(500, 'text/plain', 'Unable to contact server: ' + err.message);
            console.error('Unable to contact server: %s', err.message);
        });
    }

    // See https://erikberg.com/api/endpoints#requrl Request URL Convention
    // for an explanation
    function buildUrl(opts) {
        var ary = [opts.sport, opts.endpoint, opts.id];

        var path = ary.filter(function (element) {
                return element !== undefined;
            }).join('/');

        var url = util.format('https://%s/%s.%s', opts.host, path, opts.format);

        // check for parameters and create parameter string
        if (opts.params) {
            var paramList = [];
            for (var key in opts.params) {
                if (opts.params.hasOwnProperty(key)) {
                    paramList.push(util.format('%s=%s', encodeURIComponent(key), encodeURIComponent(opts.params[key])));
                }
            }
            var paramString = paramList.join('&');
            if (paramList.length > 0) {
                url += '?' + paramString;
            }
        }

        return url;
    }

    module.exports = router;

})();