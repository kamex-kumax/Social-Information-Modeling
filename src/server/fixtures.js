if (Projects.find().count() === 0) {
  Projects.insert({
    title: 'Introducing Telescope',
    createdAt: new Date()
  });

  Projects.insert({
    title: 'Meteor',
    createdAt: new Date()
  });

  Projects.insert({
    title: 'The Meteor Book',
    createdAt: new Date()
  });
}
