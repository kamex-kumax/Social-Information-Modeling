//Sim
var pArgs = {
				color: 0xff0000,
				side: THREE.DoubleSide,
				opacity: 0.5,
				transparent: true
			}

function setControl(ctrl, scene){
	ctrl.setSpace('local');
	ctrl.setMode('translate');
	ctrl.addEventListener('change', function (e) {
			var object = e.target.object;
			var position = object.position;
			var rotation = object.rotation;
			var scale    = object.scale;
	});
	scene.add(ctrl);
};

///
THREE.Mesh.prototype.planeBox = function () {
	var parameters = this.geometry.parameters,
	    position = this.position,
			w = parameters.width,
			h = parameters.height,
			d = parameters.depth,
			x = position.x,
			y = position.y,
			z = position.z,
			tf = [-1, 1],
			planes = [],
			boxName = this.name,
			result = {};

	for (i = 0; i < 2; i++){
		var geometry = new THREE.PlaneGeometry(w, h);
		var material = new THREE.MeshLambertMaterial(pArgs);
		var plane = new THREE.Mesh(geometry, material);
		plane.position.set(0+x, 0+y, d/2*tf[i]+z);
		if(i == 0){
			plane.name = boxName + "_back"
		} else {
			plane.name = boxName + "_front"
		};
		planes.push(plane);
	};

	for (i = 0; i < 2; i++){
		var geometry = new THREE.PlaneGeometry(w, d);
		var material = new THREE.MeshLambertMaterial(pArgs);
		var plane = new THREE.Mesh(geometry, material);
		plane.position.set(0+x, h/2*tf[i]+y, 0+z);
		plane.rotation.x = 90 * Math.PI / 180;
		if(i == 0){
			plane.name = boxName + "_bottom"
		} else {
			plane.name = boxName + "_top"
		};
		planes.push(plane);
	};

	for (i = 0; i < 2; i++){
		var geometry = new THREE.PlaneGeometry(d, h);
		var material = new THREE.MeshLambertMaterial(pArgs);
		var plane = new THREE.Mesh(geometry, material);
		plane.position.set(w/2*tf[i]+x, 0+y, 0+z);
		plane.rotation.y = 90 * Math.PI / 180;
		if(i == 0){
			plane.name = boxName + "_left"
		} else {
			plane.name = boxName + "_right"
		};
		planes.push(plane);
	};

	// $.map(planes, function(plane){this.add(plane)});
	result[this.name] = planes;
	return result;
};

// Sim2
var mArgs = {
			color: 0x0000ff,
			side: THREE.DoubleSide,
			opacity: 0.5,
			transparent: true,
			visible: true
		}

var pArgs = {
				color: 0xff0000,
				side: THREE.DoubleSide,
				opacity: 0.5,
				transparent: true
			}

function setControl(ctrl, scene){
	ctrl.setSpace('local');
	ctrl.setMode('translate');
	ctrl.addEventListener('change', function (e) {
			var object = e.target.object;
			var position = object.position;
			var rotation = object.rotation;
			var scale    = object.scale;
	});
	scene.add(ctrl);
};

function selectColor(obj, RGB) {
	obj.material.color.setRGB(RGB[0], RGB[1], RGB[2]);
};

// function selectColor(obj, RGB) {
// 	if (obj.geometry.type == "BoxGeometry"){
// 		obj.material.color.setRGB(RGB[0], selectBoxRGB[1], selectBoxRGB[1]);
// 	} else if (obj.geometry.type == "PlaneGeometry"){
// 		obj.material.color.setRGB(selectPlaneRGB[0], selectPlaneRGB[1], selectPlaneRGB[1]);
// 	}
// };

function defaultColor(obj, RGB) {
	obj.material.color.setRGB(RGB[0], RGB[1], RGB[2]);
};

///////
function operation(code, box){
	if (code.slice(-2) == "FB" ) {
		var result = FrontAndBackSplit(box);
	} else if(code.slice(-2) == "LR" ) {
		var result = LeftAndRightSplit(box);
	} else if(code.slice(-2) == "TB" ) {
		var result = TopAndBottomSplit(box);
	} else {
		return false;
	};
	// エラーの時にfalseを返すように。
	if (result) {
		return result;
	};
}

