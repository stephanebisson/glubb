var messages = new Meteor.Collection('messages');

Meteor.autosubscribe(function() {
    Meteor.subscribe('messages', Session.get('loc'), false);
});

Template.nav.isActive = function(route){
    return route === Session.get('currentRoute') ? 'active' : '';
};

Template.status.dead = function(){
    return !Meteor.status().connected;
};

Template.status.events = {
    'click #reconnect' : function(){
        Meteor.reconnect();
    }
};

Template.add.events = {
    'click #add': function() {
        var textarea = $('#theText');
        if (!textarea.val()) {
            return;
        }
        messages.insert({
            text: textarea.val(),
            loc: Session.get('loc'),
            timestamp: Date.now()
        });
        textarea.val('');
    },
    'click #enableGeolocation' : function(){
        initGeolocation();
    }
};

var locSet = function() {
        var loc = Session.get('loc');
        return (loc && loc[0] != 0 && loc[1] != 0);
    };

Template.add.locEnabled = function(b) {
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

var distance = function(loc1, loc2) {
        var p1 = new LatLon(loc1[0], loc1[1]);
        var p2 = new LatLon(loc2[0], loc2[1]);
        return p1.distanceTo(p2);
    };

Template.view.messages = function() {
    return messages.find({});
};

Template.view.timeAgo = function(d) {
    return new Date(d).toLocaleString();
};

Template.view.distance = function(loc) {
    if (locSet()) {
        var myloc = Session.get('loc');
        return distance(loc, myloc);
    }
    return '?';
};

Template.map.rendered = function(){
    var locFromSession = Session.get('loc');
    var loc = new google.maps.LatLng(locFromSession[1], locFromSession[0])
    var mapOptions = {
        center: loc,
        zoom: 3,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

    var marker = new google.maps.Marker({
        position: loc,
        title: "here and now",
        map: map
    });

    var allMarkers = [];
    var updateMarkers = function() {
            var ctx = new Meteor.deps.Context();
            ctx.on_invalidate(updateMarkers);
            ctx.run(function() {
                _.each(allMarkers, function(m) {
                    m.setMap(null);
                });
                _.each(messages.find({}).fetch(), function(msg) {
                    allMarkers.push(new google.maps.Marker({
                        position: new google.maps.LatLng(msg.loc[1], msg.loc[0]),
                        title: msg.text,
                        map: map
                    }));
                });
            });
        };
    updateMarkers();
};

Meteor.startup(function(){
    
});
