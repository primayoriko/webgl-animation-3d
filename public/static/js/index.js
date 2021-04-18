import Application from "./classes/app.js";

import Zebra from "./classes/models/zebra.js";
import Crocodile from "./classes/models/crocodile.js";

function main(){
    const { canvas, gl } = init();

    const app = new Application(canvas, gl);

    // const zebra = new Zebra(canvas, gl, document.getElementById("texImage"));

    // TODO: Inisiasi + tambah model lain

    // app.addModel(new Zebra(canvas, gl, document.getElementById("texImage")));
    app.addModel(new Crocodile(canvas, gl));

    app.setCamera("orthographic", [-40.0, 40.0, -23.0, 23.0, -40.0, 40.0]);

    // app.setCamera("orthographic", [-100.0, 100.0, -80.0, 80.0, -100.0, 100.0]);

    // console.log(app.models[0].modelViewMatrix);
    // console.log(app.models[0].projectionMatrix);

    loadEvents(app);

    function render() {
        console.log("rendering");
        app.render();
        // requestAnimationFrame(render);
    }

    render();
}

function init(){
    const canvas = document.getElementById('glCanvas');
    const gl = canvas.getContext('webgl');

    gl.clearDepth(1.0);
    gl.clearColor(0.2, 0.6, 0.2, 1.0);
    gl.enable(gl.DEPTH_TEST);
    // gl.enable(gl.CULL_FACE);
    gl.depthFunc(gl.LEQUAL);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    return { canvas, gl };
}

function loadEvents(app){
  // TODO: Add interaksi dari UI gmn gitu

    const exportBtn = document.getElementById('export-btn');
    const importBtn = document.getElementById('import-btn');
    const uploadBtn = document.getElementById('upload-btn');

    exportBtn.addEventListener('click', event => {
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(app));
        var downloadWidget = document.getElementById('download-link');
        downloadWidget.setAttribute("href",     dataStr     );
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
          try{
              var data = JSON.parse(event.target.result);
          } catch (err) {
              alert(`invalid json file data!\n${err}`);
          }

          // app.loadJSONData(data);
      });

      reader.readAsText(file);
      // app.render();
  });

}

window.onload = main;