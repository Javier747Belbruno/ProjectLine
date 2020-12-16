



import CANNON from 'cannon'

export default class EngineGround
{

    constructor(_options){
        this.world = _options;
        this.setGround();
    }


    setGround(){
        
        // Create a plane
        this.groundShape = new CANNON.Plane();
        this.groundBody = new CANNON.Body({ mass: 0 });
        this.groundBody.addShape(this.groundShape);
        this.groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
        this.world.addBody(this.groundBody);


    }



}