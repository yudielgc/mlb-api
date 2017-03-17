(function () {
    'use strict';

    var express = require('express');
    var router = express.Router();

    var Teams = require('../../models/Team.js');

    /* GET /teams listing. */
    router.get('/', function(req, res, next) {
        Teams.find(function (err, teams) {
            if (err) {
                return next(err);
            }

            res.json(teams);
        });
    });

    /* POST /teams */
    router.post('/', function(req, res, next) {
        Teams.create(req.body, function (err, post) {
            if (err) {
                return next(err);
            }

            res.json(post);
        });
    });

    /* GET /teams/id */
    router.get('/:id', function(req, res, next) {
        Teams.findById(req.params.id, function (err, post) {
            if (err) {
                return next(err);
            }

            res.json(post);
        });
    });

    /* PUT /teams/:id */
    router.put('/:id', function(req, res, next) {
        Teams.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
            if (err) {
                return next(err);
            }

            res.json(post);
        });
    });

    /* DELETE /teams/:id */
    router.delete('/:id', function(req, res, next) {
        Teams.findByIdAndRemove(req.params.id, req.body, function (err, post) {
            if (err) {
                return next(err);
            }

            res.json(post);
        });
    });

    module.exports = router;

})();