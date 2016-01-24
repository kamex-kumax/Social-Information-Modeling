Template.operations.events({
  "click .codeselect": function(ev) {
    var operation = $(':button[name="codeselect"]').val();

    Operations.insert({
      operation: operation,
      createdAt: new Date()
    });

    console.log(Operations.find().count());
  }
})
