import { ShooterSystem } from './ShooterSystem.js'
import { Vector2, Mesh, SphereGeometry, MeshStandardMaterial } from 'three'

class ShooterSystemTowerDefence extends ShooterSystem {
    constructor(){
        super()
        this.deadNPCs = new Map()
    }
    shoot() {
        this.raycaster.setFromCamera(new Vector2(), this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children, true)[0];
        if (intersects) {
            const bullet = new Mesh(
                new SphereGeometry(.05, 32, 32),
                new MeshStandardMaterial({
                    color: 0x660000,
                }));
            bullet.position.set(
                intersects.point.x,
                intersects.point.y,
                intersects.point.z,
            );
            intersects.object.attach(bullet)
            if(intersects.object.name =='redBox' && !this.deadNPCs.has(intersects.object.uuid)){
                this.deadNPCs.set(intersects.object.uuid, true)
                setTimeout(() => {
                    //todo trigger animation and visual feedback,
                    //todo trigger splatter blood animation
                    intersects.object.parent.remove(intersects.object)
                }, 1*1000);
            }
        }
    }
}
const shooterSystem = new ShooterSystemTowerDefence

export default shooterSystem
