var updateLocationInSession = function(){
    var hash = window.location.hash.slice(1);
    Session.set('currentRoute', hash);
};
$(window).bind('hashchange', updateLocationInSession);

Handlebars.registerHelper("currentView", function(options) {
    return (Template[Session.get('currentRoute')] || Template.welcome)();
});

Meteor.startup(updateLocationInSession);