Template.operations.events({
  "click .codeselect": function() {

    Operations.insert({
      // operation:
      createdAt: new Date()
    });

    console.log(Operations.find().count());
  }
})
