Package.describe({
  name: 'john5a18:three',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'threejs webgl 3D graphics library',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.export('THREE');

  api.add_files([
      //core
      'lib/three.min.js',

      //packages
      'lib/Detector.js',
      'lib/OrbitControls.js',
      'lib/Projector.js',
      'lib/TransformControls.js',
      'lib/ColladaLoader.js',
      'lib/threex.windowresize.js'
    ]);
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('john5a18:three');
  api.addFiles('three-tests.js');
});
