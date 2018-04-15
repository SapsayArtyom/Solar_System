window.onload = function() {
	var scene, camera, render, controls
	
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 1, 1000000 );
	camera.position.z = 120000;
	camera.position.y = 35000;
	camera.rotation.x = -Math.PI/10;
	controls = new THREE.RollControls(camera);
	controls.movementSpeed = 50000;
	controls.lookSpeed = 1.6;

	scene = new THREE.Scene();

	var light = new THREE.PointLight(0xffffff, 1.5, 150000);
	light.position.set( 0, 0, 0 );
	light.castShadow = true;
	light.shadow.mapSize.width = 2048;  
	light.shadow.mapSize.height = 2048;
	scene.add(light);


	//--------------Доп.свет-----------
	// var light2 = new THREE.AmbientLight( 0xffffff ); 
	// scene.add( light2 );

	var Planet = function(_radius, _texture) {
		this.radius = _radius;
		this.texture = _texture;
		
		var geom = new THREE.SphereGeometry(this.radius, 32, 32);
		var onloadT = new THREE.TextureLoader().load(this.texture);
		onloadT.anisotropy = 8;
		var mater = new THREE.MeshPhongMaterial({map: onloadT});
		var mesh = new THREE.Mesh(geom, mater);
		mesh.rotation.x = Math.PI/10;
		mesh.rotation.z = Math.PI/10;
		mesh.castShadow = true;
		return mesh;	
	}


	var starGeom = new THREE.Geometry();
	var starMat = new THREE.ParticleBasicMaterial({color:0xe6e6fa, size:1, sizeAttenuation:false})
	var stars;

	for (var i = 0; i < 5000; i++) {
		var vertex = new THREE.Vector3();
		vertex.x = Math.random()*2-1;
		vertex.y = Math.random()*2-1;
		vertex.z = Math.random()*2-1;
		vertex.multiplyScalar(15000)
		starGeom.vertices.push(vertex);
	}

	stars = new THREE.ParticleSystem(starGeom, starMat)
	stars.scale.set(35, 35, 35)
	scene.add(stars);


	var ringSaturnGeom = new THREE.Geometry();
	var ringSaturnMater = new THREE.ParticleBasicMaterial({color: 0x3A3A3A, opasity:0.3, size:1, sizeAttenuation:false});
	for (var i = 0; i < 60000; i++) {
		var vertex = new THREE.Vector3();
		vertex.x = Math.sin(Math.PI/180*i)*(2900-i/70);
		vertex.y = Math.random()*80;
		vertex.z = Math.cos(Math.PI/180*i)*(2900-i/70);
		ringSaturnGeom.vertices.push(vertex);
	}
	var ringSaturn = new THREE.ParticleSystem(ringSaturnGeom, ringSaturnMater);
	ringSaturn.rotation.x = Math.PI/10;
	ringSaturn.rotation.z = Math.PI/10;
	ringSaturn.castShadow = true;
	scene.add(ringSaturn);


	var Orbit = function(_radius) {
		var orbitGeom = new THREE.Geometry();
		var orbitMater = new THREE.ParticleBasicMaterial({color: 0x3A3A3A, size:1, sizeAttenuation:false});
		for (var i = 0; i < 36000; i++) {
			var vertex = new THREE.Vector3();
			vertex.x = Math.sin(Math.PI/180*i)*_radius;
			vertex.z = Math.cos(Math.PI/180*i)*_radius;
			orbitGeom.vertices.push(vertex);
		}
		var orbit = new THREE.ParticleSystem(orbitGeom, orbitMater);	
		orbit.castShadow = true;
		scene.add(orbit);
	}


	var sun_geom = new THREE.SphereGeometry(7000, 32, 32);
	var onloadT = new THREE.TextureLoader().load('resorse/2k_sun.jpg');
	var sun_mat= new THREE.MeshBasicMaterial({map: onloadT});
	var sun = new THREE.Mesh(sun_geom, sun_mat);
	scene.add(sun);

	var mercury = new Planet(250, 'resorse/2k_mercury.jpg');
	var mercuryOrbit = new Orbit(8725);
	scene.add(mercury);

	var venus = new Planet(600, 'resorse/2k_venus_surface.jpg');
	var venusOrbit = new Orbit(14000);
	scene.add(venus);

	var earth = new Planet(650, 'resorse/2k_earth_daymap.jpg');
	var earthOrbit = new Orbit(21579);	

	var moon = new Planet(150,'resorse/moon2.jpg');
	moon.rotation.x = Math.PI/3;
	moon.rotation.z = Math.PI/3;	
	var earthGroup = new THREE.Group();
	earthGroup.add(earth);
	earthGroup.add(moon);
	scene.add(earthGroup);

	var mars = new Planet(380, 'resorse/2k_mars.jpg');
	var marsOrbit = new Orbit(32000);	
	scene.add(mars);

	var jupiter = new Planet(1500, 'resorse/2k_jupiter.jpg');
	var jupiterOrbit = new Orbit(45000);	
	scene.add(jupiter);

	var saturn = new Planet(1800, 'resorse/2k_saturn.jpg');
	var saturnOrbit = new Orbit(57000);
	//saturn.rotation.z = -Math.PI/10;	
	scene.add(saturn);

	var uranium = new Planet(750, 'resorse/2k_uranus.jpg');
	var uraniumOrbit = new Orbit(65000);
	scene.add(uranium);

	var neptune = new Planet(825, 'resorse/2k_neptune.jpg');
	var neptuneOrbit = new Orbit(76000);	
	scene.add(neptune);

	var pluto = new Planet(375, 'resorse/pluto.png');
	var plutoOrbit = new Orbit(82000);	
	scene.add(pluto);


	render = new THREE.WebGLRenderer( {antialias: true , alpha: true} );
	render.setSize(window.innerWidth, window.innerHeight);
	render.clearColor(0xffffff);
	var t = 0;
	animate();

	function animate() {
		requestAnimationFrame(animate);

		controls.update(0.01);

		earthGroup.position.x = Math.sin(t*0.2)*21579;
		earthGroup.position.z = Math.cos(t*0.2)*21579;
		moon.position.x = Math.sin(t*0.7)*900;
		moon.position.z = Math.cos(t*0.7)*900;
		moon.position.y = Math.cos(t*0.7)*900;

		mars.position.x = Math.sin(t*0.2)*32000;
		mars.position.z = Math.cos(t*0.2)*32000;

		mercury.position.x = Math.sin(t*0.2)*8725;
		mercury.position.z = Math.cos(t*0.2)*8725;

		jupiter.position.x = Math.sin(t*0.2)*45000;
		jupiter.position.z = Math.cos(t*0.2)*45000;

		venus.position.x = Math.sin(t*0.2)*14000;
		venus.position.z = Math.cos(t*0.2)*14000;

		saturn.position.x = Math.sin(t*0.2)*57000;
		saturn.position.z = Math.cos(t*0.2)*57000;

		ringSaturn.position.x = saturn.position.x;
		ringSaturn.position.z = saturn.position.z;

		uranium.position.x = Math.sin(t*0.2)*65000;
		uranium.position.z = Math.cos(t*0.2)*65000;

		neptune.position.x = Math.sin(t*0.2)*76000;
		neptune.position.z = Math.cos(t*0.2)*76000;

		pluto.position.x = Math.sin(t*0.2)*82000;
		pluto.position.z = Math.cos(t*0.2)*82000;

		sun.rotation.y += 0.01;
		mercury.rotation.y += 0.01;
		venus.rotation.y += 0.01;
		earth.rotation.y += 0.01;
		jupiter.rotation.y += 0.01;
		mars.rotation.y += 0.01;
		uranium.rotation.y += 0.01;
		neptune.rotation.y += 0.01;
		pluto.rotation.y += 0.01;
		ringSaturn.rotation.y += 0.01;

		t += Math.PI/180*2;
		render.render(scene, camera);
	}


	document.body.appendChild(render.domElement);

}