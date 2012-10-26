var ensure2dindex  = function(messages){
    messages._collection._ensureIndex('messages', {loc: '2d'});
    
    var getMongoCollectionDb = function(collection, callback) {
//        console.log(arguments);
        /*var ticket = Meteor.setInterval(function(){
            if (collection._driver.mongo.db) {
                Meteor.clearInterval(ticket);
                callback(collection._driver.mongo.db);
            }
        }, 200);*/
    };
    
    
    // getMongoCollectionDb(messages, function(db){
    //     db.collection('messages', function(error, mongo){
    //         mongo.db.ensureIndex('messages', {loc: '2d'}, {}, function(){
    //             // console.log('2d index ensured');
    //         });
    //     });
    // });
    
};