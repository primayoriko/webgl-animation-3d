export class Application {
  constructor(gl, canvas){
    this.gl = gl;
    this.canvas = canvas;
    this.models = []
  }

  addModel(model){
    this.models.push(model);
  }

  render(){
    this.models.forEach(model => model.render());

  }
}