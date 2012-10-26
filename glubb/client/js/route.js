$(window).bind('hashchange', function() {
    var hash = window.location.hash.slice(1);
    Session.set('currentRoute', hash);
});

Handlebars.registerHelper("currentView", function(options) {
    return (Template[Session.get('currentRoute')] || Template.welcome)();
});
