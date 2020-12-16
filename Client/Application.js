    import './style/main.css'
    import * as THREE from './js/Three.js'

    import CANNON from 'cannon'
    import PointerLockControls from './js/PointerLockControls.js'

    //var EngineWorld = require('./EngineWorld.js');

    import EngineWorld from './EngineWorld.js'
    import EnginePlayer from './EnginePlayer.js'
    import EngineGround from './EngineGround.js'


export default class Application
{
    /**
     * Constructor
     */

    constructor(_options)
    {
        // Options
        this.$canvas = _options.$canvas;
        //this.controls = {};
        console.log(_options.$canvas);
        console.log(this);
        this.boxBodyPrincipal = {};
        this.controls = {};
        //var boxBodyPrincipal;
        //this.boxShapePrincipal;
        this.EngineWorldlocal = {};
        this.Start(_options.$canvas);
        this.animate = {};
    }

    Start(canvas)
    {
            console.log(this);
            var blocker = document.getElementById( 'blocker' );
            var instructions = document.getElementById( 'instructions' );
            console.log(instructions);


            var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
            console.log(havePointerLock);

            //this.canvas = document.querySelector('.js-canvas')
            console.log(canvas);
            canvas.style.display = 'none';


            if ( havePointerLock ) {

                var element = document.body;
                console.log(document.body);

                var pointerlockchange = function ( event ) {

                   if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
                        
                        
                        controlsVar.enabled = true;
                        blocker.style.display = 'none';

                    } else {

                        controlsVar.enabled = false;

                        blocker.style.display = '-webkit-box';
                        blocker.style.display = '-moz-box';
                        blocker.style.display = 'box';

                        instructions.style.display = '';

                    }

                }

                var pointerlockerror = function ( event ) {
                    instructions.style.display = '';
                }

                // Hook pointer lock state change events
                document.addEventListener( 'pointerlockchange', pointerlockchange, false );
                document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
                document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

                document.addEventListener( 'pointerlockerror', pointerlockerror, false );
                document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
                document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

                instructions.addEventListener( 'click', function ( event ) {
                    instructions.style.display = 'none';
                    console.log(canvas.style)
                    canvas.style.display = '';

                    // Ask the browser to lock the pointer
                    element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

                    if ( /Firefox/i.test( navigator.userAgent ) ) {

                        var fullscreenchange = function ( event ) {

                            if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {

                                document.removeEventListener( 'fullscreenchange', fullscreenchange );
                                document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

                                element.requestPointerLock();
                            }

                        }

                        document.addEventListener( 'fullscreenchange', fullscreenchange, false );
                        document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

                        element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

                        element.requestFullscreen();


                    } else {

                        element.requestPointerLock();
                        console.log(element.requestPointerLock());

                    }
               


                }, false );



            } else {

                instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

            }

           
                var firstTime= true;
                //var camera, scene, renderer;
                var geometry, material, mesh;
                var time = Date.now();

                var boxShapePrincipal, boxBodyPrincipal, world, physicsMaterial, walls=[], 
                balls=[], ballMeshes=[], boxes=[], boxMeshes=[], groundBody;

                var dt = 1/60;

                var ballShape = new CANNON.Sphere(0.2);
                var ballGeometry = new THREE.SphereGeometry(ballShape.radius, 32, 32);
                var shootDirection = new THREE.Vector3();
                var shootVelo = 50;
                var projector = new THREE.Projector();


                


            	var EngineWorldlocal = new EngineWorld();

                var world = EngineWorldlocal.world;
                console.log(EngineWorldlocal);
            	var EnginePlayer1 = new EnginePlayer(world);
            	//var boxBodyPrincipal = 1;
                var boxBodyPrincipal = EnginePlayer1.boxBodyPrincipal;
            	var boxShapePrincipal = {};
                boxShapePrincipal = EnginePlayer1.boxShapePrincipal;
            	var EngineGround1 = new EngineGround(world);
                

          

            //function init() {

