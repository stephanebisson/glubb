if (Meteor.is_client) {
    var messages = new Meteor.Collection('messages');

    Session.set('loc', [0,0]);
    window.navigator.geolocation.watchPosition(function(pos) {
        Session.set('loc', [pos.coords.longitude, pos.coords.latitude]);
    });
    
    Meteor.autosubscribe(function(){
        Meteor.subscribe('messages', Session.get('loc'));
    });

    Template.add.events = {
        'click #add': function() {
            var textarea = $('#theText');
            if (!textarea.val()) { return; }
            messages.insert({
                text: textarea.val(),
                loc: Session.get('loc'),
                timestamp: Date.now()
            });
            textarea.val('');
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
        
    var distance = function(loc1, loc2){
        var p1 = new LatLon(loc1[0], loc1[1]);
        var p2 = new LatLon(loc2[0], loc2[1]);
        return p1.distanceTo(p2);
    };

    Template.view.messages = function() {
        return messages.find({});
    };

    Template.view.format = function(d) {
        return new Date(d).toLocaleString();
    };

    Template.view.distance = function(loc) {
        var myloc = Session.get('loc');
        if (myloc) {
            return distance(loc, myloc);
        }
        return '?';
    };
}

if (Meteor.is_server) {
    var messages = new Meteor.Collection('messages');
    
    var getMongoCollectionDb = function(collection, callback) {
        var ticket = Meteor.setInterval(function(){
            if (collection._driver.mongo.db) {
                Meteor.clearInterval(ticket);
                callback(collection._driver.mongo.db);
            }
        }, 200);
    };
    
    var dummyData = function(){
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
        
    };
    
    Meteor.startup(function(){
        //dummyData();

        Meteor.publish('messages', function(where){
            return messages.find({loc: {$near: where}}, {limit: 3});
        });

        getMongoCollectionDb(messages, function(db){
            db.collection('messages', function(error, mongo){
                mongo.db.ensureIndex('messages', {loc: '2d'}, {}, function(){
                    // console.log('2d index ensured');
                });
            });
        });
    });
}
