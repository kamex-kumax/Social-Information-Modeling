/** @namespace */
var Sim = Sim || {}

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
