



import CANNON from 'cannon'

export default class EngineWorld
{

    constructor(){
        this.world = new CANNON.World();
        this.world.quatNormalizeSkip = 0;
        this.world.quatNormalizeFast = false;

        this.solver = new CANNON.GSSolver();

        this.world.defaultContactMaterial.contactEquationStiffness = 1e9;
        this.world.defaultContactMaterial.contactEquationRelaxation = 4;

        this.solver.iterations = 7;
        this.solver.tolerance = 0.1;
        this.split = true;
        if(this.split)
            this.world.solver = new CANNON.SplitSolver(this.solver);
        else
            this.world.solver = solver;

        this.world.gravity.set(0,-10,0);
        this.world.broadphase = new CANNON.NaiveBroadphase();

        // Create a slippery material (friction coefficient = 0.0)
        this.physicsMaterial = new CANNON.Material("slipperyMaterial");
        this.physicsContactMaterial = new CANNON.ContactMaterial(this.physicsMaterial,
                                                                this.physicsMaterial,
                                                                0.0, // friction coefficient
                                                                0.3  // restitution
                                                                );
        // We must add the contact materials to the world
        this.world.addContactMaterial(this.physicsContactMaterial);

    }


   



}
