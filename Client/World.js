
    import CANNON from 'cannon'
    import PointerLockControls from './js/PointerLockControls.js'


                world = new CANNON.World();
                world.quatNormalizeSkip = 0;
                world.quatNormalizeFast = false;

                var solver = new CANNON.GSSolver();

                world.defaultContactMaterial.contactEquationStiffness = 1e9;
                world.defaultContactMaterial.contactEquationRelaxation = 4;

                solver.iterations = 7;
                solver.tolerance = 0.1;
                var split = true;
                if(split)
                    world.solver = new CANNON.SplitSolver(solver);
                else
                    world.solver = solver;

                world.gravity.set(0,-10,0);
                world.broadphase = new CANNON.NaiveBroadphase();

                // Create a slippery material (friction coefficient = 0.0)
                physicsMaterial = new CANNON.Material("slipperyMaterial");
                var physicsContactMaterial = new CANNON.ContactMaterial(physicsMaterial,
                                                                        physicsMaterial,
                                                                        0.0, // friction coefficient
                                                                        0.3  // restitution
                                                                        );
                // We must add the contact materials to the world
                world.addContactMaterial(physicsContactMaterial);

                // Create a boxBodyPrincipal
                var limits = new CANNON.Vec3(1,1,1);
                var boxShapePrincipal = new CANNON.Box(limits);
                var mass = 70//, radius = 3;
                //sphereShape = new CANNON.Sphere(radius);
                boxBodyPrincipal = new CANNON.Body({ mass: mass });
                console.log(boxBodyPrincipal)
                boxBodyPrincipal.addShape(boxShapePrincipal);
                boxBodyPrincipal.position.set(0,5,0);
                boxBodyPrincipal.linearDamping = 0.9;
                world.addBody(boxBodyPrincipal);

                // Create a plane
                var groundShape = new CANNON.Plane();
                /*var */groundBody = new CANNON.Body({ mass: 0 });
                groundBody.addShape(groundShape);
                groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
                world.addBody(groundBody);