import m4 from "../../utils/m4-utils.js";

export default class Model {

  constructor(canvas, gl){
    this.gl = gl;
    this.canvas = canvas;
    this.program = null;

    this.stack = [];
    this.components = [];

  }

  init(){ /* TODO: Implement as your model */ }

  render(){ /* TODO: Implement as your model */ }

  updateVars() { /* TODO: Impelment as your own model */ }

  generateNormal() { /* TODO: Impelment as your own model */ }

  setProjectionMatrix(matrixArr){ /* TODO: Implement as your model */ }

  changeState(){ /* TODO: Implement as your model and as a time-variate function */ }

  static createNode(transform, render, sibling, child){
    return {
      transform,
      render,
      sibling, 
      child
    }
  }

  traverse(id, modelViewMatrix=this.modelViewMatrix){
    if (id === null || id === undefined) return;

    const { components, stack } = this;

    if (components[id] === null || components[id] === undefined) return;

    // console.log(modelViewMatrix.value);

    stack.push(modelViewMatrix.value);

    modelViewMatrix.value = 
      m4.multiply(modelViewMatrix.value, components[id].transform);

    // console.log(modelViewMatrix.value);

    components[id].render();

    if (components[id].child != null) 
      this.traverse(components[id].child);

    modelViewMatrix.value = stack.pop();

    if (components[id].sibling != null) 
      this.traverse(components[id].sibling);

  }

  updateBuffer(bufferContainer){
    if(bufferContainer.scope === "uniform"){
      this.updateUniform(bufferContainer);

    } else if (bufferContainer.scope === "attribute") {
      this.updateAttribute(bufferContainer);

    } else if (bufferContainer.scope === "index") {
      this.updateIndex(bufferContainer);

    }
  }

  updateAttribute(attr) {
    const { gl } = this;
    gl.bindBuffer(gl.ARRAY_BUFFER, attr.buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(attr.value),
      gl.STATIC_DRAW
    );

    gl.enableVertexAttribArray(attr.location);
    gl.bindBuffer(gl.ARRAY_BUFFER, attr.buffer);
    gl.vertexAttribPointer(
      attr.location,
      attr.size,
      gl.FLOAT,
      false,
      0,
      0
    );
  }

  updateUniform(uniform) {
    const { gl } = this;
    switch (uniform.type) {
      case "mat4":
        gl.uniformMatrix4fv(
          uniform.location,
          false,
          new Float32Array(m4.transpose(uniform.value))
        );
        break;
      case "vec3":
        gl.uniform3fv(uniform.location, new Float32Array(uniform.value));
        break;
      case "bool":
        gl.uniform1i(uniform.location, uniform.value ? 1 : 0);
        break;
    }
  }

  updateIndex(indices){
    const { gl } = this;

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices.buffer);

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices.value), gl.STATIC_DRAW);
    
  }

}