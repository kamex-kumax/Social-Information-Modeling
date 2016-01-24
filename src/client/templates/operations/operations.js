Template.operations.events({
  "click .codeselect": function() {
    // event.preventDefault();
    console.log("hoge");
    // var operation = e

    Operations.insert({
      // operation:
      createdAt: new Date()
    });

    console.log(Operations.find().count());
  }
})
