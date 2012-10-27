var ensure2dindex  = function(messages){
    messages._collection._ensureIndex({loc: '2d'});  
};