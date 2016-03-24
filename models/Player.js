(function () {
    'use strict';

    var mongoose = require('mongoose');

    var PlayerSchema = new mongoose.Schema(
            {
                last_name: String,
                first_name: String,
                display_name: String,
                birthdate: Date,
                age: Number,
                birthplace: String,
                height_in: Number,
                height_cm: Number,
                height_m: Number,
                height_formatted: String,
                weight_lb: Number,
                weight_kg: Number,
                position: String,
                uniform_number: Number,
                bats: String,
                throws: String,
                roster_status: String,
                updated_at: {
                    type: Date,
                    default: Date.now,
                },
            }
        );

    module.exports = mongoose.model('Player', PlayerSchema);

})();