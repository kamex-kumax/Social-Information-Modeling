Template.suggestionsList.helpers({
  operationsList: [
      { operation: "hoge" },
      { operation: "aho" },
      { operation: "fuga" }
    ]
  // operationsList: function() {
  //   var operationsList = [
  //     { operation: "hoge" },
  //     { operation: "aho" },
  //     { operation: "fuga" }
  //   ];
  //   // var operationTree = OperationsTree.findOne({
  //   //   operation: "0TB"
  //   // })
  //   // var log =  Operations.findOne({
  //   //   prooject: this._id,
  //   //   operationTree: operationTree._id
  //   // })
  //
  //
  //   console.log("operationCounter",Operations.find({operationTree:operationTree._id}).count())
  //   return operationsList
  // }
});
