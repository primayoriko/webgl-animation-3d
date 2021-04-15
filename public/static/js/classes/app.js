import m4 from "../utils/m4-utils.js";
export default class Application {
  constructor(canvas, gl){
    this.gl = gl;
    this.canvas = canvas;
    this.models = [];
    this.cameraType = "";
  }

  addModel(model){
    this.models.push(model);
  }

  setCamera(type, params){
    var matrixArr = [];

    if(type == "orthographic"){
      matrixArr = m4.orthographic(...params);
      console.log(matrixArr);
    }
    // TODO: Klo mau proyeksi lain
    
    this.models.forEach(model => model.setProjectionMatrix(matrixArr));
  }

  render(){
    this.models.forEach(model => model.render());

  }
}