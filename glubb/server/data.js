
var dummyData = function(messages){
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