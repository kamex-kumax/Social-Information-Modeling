Router.configure({
  layoutTemplate: 'layout'
  // loadingTemplate: 'loading',
  // waitOn: function() { return Meteor.subscribe('operations'); }
});

Router.route('/sample', {name: 'operations'});
Router.route('/', {name: 'projectsList'});
Router.route('/projects/:_id', {
  name: 'projectPage',
  data: function(){return Projects.findOne(this.params._id);}
})
