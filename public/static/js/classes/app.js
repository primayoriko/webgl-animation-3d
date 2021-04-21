import vector from "../utils/vector-utils.js";
import m4 from "../utils/m4-utils.js";
import angle from "../utils/angle-utils.js";

export default class Application {
    constructor(canvas, gl) {
        this.gl = gl;
        this.canvas = canvas;
        this.models = [];
        this.fps = 60;
        this.enableTextureAndShading = true;
        this.animation = true;
        this.projection = {
            type: "",
            params: [],
            matrix: m4.new()
        };
        this.camera = {
            radius: 40,
            angle: 0,
            position: { x: 0, y: 0, z: 0 },
            target: { x: 0, y: 0, z: 0 },
            up: { x: 0, y: 1, z: 0 },
            matrix: m4.new()
        }

        // this.init();
    }

    init() {
        const len = 40;
        const [left, right] = [-len, len];
        const [bottom, top] = [-len, len];
        const near = -300;
        const far = 300;

        this.setProjection("orthographic", [left, right, bottom, top, near, far]);
    }

    loadData(data) {
        const { models } = this;

        this.enableTextureAndShading = data.enableTextureAndShading;
        this.animation = data.animation;
        this.camera = data.camera;
        this.projection = data.projection;
        this.frameCount = data.frameCount;
        this.then = data.then;
        this.elapsed = data.elapsed;

        for (let i = 0; i < data.models.length; i++) {
            models[i].loadData(data.models[i]);
            models[i].setTextureAndShading(data.enableTextureAndShading);
        }
        this.updateViewMatrix();
        this.updateProjectionMatrix();
        if (data.animation) {
            this._animate()
        } else {
            this.render();
        }
    }

    addModel(model) {
        const { projection, camera, 
            models, enableTextureAndShading } = this;

        models.push(model);

        model.setProjectionMatrix(m4.multiply(projection.matrix, camera.matrix));
        model.setTextureAndShading(enableTextureAndShading);

    }

    setProjection(type, params) {
        const { projection } = this;

        projection.type = type;
        projection.params = params;

        this.updateViewMatrix();
        this.updateProjectionMatrix();
    }

    updateProjectionMatrix() {
        const { projection, camera } = this;
        const { type, params } = projection;

        if (type == "orthographic") {
            projection.matrix = m4.orthographic(...params);
        } else if (type == "perspective") {
            projection.matrix = m4.perspective(...params);
        } else {
            throw Error("not implemented yet projection type");
        }

        this.models.forEach(model => model.setProjectionMatrix(m4.multiply(projection.matrix, camera.matrix)));
        if (!this.animation) {
            this.render();
        }
    }

    setCameraRadius(radius) {
        const { camera, projection } = this;
        const { params, type } = projection;

        camera.radius = radius;

        if (type === "perspective") {
            this.updateViewMatrix()

        } else {
            params[0] = -radius;
            params[1] = radius;
            params[2] = -0.55 * radius;
            params[3] = 0.55 * radius;
        }

        this.updateProjectionMatrix();

    }

    setCameraAngle(angle) {
        this.camera.angle = angle;

        this.updateViewMatrix();
        this.updateProjectionMatrix();
    }

    updateViewMatrix() {
        let cameraMatrix = m4.rotation(angle.degToRad(this.camera.angle), "y");
        cameraMatrix = m4.transpose(m4.translate(cameraMatrix, 0, 0, this.camera.radius));
        
        this.camera.position = { x: cameraMatrix[12], y: cameraMatrix[13], z: cameraMatrix[14] };
        cameraMatrix = vector.lookAt(this.camera.position, this.camera.target, this.camera.up);
        this.camera.matrix = m4.transpose(m4.inverse(cameraMatrix));

        this.models.forEach(model => model.setCameraPosition(this.camera.position));

    }

    toggleTextureAndShading() {
        this.enableTextureAndShading = !this.enableTextureAndShading;

        this.models.forEach(model =>
            model.setTextureAndShading(this.enableTextureAndShading));
        
        if (!this.animation) {
            this.render();
        }
    }

    toggleAnimation() {
        this.animation = !this.animation
        if (this.animation) {
            this._animate()
        }
    }

    render() {
        this.models.forEach(model => {
            model.render()
        });
    }

    animate() {
        // Setups animation
        this.then = Date.now();
        this.fpsInterval = 1000 / this.fps;
        this.startTime = undefined;
        this.frameCount = 0;
        this.elapsed = 0;
        this._animate();
    }

    _animate() {
        if (this.animation) {
            requestAnimationFrame(() => this._animate());
        }
        let now = Date.now();
        this.elapsed = now - this.then;
        if (this.elapsed > this.fpsInterval) {
            this.then = now - (this.elapsed % this.fpsInterval);
            this.frameCount++;

            this.models.forEach(model => model.animate(this.frameCount));
            this.render();
        }
    }
}