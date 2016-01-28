Template.addLabel.helpers({
  operationLabel: function() {
      var val =  $(':button[name="codeselect"]').val();
      return val;
  }
});

Template.addLabel.events({
  "click .addLabelForm": function(e) {
    e.preventDefault();

    var text = $(e.target).find('[name=lanelName]').val();

    console.log("text", text);
  }
})
