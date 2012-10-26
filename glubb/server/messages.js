Meteor.startup(function(){
    var messages = new Meteor.Collection('messages');
    dummyData(messages);
    ensure2dindex(messages);
    Meteor.publish('messages', function(where, isSuper){
        if (isSuper) {
            return messages.find({}, {sort: {timestamp: -1}});
        }
        else {
            return messages.find({loc: {$near: where}}, {limit: 8});
        }
    });
});