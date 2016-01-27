Template.operations.events({
  "click .codeselect": function(ev) {
    var operation = $(':button[name="codeselect"]').val();

    Operations.insert({
      project: this._id,
      operation: operation,
      createdAt: new Date()
    });
    
    console.log(Operations.find().count());
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
