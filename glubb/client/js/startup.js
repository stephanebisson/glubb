Meteor.startup(function(){
    var oneMinute = 60 * 1000;
    Session.set('now', new Date());
    Meteor.setInterval(function(){
        Session.set('now', new Date());
    }, oneMinute);
});