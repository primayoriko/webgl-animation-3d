export default class Application {
  constructor(canvas, gl){
    this.gl = gl;
    this.canvas = canvas;
    this.models = [];
  }

  addModel(model){
    this.models.push(model);
  }

  render(){
    this.models.forEach(model => model.render());

  }
}