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
