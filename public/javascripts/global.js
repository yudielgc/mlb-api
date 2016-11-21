(function () {
    'use script';

    var roster = [];

    $(document).ready(function () {
        populateTeams();
        populateCubans();

        $('#teams-list').on('change', function () {
            $( "#teams-list option:selected" ).each(function() {
                if ($(this).text().toLowerCase() !== 'all') {
                    getRosterByTeam($(this).text());
                    return;
                }

                populateCubans();
            });
        });
        //populateTable();
    });

    function populateTeams() {
        var teams = [];

        // jQuery AJAX call for JSON
        $.getJSON( '/samples/teams', function(data) {
            var options = ['<option value="all">all</option>'];
            data.forEach(function(team) {
                options.push('<option value="' + team.team_id + '">' + team.team_id + '</option>');
            });

            $('#teams-list').html(options.join(''));
        });

    }

    function getRosterByTeam(teamId) {
        var tableContent = '';

        // jQuery AJAX call for JSON
        $.getJSON( '/samples/roster/' + teamId, function(data) {
            console.log('data here', data);
            //var cubans = data.players.filter(function (player) {return player.birthplace.toLowerCase().indexOf('cuba') > -1;});
            // For each item in our JSON, add a table row and cells to the content string
            $.each(data.players, function() {
                tableContent += '<tr>';
                tableContent += '<th scope="row">' + this.uniform_number + '</th>';
                tableContent += '<td>' + this.first_name + ' ' + this.last_name + '</td>';
                tableContent += '<td>' + this.team + '</td>';
                tableContent += '<td>' + this.birthdate + '</td>';
                tableContent += '<td>' + this.height_in + '</td>';
                tableContent += '<td>' + this.weight_lb + '</td>';
                tableContent += '<td>' + this.position + '</td>';
                tableContent += '<td>' + this.bats + '</td>';
                tableContent += '<td>' + this.throws + '</td>';
                tableContent += '<td>' + this.roster_status + '</td>';
                tableContent += '</tr>';
            });

            // Inject the whole content string into our existing HTML table
            $('#roster-content tbody').html(tableContent);
        });

    }

    function populateCubans() {
        var tableContent = '';

        // jQuery AJAX call for JSON
        $.getJSON( '/samples/roster-json', function(data) {
            console.log('data here', data);
            //var cubans = data.players.filter(function (player) {return player.birthplace.toLowerCase().indexOf('cuba') > -1;});
            // For each item in our JSON, add a table row and cells to the content string
            $.each(data, function() {
                tableContent += '<tr>';
                tableContent += '<th scope="row">' + this.uniform_number + '</th>';
                tableContent += '<td>' + this.first_name + ' ' + this.last_name + '</td>';
                tableContent += '<td>' + this.team + '</td>';
                tableContent += '<td>' + this.birthdate + '</td>';
                tableContent += '<td>' + this.height_in + '</td>';
                tableContent += '<td>' + this.weight_lb + '</td>';
                tableContent += '<td>' + this.position + '</td>';
                tableContent += '<td>' + this.bats + '</td>';
                tableContent += '<td>' + this.throws + '</td>';
                tableContent += '<td>' + this.roster_status + '</td>';
                tableContent += '</tr>';
            });

            // Inject the whole content string into our existing HTML table
            $('#roster-content tbody').html(tableContent);
        });

    }

    function populateTable() {
        var tableContent = '';

        // jQuery AJAX call for JSON
        $.getJSON( '/samples/roster', function(data) {
            console.log('data here', data);
            //var cubans = data.players.filter(function (player) {return player.birthplace.toLowerCase().indexOf('cuba') > -1;});
            // For each item in our JSON, add a table row and cells to the content string
            $.each(data, function() {
                tableContent += '<tr>';
                tableContent += '<th scope="row">' + this.uniform_number + '</th>';
                tableContent += '<td>' + this.first_name + ' ' + this.last_name + '</td>';
                tableContent += '<td>' + data.team.abbreviation + '</td>';
                tableContent += '<td>' + this.birthdate + '</td>';
                tableContent += '<td>' + this.height_in + '</td>';
                tableContent += '<td>' + this.weight_lb + '</td>';
                tableContent += '<td>' + this.position + '</td>';
                tableContent += '<td>' + this.bats + '</td>';
                tableContent += '<td>' + this.throws + '</td>';
                tableContent += '<td>' + this.roster_status + '</td>';
                tableContent += '</tr>';
            });

            // Inject the whole content string into our existing HTML table
            $('#roster-content tbody').html(tableContent);
        });

    }

})();