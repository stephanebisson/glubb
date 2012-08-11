if (Meteor.is_client) {
    var messages = new Meteor.Collection('messages');
    
    Session.set('loc', [0,0]);
    
    var receiveLocation = function(pos) {
        Session.set('loc', [pos.coords.longitude, pos.coords.latitude]);
    };
    
    var noop = function(){};
    
    var opts = { enableHighAccuracy: true };
    
    window.navigator.geolocation.getCurrentPosition(receiveLocation, noop, opts);
    window.navigator.geolocation.watchPosition(receiveLocation, noop, opts);
    
    var isSuper = function(){
        return window.location.search === '?super';
    };
    
    Meteor.autosubscribe(function(){
        Meteor.subscribe('messages', Session.get('loc'), isSuper());
    });    
    
    Template.main.route = function(name){
        return window.location.search === ('?' + name);
    };
    
    Template.main.defaultRoute = function(){
        return !window.location.search;
    };
    
    Template.super.messages = function(){
        return messages.find({});
    };

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
    
    var locSet = function(){
        var loc = Session.get('loc');
        return (loc && loc[0] != 0 && loc[1] != 0);
    };
    
    Template.add.locEnabled = function(b){
        return locSet();
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

    Template.view.count = function() {
        return isSuper() ? messages.find({}).count() : '';
    };

    Template.view.format = function(d) {
        return new Date(d).toLocaleString();
    };

    Template.view.distance = function(loc) {
        if (locSet()) {
            var myloc = Session.get('loc');
            return distance(loc, myloc);
        }
        return '?';
    };
    
    var map;
    
    Meteor.startup(function(){
        if (isSuper()){
            var locFromSession = Session.get('loc');
            var loc = new google.maps.LatLng(locFromSession[1], locFromSession[0])
            var mapOptions = {
	          center: loc,
	          zoom: 3,
	          mapTypeId: google.maps.MapTypeId.ROADMAP
	        };
            map = new google.maps.Map(document.getElementById("map_canvas"),
                mapOptions);
                
            var marker = new google.maps.Marker({
                position: loc,
                title:"here and now",
                map: map
            });
            
            var allMarkers = [];
            var updateMarkers = function(){
                var ctx = new Meteor.deps.Context();
                ctx.on_invalidate(updateMarkers);
                ctx.run(function(){
                    _.each(allMarkers, function(m){m.setMap(null);});
                    _.each(messages.find({}).fetch(), 
                    function(msg){
                        allMarkers.push(new google.maps.Marker({
                            position: new google.maps.LatLng(msg.loc[1], msg.loc[0]),
                            title:msg.text,
                            map: map
                        }));
                    });
                });
            };
            updateMarkers();
        }
    });
    
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

        Meteor.publish('messages', function(where, isSuper){
            if (isSuper) {
                return messages.find({}, {sort: {timestamp: -1}});
            }
            else {
                return messages.find({loc: {$near: where}}, {limit: 3});
            }
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
