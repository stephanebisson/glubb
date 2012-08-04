if (Meteor.is_client) {
    var messages = new Meteor.Collection('messages');

    window.navigator.geolocation.watchPosition(function(pos) {
        Session.set('loc', [pos.coords.longitude, pos.coords.latitude]);
    });

    messages.remove({});
    messages.insert({
        text: 'hello from beijing',
        loc: [116.430, 39.93],
        timestamp: new Date(2012, 7, 2, 17, 50, 1, 2).getTime()
    });
    messages.insert({
        text: 'hello from wuhan',
        loc: [114.31, 30.71],
        timestamp: new Date(2012, 7, 4, 17, 52, 1, 2).getTime()
    });
    messages.insert({
        text: 'hello from xian',
        loc: [108.955, 34.27],
        timestamp: new Date(2012, 7, 4, 17, 55, 1, 2).getTime()
    });



    var defaultLoc = [0, 0];
    Template.add.events = {
        'click #add': function() {
            messages.insert({
                text: $('#theText').val(),
                timestamp: Date.now(),
                loc: Session.get('loc') || defaultLoc
            });
            $('#theText').val('');
        }
    };

    var today = function() {
            var now = new Date();
            now.setHours(0);
            now.setMinutes(0);
            now.setSeconds(0);
            now.setMilliseconds(0);
            return now.getTime();
        };

    Template.view.messages = function() {
        // var all = messages.find({timestamp: {$gt: today()}}, {sort: {timestamp: -1}}).fetch();
        var all = messages.find({}, {
            sort: {
                timestamp: -1
            }
        }).fetch();
        return all.slice(0, 7);
    };

    Template.view.format = function(d) {
        return new Date(d).toLocaleString();
    };

    Template.view.distance = function(loc) {
        var myloc = Session.get('loc');
        if (myloc) {
            var p1 = new LatLon(loc[0], loc[1]);
            var p2 = new LatLon(myloc[0], myloc[1]);
            return p1.distanceTo(p2);
        }
        return '?';
    };
}

if (Meteor.is_server) {
    var messages = new Meteor.Collection('messages');
}
