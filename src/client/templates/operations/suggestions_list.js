Template.suggestionsList.helpers({
  operationsList: function() {
    console.log("project", this._id);
    var operationTree = Operations.findOne({ project: this._id }, { sort: {createdAt: -1, limit: 1}});

    var operationsList =  [
        { operation: "hoge" },
        { operation: "aho" },
        { operation: "fuga" }
      ]

    console.log("operationCounter",Operations.find({operationTree:operationTree._id}).count());
    return operationsList;
  }
});
