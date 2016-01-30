Template.operations.events({
  "click .codeselect": function(ev) {
    var operation = $(':button[name="codeselect"]').val();

    if(operation !== "waiting") {

      $(':button[name="codeselect"]').val("waiting");

      var operationTree = OperationsTree.findOne({
        operation: operation
      });
      if(operationTree){
        OperationsTree.update(
          operationTree._id,
          { $set: {
              updatedAt: new Date()
            }
          });
      }else{
        var date = new Date()
        OperationsTree.insert({
          operation: operation,
          parent: operationParent(operation),
          createdAt: date,
          updatedAt: date
        })
        operationTree = OperationsTree.findOne({
          operation: operation
        })
      }

      Operations.insert({
        project: this._id,
        operationTree: operationTree._id,
        createdAt: new Date()
      });

      var insert = Operations.findOne({
        project: this._id,
        operationTree: operationTree._id
      })

      console.log("operationCounter",Operations.find({operationTree:operationTree._id}).count())


    };
  },

  "click .suggestionsList": function() {
    Modal.show('suggestionsList')
  }
})

Template.operations.helpers({
  // manage log bar
  operations: function() {
    var operations = Operations.find({
      project: this._id
    });
    return operations;
  },

  operationTree: function() {
    var operationTree = OperationsTree.findOne({
      _id: this.operationTree
    })
    return operationTree.operation;
  }
})

function operationParent(operation) {
  var parent = operation.substr(0, (operation.length-3)) + operation.substr(-2);
  console.log(parent);
  if ( parent.length > 2 ) {
    return parent
  } else {
    return "init"
  }
}
