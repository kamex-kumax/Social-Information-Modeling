if (Projects.find().count() === 0) {
  Projects.insert({
    title: 'Introducing Telescope',
    url: '/projects/1'
  });

  Projects.insert({
    title: 'Meteor',
    url: '/projects/2'
  });

  Projects.insert({
    title: 'The Meteor Book',
    url: '/projects/3'
  });
}
