import m4 from "../utils/m4-utils.js";
export default class Application {
    constructor(canvas, gl) {
        this.gl = gl;
        this.canvas = canvas;
        this.models = [];
        this.cameraType = "";
        this.fps = 60;
    }

    addModel(model) {
        this.models.push(model);
    }

    setCamera(type, params) {
        var matrixArr = [];

        if (type == "orthographic") {
            matrixArr = m4.orthographic(...params);
            // console.log(matrixArr);
        } else if (type == "perspective") {
            matrixArr = m4.perspective(...params);
        }

        this.models.forEach(model => model.setProjectionMatrix(matrixArr));
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
        requestAnimationFrame(() => this._animate());
        let now = Date.now();
        this.elapsed = now - this.then;
        if (this.elapsed > this.fpsInterval) {
            this.then = now - (this.elapsed % this.fpsInterval);
            this.frameCount++;
            
            this.models.forEach(model => model.animate(this.frameCount) );
            this.render();
        }
    }
}