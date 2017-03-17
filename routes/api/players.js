(function () {
    'use strict';

    var express = require('express');
    var router = express.Router();

    var Players = require('../../models/Player.js');

    /* GET /players listing. */
    router.get('/', function(req, res, next) {
        Players.find(function (err, players) {
            if (err) {
                return next(err);
            }

            res.json(players);
        });
    });

    /* POST /players */
    router.post('/', function(req, res, next) {
        Players.create(req.body, function (err, post) {
            if (err) {
                return next(err);
            }

            res.json(post);
        });
    });

    /* GET /players/id */
    router.get('/:id', function(req, res, next) {
        Players.findById(req.params.id, function (err, post) {
            if (err) {
                return next(err);
            }

            res.json(post);
        });
    });

    /* PUT /players/:id */
    router.put('/:id', function(req, res, next) {
        Players.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
            if (err) {
                return next(err);
            }

            res.json(post);
        });
    });

    /* DELETE /players/:id */
    router.delete('/:id', function(req, res, next) {
        Players.findByIdAndRemove(req.params.id, req.body, function (err, post) {
            if (err) {
                return next(err);
            }

            res.json(post);
        });
    });

    module.exports = router;

})();