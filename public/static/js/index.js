import Application from "./classes/app";

import Horse from "./classes/models/horse";

function main(){
  const { canvas, gl } = init();

  const app = new Application(canvas, gl);

  const horse = new Horse(canvas, gl);

  // TODO: Inisiasi model lain

  app.addModel(horse);

  // TODO: Tambah model lain ke app

  loadEvents();

  app.render();
}

function init(){
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

function loadEvents(){
  // TODO: Add interaksi dari UI gmn gitu

}

window.onload = main;