                var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );//0.1

                var scene = new THREE.Scene();
                scene.fog = new THREE.Fog( 0x000000, 0, 500 );

                var ambient = new THREE.AmbientLight( 0x111111 );
                scene.add( ambient );

                var light = new THREE.SpotLight( 0xffffff );
                light.position.set( 20, 60, 40 );
                light.target.position.set( 0, 0, 0 );
                if(true){
                    light.castShadow = true;

                    light.shadowCameraNear = 20;
                    light.shadowCameraFar = 50;//camera.far;
                    light.shadowCameraFov = 40;

                    light.shadowMapBias = 0.1;
                    light.shadowMapDarkness = 0.7;
                    light.shadowMapWidth = 2*512;
                    light.shadowMapHeight = 2*512;

                    //light.shadowCameraVisible = true;
                }
                scene.add( light );



                //controls = new PointerLockControls( camera , sphereBody );
                console.log(this.controls);
                this.controls = new PointerLockControls( camera , boxBodyPrincipal);
                var controlsVar = this.controls;

                scene.add( this.controls.getObject() );

                // floor
                geometry = new THREE.PlaneGeometry( 300, 300, 50, 50 );
                geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

                material = new THREE.MeshLambertMaterial( { color: 0xdddddd } );

                mesh = new THREE.Mesh( geometry, material );
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                scene.add( mesh );

                //renderer = new THREE.WebGLRenderer();
                var renderer = new THREE.WebGLRenderer({ canvas })
                renderer.shadowMapEnabled = true;
                renderer.shadowMapSoft = true;
                renderer.setSize( window.innerWidth, window.innerHeight );
                renderer.setClearColor( scene.fog.color, 1 );

                //var rendererVar = renderer;

                //controls = new OrbitControls(this.camera, this.$canvas)


                document.body.appendChild( renderer.domElement );

                window.addEventListener( 'resize', onWindowResize, false );
                
                // Add boxes
                var halfExtents = new CANNON.Vec3(1,1,1);
                var boxShape = new CANNON.Box(halfExtents);
                var boxGeometry = new THREE.BoxGeometry(halfExtents.x*2,halfExtents.y*2,halfExtents.z*2);
                for(var i=0; i<7; i++){
                    var x = (Math.random()-0.5)*20;
                    var y = 1 + (Math.random()-0.5)*1;
                    var z = (Math.random()-0.5)*20;
                    var boxBody = new CANNON.Body({ mass: 0.2 });
                    boxBody.addShape(boxShape);
                    var boxMesh = new THREE.Mesh( boxGeometry, material );
                    world.addBody(boxBody);
                    scene.add(boxMesh);
                    boxBody.position.set(x,y,z);
                    boxMesh.position.set(x,y,z);
                    boxMesh.castShadow = true;
                    boxMesh.receiveShadow = true;
                    boxes.push(boxBody);
                    boxMeshes.push(boxMesh);
                }


                // Add linked boxes
                var size = 0.5;
                var he = new CANNON.Vec3(size,size,size*0.1);
                var boxShape = new CANNON.Box(he);
                var mass = 0;
                var space = 0.1 * size;
                var N = 5, last;
                var boxGeometry = new THREE.BoxGeometry(he.x*2,he.y*2,he.z*2);
                for(var i=0; i<N; i++){
                    var boxbody = new CANNON.Body({ mass: mass });
                    boxbody.addShape(boxShape);
                    var boxMesh = new THREE.Mesh(boxGeometry, material);
                    boxbody.position.set(5,(N-i)*(size*2+2*space) + size*2+space,0);
                    boxbody.linearDamping = 0.01;
                    boxbody.angularDamping = 0.01;
                    boxMesh.castShadow = true;
                    boxMesh.receiveShadow = true;
                    world.addBody(boxbody);
                    scene.add(boxMesh);
                    boxes.push(boxbody);
                    boxMeshes.push(boxMesh);

                    if(i!=0){
                        // Connect this body to the last one
                        var c1 = new CANNON.PointToPointConstraint(boxbody,new CANNON.Vec3(-size,size+space,0),last,new CANNON.Vec3(-size,-size-space,0));
                        var c2 = new CANNON.PointToPointConstraint(boxbody,new CANNON.Vec3(size,size+space,0),last,new CANNON.Vec3(size,-size-space,0));
                        world.addConstraint(c1);
                        world.addConstraint(c2);
                    } else {
                        mass=0.3;
                    }
                    last = boxbody;
                }
 

               function step() {
                    requestAnimationFrame(step);
                    if(controlsVar.enabled){
                        world.step(dt);

                      updatePositions(balls,boxes);
                    }
                    //console.log(controlsVar);
                    controlsVar.update( Date.now() - time );
                    renderer.render( scene, camera );
                    time = Date.now();
                }

                window.requestAnimationFrame(step);


            //}

            function onWindowResize() {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize( window.innerWidth, window.innerHeight );

            }

          


            function updatePositions(ballsArray,boxesArray){
                 // Update ball positions
                    for(var i=0; i<balls.length; i++){
                        ballMeshes[i].position.copy(ballsArray[i].position);
                        ballMeshes[i].quaternion.copy(ballsArray[i].quaternion);
                    }

                    // Update box positions
                    for(var i=0; i<boxes.length; i++){
                        boxMeshes[i].position.copy(boxesArray[i].position);
                        boxMeshes[i].quaternion.copy(boxesArray[i].quaternion);
                    }
            }

           
            
            function getShootDir(targetVec){
                var vector = targetVec;
                targetVec.set(0,0,1);
                projector.unprojectVector(vector, camera);
                var ray = new THREE.Ray(boxBodyPrincipal.position, vector.sub(boxBodyPrincipal.position).normalize() );
                targetVec.copy(ray.direction);
            }

            window.addEventListener("click",function(e){


                if(controlsVar.enabled==true){
                    var x = boxBodyPrincipal.position.x;
                    var y = boxBodyPrincipal.position.y;
                    var z = boxBodyPrincipal.position.z;
                    var ballBody = new CANNON.Body({ mass: 2 });
                    ballBody.addShape(ballShape);
                    var ballMesh = new THREE.Mesh( ballGeometry, material );
                    world.addBody(ballBody);
                    scene.add(ballMesh);
                    ballMesh.castShadow = true;
                    ballMesh.receiveShadow = true;
                    balls.push(ballBody);
                    ballMeshes.push(ballMesh);
                    getShootDir(shootDirection);
                    ballBody.velocity.set(  shootDirection.x * shootVelo,
                                            shootDirection.y * shootVelo,
                                            shootDirection.z * shootVelo);

                    // Move the ball outside the player sphere
                    x += shootDirection.x * (3 + ballShape.radius);
                    y += shootDirection.y * (2 + ballShape.radius);
                    z += shootDirection.z * (2 + ballShape.radius);
                    ballBody.position.set(x,y,z);
                    ballMesh.position.set(x,y,z);
                }
            });
        }
         

             
    }

