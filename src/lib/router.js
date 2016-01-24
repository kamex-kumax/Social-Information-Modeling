Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() { return Meteor.subscribe('operations'); }
});

Router.route('/', {name: 'operations'});
