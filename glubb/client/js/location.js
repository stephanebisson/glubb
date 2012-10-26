Session.set('loc', [0,0]);

var receiveLocation = function(pos) {
    Session.set('loc', [pos.coords.longitude, pos.coords.latitude]);
};

var noop = function(){};

var opts = { enableHighAccuracy: true };

window.navigator.geolocation.getCurrentPosition(receiveLocation, noop, opts);
window.navigator.geolocation.watchPosition(receiveLocation, noop, opts);
