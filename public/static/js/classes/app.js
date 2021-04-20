import m4 from "../utils/m4-utils.js";
export default class Application {
    constructor(canvas, gl) {
        this.gl = gl;
        this.canvas = canvas;
        this.models = [];
        this.fps = 60;
        this.enableTextureAndShading = true;
        this.projection = {
            type: "",
            params: [],
            matrix: m4.new()
        };
        this.camera = {
            radius: 10,
            angle: 0,
        }

        // this.init();
    }

    init() {
        // const [left, right] = [-40, 40];
        // const [bottom, top] = [-23, 23];
        // const near = -40;
        // const far = 40;
        const len = 40;
        const [left, right] = [-len, len];
        const [bottom, top] = [-len, len];
        const near = -300;
        const far = 300;

        this.setProjection("orthographic", [left, right, bottom, top, near, far]);
    }

    loadData(data){
        const { models } = this;

        this.enableTextureAndShading = data.enableTextureAndShading;

        for(let i = 0; i < data.models.length; i++){
            models[i].loadData(data.models[i]);

        }
    }

    addModel(model) {
        this.models.push(model);
    }

    setProjection(type, params) {
        const { projection } = this;

        projection.type = type;
        projection.params = params;

        this.updateProjectionMatrix();
    }

    updateProjectionMatrix() {
        const { projection } = this;
        const { type, params } = projection;

        if (type == "orthographic") {
            projection.matrix = m4.orthographic(...params);
            // console.log(matrixArr);
        } else {
            throw Error("not implemented yet projection type");
        }

        console.log(projection.params);
        // else if (type == "perspective") {
        //     projection.matri = m4.perspective(...params);
        // }

        // this.projectionMatrix = m4.inverse(this.projectionMatrix);

        this.models.forEach(model => model.setProjectionMatrix(projection.matrix));
    }

    setCameraRadius(radius){
        const { camera, projection } = this;
        const { params } = projection;

        camera.radius = radius;

        params[0] = -radius;
        params[1] = radius;
        params[2] = -0.55 * radius;
        params[3] = 0.55 * radius;

        this.updateProjectionMatrix();

    }

    setCameraAngle(angle){
        this.camera.angle = angle;

        updateViewMatrix();
    }

    updateViewMatrix(){

    }

    toggleTextureAndShading(){
        this.enableTextureAndShading = !this.enableTextureAndShading;
        
        this.models.forEach(model => 
            model.setTextureAndShading(this.enableTextureAndShading));

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