import m4 from "../../utils/m4-utils";
export default class Model {

  constructor(canvas, gl){
    this.gl = gl;
    this.canvas = canvas;
    this.program = null;
    this.modelViewMatrix = m4.new();
    this.stack = [];
    this.components = [];
    this.colors = [];
    this.program = null;
    this.modelViewMatrixLoc = null;
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