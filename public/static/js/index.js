import Application from "./classes/app.js";

import Zebra from "./classes/models/zebra.js";
import Crocodile from "./classes/models/crocodile.js";
import Minecraft from "./classes/models/minecraft.js";
import angle from "./utils/angle-utils.js";

function main() {
    const { canvas, gl } = init();

    const app = new Application(canvas, gl);

    // const zebra = new Zebra(canvas, gl, document.getElementById("texImage"));

    // TODO: Inisiasi + tambah model lain

    app.addModel(new Zebra(canvas, gl, document.getElementById("texImage")));
    app.addModel(new Crocodile(canvas, gl));
    app.addModel(new Minecraft(canvas, gl));

    let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    let fov = 60;
    let zNear = 1;
    let zFar = 5000;
    app.setProjection("perspective", [angle.degToRad(fov), aspect, zNear, zFar]);

    // const len = 40;
    // const [left, right] = [-len, len];
    // const [bottom, top] = [-0.55 * len, 0.55 * len];
    // const near = -300;
    // const far = 300;

    // app.setProjection("orthographic", [left, right, bottom, top, near, far]);

    loadEvents(app);
    app.animate();
}

function init() {
    const canvas = document.getElementById('glCanvas');
    const gl = canvas.getContext('webgl');

    // gl.viewport(0, 0, canvas.width, canvas.height);
    // gl.clearColor(1.0, 1.0, 1.0, 1.0);
    // gl.clear(gl.COLOR_BUFFER_BIT);

    gl.clearDepth(1.0);
    gl.clearColor(1, 1, 1, 1.0);
    gl.enable(gl.DEPTH_TEST);
    // gl.enable(gl.CULL_FACE);
    gl.depthFunc(gl.LEQUAL);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    return { canvas, gl };
}

function loadEvents(app) {
    // TODO: Add interaksi dari UI gmn gitu

    const exportBtn = document.getElementById('export-btn');
    const importBtn = document.getElementById('import-btn');
    const uploadBtn = document.getElementById('upload-btn');
    const toggleBtn = document.getElementById('texture-shading-btn');
    const aniBtn = document.getElementById('animation-btn');
    const cameraAngleSlider = document.getElementById("camera-angle");
    const cameraRadiusSlider = document.getElementById("camera-radius");

    cameraRadiusSlider.oninput = () => {
        if (cameraRadiusSlider.nextElementSibling) {
            cameraRadiusSlider.nextElementSibling.innerHTML = cameraRadiusSlider.value;
        }
        app.setCameraRadius(parseFloat(cameraRadiusSlider.value));
    };

    cameraAngleSlider.oninput = event => {
        if (cameraAngleSlider.nextElementSibling) {
            cameraAngleSlider.nextElementSibling.innerHTML = cameraAngleSlider.value;
        }
        app.setCameraAngle(parseFloat(cameraAngleSlider.value));
    };

    toggleBtn.addEventListener('click', event => {
        app.toggleTextureAndShading();
    });

    aniBtn.addEventListener('click', event => {
        aniBtn.innerHTML = (aniBtn.innerHTML === " Stop Animation ") ? " Start Animation " : " Stop Animation "
        app.toggleAnimation();
    });

    exportBtn.addEventListener('click', event => {
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(app));
        var downloadWidget = document.getElementById('download-link');
        downloadWidget.setAttribute("href", dataStr);
        downloadWidget.setAttribute("download", "data.json");
        downloadWidget.click();
        // console.log(JSON.stringify(master));
    });

    importBtn.addEventListener('click', (e) => {
        if (window.FileList && window.File && window.FileReader) {
            uploadBtn.click();

        } else {
            alert("file upload not supported by your browser!");

        }
    });

    uploadBtn.addEventListener('change', (event) => {
        const reader = new FileReader();
        const file = event.target.files[0];

        reader.addEventListener('load', event => {
            try {
                var data = JSON.parse(event.target.result);

            } catch (err) {
                alert(`invalid json file data!\n${err}`);

            }

            app.loadData(data);

            alert("data loaded!");
            console.log("data loaded!");

        });

        reader.readAsText(file);
        // app.render();
    });

}

window.onload = main;