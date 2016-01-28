Template.operations.events({
  "click .codeselect": function(ev) {
    var operation = $(':button[name="codeselect"]').val();

    if(operation !== "waiting") {
      Operations.insert({
        project: this._id,
        operation: operation,
        createdAt: new Date()
      });
      $(':button[name="codeselect"]').val("waiting");
    };
  },

  "click .addLabel": function() {
    Modal.show('addLabel')
  }
})

Template.operations.helpers({
  // manage log bar
  operations: function() {
    return Operations.find({
      project: this._id
    });
  }
})
