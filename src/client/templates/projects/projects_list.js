Template.projectsList.helpers({
  projects: function() {
    return Projects.find();
  }
});

Template.projectsList.events({
  'submit form': function(e) {
    e.preventDefault();

    var project = {
      title: $(e.target).find('[name=projectTitle]').val(),
      createdAt: new Date()
    }

    Projects.insert(project);
    $(e.target).find('[name=projectTitle]').val("");
  }
})