// refacturing: split funcitons
function LeftAndRightSplit(box) {
	var parameters = box.geometry.parameters,
	    position = box.position,
			w = parameters.width,
			h = parameters.height,
			d = parameters.depth,
			x = position.x,
			y = position.y,
			z = position.z,
    	boxList = {},
    	planeList = [],
			name = box.name;

	var geometry = new THREE.BoxGeometry(w/2, h, d);
	var material = new THREE.MeshLambertMaterial(mArgs);
	var leftBox = new THREE.Mesh(geometry, material);
	var leftName = name + "0";
	leftBox.position.set(x, y, z); // rotte, scale
	leftBox.translateX( -w/4 );
	leftBox.name = leftName;
	boxList[leftName] = leftBox;
	var lPlanes = leftBox.planeBox();

	var rightBox = leftBox.clone();
	var materialR = new THREE.MeshLambertMaterial(mArgs);
	var rightName = name + "1";
	rightBox.material = materialR
	rightBox.translateX( w/2 );
	rightBox.name = rightName;
	boxList[rightName] = rightBox;
	var rPlanes = rightBox.planeBox();

	$.extend(planeList, lPlanes, rPlanes);
	return {boxList: boxList, plane: planeList};
}

function FrontAndBackSplit(box) {
	var parameters = box.geometry.parameters,
	    position = box.position,
			w = parameters.width,
			h = parameters.height,
			d = parameters.depth,
			x = position.x,
			y = position.y,
			z = position.z,
    	boxList = {},
    	planeList = [],
			name = box.name;

		var geometry = new THREE.BoxGeometry(w, h, d/2);
		var material = new THREE.MeshLambertMaterial(mArgs);
		var leftBox = new THREE.Mesh(geometry, material);
		var leftName = name + "2";
		leftBox.position.set(x, y, z);
		leftBox.translateZ( -d/4 );
		leftBox.name =  leftName;
		boxList[leftName] = leftBox;
		var lPlanes = leftBox.planeBox();

		var rightBox = leftBox.clone();
		var materialR = new THREE.MeshLambertMaterial(mArgs);
		var rightName = name + "3";
		rightBox.material = materialR;
		rightBox.translateZ( d/2 );
		rightBox.name = rightName;
		boxList[rightName] = rightBox;
		var rPlanes = rightBox.planeBox();

		$.extend(planeList, lPlanes, rPlanes);
		return {boxList: boxList, plane: planeList};
}

function TopAndBottomSplit(box) {
	var parameters = box.geometry.parameters,
	    position = box.position,
			w = parameters.width,
			h = parameters.height,
			d = parameters.depth,
			x = position.x,
			y = position.y,
			z = position.z,
    	boxList = {},
    	planeList = [],
			name = box.name;

		var geometry = new THREE.BoxGeometry(w, h/2, d);
		var material = new THREE.MeshLambertMaterial(mArgs);
		var bottomBox = new THREE.Mesh(geometry, material);
		var bottomName = name + "4";
		bottomBox.position.set(x, y, z);
		bottomBox.translateY( -h/4 );
		bottomBox.name =  bottomName;
		boxList[bottomName] = bottomBox;
		var tPlanes = bottomBox.planeBox();

		var topBox = bottomBox.clone();
		var materialT = new THREE.MeshLambertMaterial(mArgs);
		var topName = name + "5";
		topBox.material = materialT;
		topBox.translateY( h/2 );
		topBox.name = topName;
		boxList[topName] = topBox;
		var bPlanes = topBox.planeBox();

		$.extend(planeList, tPlanes, bPlanes);
		return {boxList: boxList, plane: planeList};
}


// function
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
  $('body').append(renderer.domElement);

  // controls
  var controls = new THREE.OrbitControls(camera, renderer.domElement);
  $('body').append(renderer.domElement);

  function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    controls.update();
  }
  render();

  // transformControl
  ctrl = new THREE.TransformControls(camera, renderer.domElement);
  setControl(ctrl, scene);

  // sinResize
  var winResize   = new THREEx.WindowResize(renderer, camera, ctrl, scene);

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
   $(".choice").on(
     'click',
     function(){
       if(selectedBox){
         var code = $(this).attr('code');
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
     if (log[1] != "waiting"){
      var text = "<p class='log' planeCode='" + log[1] + "'boxCode='" + log[0] + "'>" + log[1] + "</p>"
      $("#log").append(text);
      log = null;
     }
   };

   // general
   function removeFromList(list, target){
     list.some(function(v, i){
       if (v==target) list.splice(i,1);
     });
   };

})();
