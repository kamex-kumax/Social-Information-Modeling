$(function(){

  var width = window.innerWidth - 5,
      height = window.innerHeight - 5,
      line,
      i,
      boxList = {},
      planeList = {},
      targetList = [],
      selectMode = "box",
      selectedBox = null,
      selectedPlane = null,
      defaultRGB = "#ff0000",
      selectPlaneRGB = "#00ff00",
			textColor = 0x000000,
			textLabel = "SIM";

  // Scene
  var scene = new THREE.Scene()

  // Mesh
  var whd = [120, 120, 120];
  var pts = [20, whd[1]/2, 10];

  console.log(THREE);

  // var radius = 50,
  //     segments = 16,
  //     rings = 16;
  //
  // var sphereMaterial =
  //   new THREE.MeshLambertMaterial({
  //     color: 0xCC0000
  //   })
  //
  // var sphere = new THREE.Mesh(
  //
  //   new THREE.SphereGeometry(
  //     radius,
  //     segments,
  //     rings),
  //
  //   sphereMaterial);
  //
  // scene.add(sphere);

  // this code below runs when the state is an initial one.
  var geometry = new THREE.BoxGeometry(whd[0], whd[1], whd[2]);
  var material = new THREE.MeshLambertMaterial({
    color: 0x0000ff,
    side: THREE.DoubleSide,
    opacity: 0.5,
    transparent: true
  });
  console.log("boxmaterial", material);
  var initBox = new THREE.Mesh(geometry, material);
  var initName = "0";
  initBox.position.set(pts[0], pts[1], pts[2]);
  initBox.name = initName;
  scene.add(initBox);
  targetList.push(initBox);
  boxList[initBox.name] = initBox;
  initPlanes = initBox.planeBox();
  $.extend(planeList, initPlanes);


  // instantiate a loader
  var loader = new THREE.ColladaLoader();

  loader.load(
  	// resource URL
  	'/models/model/monster.dae',
  	// Function when resource is loaded
  	function ( collada ) {
  		scene.add( collada.scene );
  	},
  	// Function called when download progresses
  	function ( xhr ) {
  		console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
  	}
  );

  // light
  var light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 100, 30);
  scene.add(light);
  var ambient = new THREE.AmbientLight(0xffffff);
  scene.add(ambient);
  // camera
  var camera = new THREE.PerspectiveCamera(45, width / height);
  camera.position.set(200, 400, 300);

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
       selectedPlane.material.color.setStyle( defaultRGB );
       console.log("selPlane", selectedPlane.material.color);
       unSelectPlane();
     } else {
       if (selectedPlane) {
         selectedPlane.material.color.setStyle( defaultRGB );
         console.log("selPlane", selectedPlane.material.color);
       };
       plane.material.color.setStyle( selectPlaneRGB );
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
   var count = 0;
   $('#log').on('DOMSubtreeModified propertychange', function(){
     count += 1;
     if (count === 3) {
       count = 0;
       var code = $('#log p:last-child').attr('boxcode');
       selectedBox = boxList[code.substr( 0 , (code.length-2))];
       if(selectedBox){
         var result = operation(code, selectedBox);
         if (result){
           boxCommand(result, code);
         };
         $("#lr").attr("code", "waiting");
         $("#fb").attr("code", "waiting");
         $("#tb").attr("code", "waiting");
       }
     }
   });

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
     // refresh scene again
     for (key in boxList) {
       scene.remove(result.boxList[key]);
     }
     for (key in boxList) {
       scene.add(boxList[key]);
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

  $('#addLabelTextSubmit').on('click', function(){
    var label = $('#addLabelText').val();
    console.log("hogegege", label);
    if(selectedBox){
      data = label.match(/[^a-z]/gi);
      if (data) {
        alert ("Sorry! Only Alphabet is Allowed");
        return
      }
      var text = textMapping(selectedBox, label.toUpperCase(), textColor);
      scene.add(text);
    } else {
      alert("Please Select A Box!")
    }
  });

   function textMapping(box, label, color){
      var parameters = box.geometry.parameters,
          position = box.position,
          w = parameters.width,
          h = parameters.height,
          d = parameters.depth,
          x = position.x,
          y = position.y,
          z = position.z,
          length = label.length;

      var textParameter = {
        size: w/length, // how to know this?
        height: d, // how to know this?
        curveSegments: 3,
        font: "helvetiker",
        weight: "bold",
        style: "normal",
        bevelThickness: 1,
        bevelSize: 2,
        bevelEnabled: true
      }

      var TextGeometry = new THREE.TextGeometry( label, textParameter);
      var Material = new THREE.MeshLambertMaterial({
        color: color,
        side: THREE.DoubleSide,
        opacity: 0.5,
        transparent: true
      });
      var text =  new THREE.Mesh( TextGeometry, Material );

      console.log(w, h, d);

      if((d>w && w>h) || (d>h && h>w)){
        text.rotation.set(0,Math.PI/2,0);
        text.position.x = x-w/2;
        text.position.y=y-h/2;
        text.position.z=z+d/2;
        console.log("pon00");
        text.scale.x = d/w;
        text.scale.y = (h*length)/w;
        //text.scale.y=(h*length*0.8)/w;
        text.scale.z = w/d;
        console.log("pon00");
      }

      else if(h>w && w>d){
        text.rotation.set(0,0,Math.PI/2)
        text.position.x = x+w/2;
        text.position.y = y-h/2;
        text.position.z = z-d/2;
        console.log("pon01");

        text.scale.x = h/w;
        text.scale.y = length;
        console.log("pon01");
        //text.scale.y=length*0.8;
      }

      else if(h>d && d>w ){
        text.rotation.set(0,Math.PI/2,Math.PI/2);
        text.position.x = x-w/2;
        text.position.y = y-h/2;
        text.position.z = z-d/2;
        console.log("pon10");

        text.scale.x = h/w;
        //ext.scale.x=(0.9*h)/w;
        text.scale.y = (length*d)/w;
        //text.scale.y=(0.85*length*d)/w;
        text.scale.z = w/d;
        console.log("pon10");
      }

      else{
        text.position.x = x-w/2;
        text.position.y = y-h/2;
        text.position.z = z-d/2;
        console.log("pon11");

        text.scale.y = (h*length)/w;
        //text.scale.y=(h*length*0.9)/w;
      }

      return text
   };
});
