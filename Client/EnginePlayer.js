



import CANNON from 'cannon'

export default class EnginePlayer
{

    constructor(_options){
        this.world = _options;
        console.log(_options + this.world);
        
        // Create a boxBodyPrincipal
        this.limits = new CANNON.Vec3(1,1,1);
        this.boxShapePrincipal = new CANNON.Box(this.limits);
        this.mass = 70//, radius = 3;
        //sphereShape = new CANNON.Sphere(radius);
        this.boxBodyPrincipal = new CANNON.Body({ mass: this.mass });
        console.log(this.boxBodyPrincipal)
        this.boxBodyPrincipal.addShape(this.boxShapePrincipal);
        this.boxBodyPrincipal.position.set(0,5,0);
        this.boxBodyPrincipal.linearDamping = 0.9;
        this.world.addBody(this.boxBodyPrincipal);
    }


    



}