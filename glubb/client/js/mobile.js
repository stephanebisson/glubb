Handlebars.registerHelper("platform", function(platform, options) {
    if (platform === Session.get('platform')){
      return options.fn(this);
    }
});

Meteor.startup(function() {
    Session.set('platform', 'mobile');
});