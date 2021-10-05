import { Raycaster, Vector3 } from 'three'

class Gravity {
    constructor() {
        this.radio = 3
    }
    check(position, list, height) {
        let ray = new Raycaster(
            new Vector3(
                position.x,
                position.y + height,
                position.z),
            new Vector3(0, -height, 0),
            0,
            this.radio
        );

        let tmp = ray.intersectObjects(list, true)[0]
            // console.log(tmp);
        let isGrounded = !!tmp && tmp.distance < this.radio
        return {
            isGrounded: isGrounded,
            radio: this.radio,
            tmp: tmp
        }
    }
}

let gravity = new Gravity()
export default gravity