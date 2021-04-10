export default class Model {

  constructor(canvas, gl){
    this.gl = gl;
    this.canvas = canvas;
    this.program = null;
    this.modelViewMatrix = [];
    this.stack = [];
    this.components = [];
    this.colors = [];
    this.modelViewMatrixLoc = [];
  }

  init(){ /* TODO: Implement as your model */ }

  render(){ /* TODO: Implement as your model */ }

  static createNode(transform, render, sibling, child){
    return {
      transform,
      render,
      sibling, 
      child
    }
  }

  traverse(id){
    if (id == null) return;

    this.stack.push(this.modelViewMatrix);

    this.modelViewMatrix = mult(this.modelViewMatrix, this.components[Id].transform);

    this.components[Id].render();

    if (this.components[Id].child != null) 
      traverse(this.components[Id].child);

    modelViewMatrix = stack.pop();

    if (this.components[Id].sibling != null) 
      traverse(this.components[Id].sibling);

  }

}