(function () {
    'use strict';

    var config = {
        local: {
            mode: 'local',
            port: 3000
        },
        staging: {
            mode: 'local',
            port: 4000
        },
        production: {
            mode: 'local',
            port: 5000
        }
    };

    module.exports = function (mode) {
        return config[mode || process.argv[2] || 'local'] || config.local;
    };

})();