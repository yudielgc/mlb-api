(function () {
    'use strict';

    var mongoose = require('mongoose');

    var TeamSchema = new mongoose.Schema(
            {
                team_id: String,
                abbreviation: String,
                active: Boolean,
                first_name: String,
                last_name: String,
                conference: String,
                division: String,
                site_name: String,
                city: String,
                state: String,
                full_name: String,
                updated_at: {
                    type: Date,
                    default: Date.now,
                }
            }
        );

    module.exports = mongoose.model('team', TeamSchema);

})();