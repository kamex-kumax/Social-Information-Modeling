(function(){

  var width = window.innerWidth,
      height = window.innerHeight,
      line,
      i,
      boxList = {},
      planeList = {},
      targetList = [],
      selectMode = "box",
      selectedBox = null,
      selectedPlane = null,
      defaultRGB = [1, 0, 0],
      selectPlaneRGB = [0, 1, 0];
      // topology = new graphlib.Graph();
      // selectPlaneHEX = 0x00ff00;

  // Scene
  var scene = new THREE.Scene()

  // Mesh
  var whd = [120, 120, 120];
  var pts = [20, whd[1]/2, 10];

  var geometry = new THREE.BoxGeometry(whd[0], whd[1], whd[2]);
  var material = new THREE.MeshLambertMaterial({
    color: 0x0000ff,
    side: THREE.DoubleSide,
    opacity: 0.5,
    transparent: true
  });
  var initBox = new THREE.Mesh(geometry, material);
  var initName = "0";
  initBox.position.set(pts[0], pts[1], pts[2]);
  initBox.name = initName;
  scene.add(initBox);
  targetList.push(initBox);
  boxList[initBox.name] = initBox;
  initPlanes = initBox.planeBox();
  // i wanna use children for an ease
  // $.map(initPlanes[initBox.name], function(plane){initBox.add(plane)});
  $.extend(planeList, initPlanes);
  //Inital topology
  // topology.setNode(initName, initBox);

  // light
  var light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 100, 30);
  scene.add(light);
  var ambient = new THREE.AmbientLight(0xffffff);
  scene.add(ambient);
  // camera
  var camera = new THREE.PerspectiveCamera(45, width / height);
  camera.position.set(200, 200, 300);

  // helper
  var axis = new THREE.AxisHelper(1000);
  axis.position.set(0, 0, 0);
  scene.add(axis);
  var grid = new THREE.GridHelper(100, 10);
  scene.add(grid);

  // rendering
  var renderer = Detector.webgl? new THREE.WebGLRenderer(): new THREE.CanvasRenderer();
  renderer.setSize(width, height);
  renderer.setClearColor(0xeeeeee, 1);
  document.body.appendChild(renderer.domElement);

  // controls
  var controls = new THREE.OrbitControls(camera, renderer.domElement);
  document.body.appendChild(renderer.domElement);

  function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    controls.update();
  }
  render();

  renderer.render(scene, camera);

  // transformControl
  // ctrl = new THREE.TransformControls(camera, renderer.domElement);
  // setControl(ctrl, scene);

  // sinResize
  var winResize   = new THREEx.WindowResize(renderer, camera);

  //////////
  // Picking
  var projector = new THREE.Projector();
  var mouse = { x: 0, y: 0 };
  window.onmousedown = function (ev){
    if (ev.target == renderer.domElement) {
      var rect = ev.target.getBoundingClientRect();
      mouse.x =  ev.clientX - rect.left;
      mouse.y =  ev.clientY - rect.top;
      mouse.x =  (mouse.x / width) * 2 - 1;
      mouse.y = -(mouse.y / height) * 2 + 1;
      var vector = new THREE.Vector3( mouse.x, mouse.y ,1);
      vector.unproject( camera );
      var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
      var obj = ray.intersectObjects( targetList );
      if ( obj.length > 0 ) {
        var obj = obj[0].object;
        if (obj.geometry.type == "BoxGeometry"){
          selectBox(obj);
          makeChoice(obj);
        } else if (obj.geometry.type == "PlaneGeometry") {
          selectPlane(obj);
          // makeChoice(selectedPlane);
        }
      }
    };
   };

   function selectBox(box){
     if (selectedBox) {
       scene.add(selectedBox);
       $.map(targetList, function(target){scene.remove(target)});
     };
     //  update selected box
     selectedBox = box;
     // changeMode
     selectMode = "plane";
     // remove selectedBox from the scene
     scene.remove(box);
     // add the planes which contains the selectedBox to the targetList
     targetist = [];
     targetList = planeList[box.name];
     // add selectedBox's planes for the scene
     $.map(planeList[box.name], function(plane){
       scene.add(plane);
     });
     // remove the selectedBox from the targetList
     removeFromList(targetList, box);
   };

   function selectPlane(plane){
     if (plane == selectedPlane){
       selectedPlane.material.color.setRGB(defaultRGB[0], defaultRGB[1], defaultRGB[2]);
       unSelectPlane();
     } else {
       if (selectedPlane) {
         selectedPlane.material.color.setRGB(defaultRGB[0], defaultRGB[1], defaultRGB[2]);
       };
       plane.material.color.setRGB(selectPlaneRGB[0], selectPlaneRGB[1], selectPlaneRGB[2]);
       //  update selected plane
       selectedPlane = plane;
     };
   };

   function unSelectPlane(){
     // changeMode
     selectMode = "box";
     // remove the planes which containes the selectedBox from the scene.
     $.map(targetList, function(target){scene.remove(target)});
     // make targetList equal to boxList
     targetList = [];
     for (key in boxList) {
       targetList.push(boxList[key]);
     };
     // add selectedBox to the scene
     scene.add(selectedBox);
     // refresh selected ones;
     selectedBox = null;
     selectedPlane = null;
   };


   // nav
   var sendFlag = false;
   $(':button[name="codeselect"]').click(function(){
       if(selectedBox){
         var code = $(this).val();
         var result = operation(code, selectedBox);
         if (result){
           boxCommand(result, code);
         };
         $("#lr").attr("code", "waiting");
         $("#fb").attr("code", "waiting");
         $("#tb").attr("code", "waiting");
       }
     }
   );

  //  var sendFlag = false;
  //  $(".choice").on(
  //    'click',
  //    function(){
  //      if(selectedBox){
  //        var code = $(this).attr('code');
  //        var result = operation(code, selectedBox);
  //        if (result){
  //          boxCommand(result, code);
  //        };
  //        $("#lr").attr("code", "waiting");
  //        $("#fb").attr("code", "waiting");
  //        $("#tb").attr("code", "waiting");
  //      }
  //    }
  //  );

   function boxCommand(result, code){
     // change selectMode
     selectMode = "box"
     // remove existed objects(planes) from the scene
     // at this time, targetList is the planes which we need to elase
     $.map(targetList, function(target){scene.remove(target)});
     // remove selectedBox from boxList
     delete boxList[selectedBox.name];
     // extend boxList and planeList
     $.extend(boxList, result.boxList);
     $.extend(planeList, result.plane);
     // refresh targetList to box only
     targetList = [];
     for (key in boxList) {
       targetList.push(boxList[key]);
     };
     removeFromList(targetList, selectedBox);
     // add new boxes to the scene
     for (key in result.boxList) {
       scene.add(result.boxList[key]);
     };
     //logging
     logging([selectedBox.name, code]);
     //updateTopology
    //  updateTopology(topology, code, result);
     //refresh selected ones
     selectedBox = null;
     selectedPlane = null;
   };

   function makeChoice(box){
     name = box.name;
     $("#lr").attr("code", name + "LR");
     $("#fb").attr("code", name + "FB");
     $("#tb").attr("code", name + "TB");
   }

   $('#log').on(
    'click',
    '.log',
    function(){
      console.log("log");
    }
   );

   function logging(log){
    //  if (log[1] != "waiting"){
    //   var text = "<p class='log' planeCode='" + log[1] + "'boxCode='" + log[0] + "'>" + log[1] + "</p>"
    //   $("#log").append(text);
    //   log = null;
    //  }
    console.log("logging");
   };

   // general
   function removeFromList(list, target){
     list.some(function(v, i){
       if (v==target) list.splice(i,1);
     });
   };

})();
