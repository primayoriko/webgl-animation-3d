import m4 from "../../utils/m4-utils";

export default class Model {

  constructor(canvas, gl){
    this.gl = gl;
    this.canvas = canvas;
    this.program = null;

    this.stack = [];
    this.components = [];

    this.modelViewMatrix = {
      scope: "uniform",
      location: gl.getUniformLocation(program, "modelViewMatrix"),
      value: m4.new(),
      type: "mat4",
    };

    this.projectionMatrix = {
      scope: "uniform",
      location: gl.getUniformLocation(program, "projectionMatrix"),
      value: m4.new(),
      type: "mat4",
    };

    this.vPosition = {
      scope: "attribute",
      buffer: gl.createBuffer(),
      location: gl.getAttribLocation(program, "vPosition"),
      value: [],
      size: 4,
    };

    this.vColor = {
      scope: "attribute",
      location: gl.getAttribLocation(program, "vColor"),
      value: [],
      size: 4,
    };

    // this.vNormal = {
    //   scope: "attribute",
    //   location: gl.getAttribLocation(program, "vNormal"),
    //   value: [],
    //   size: 3,
    // };

  }

  init(){ /* TODO: Implement as your model */ }

  render(){ /* TODO: Implement as your model */ }

  changeState(){ /* TODO: Implement as your model and as a time-variate function */ }

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

    this.stack.push(this.modelViewMatrix.value);

    this.modelViewMatrix.value = 
      m4.multiply(this.modelViewMatrix.value, this.components[Id].transform);

    this.components[Id].render();

    if (this.components[Id].child != null) 
      traverse(this.components[Id].child);

    this.modelViewMatrix.value = this.stack.pop();

    if (this.components[Id].sibling != null) 
      traverse(this.components[Id].sibling);

  }

  updateAll() {
    this.gl.useProgram(this.program);

    this.updateBuffer(this.projectionMatrix);
    this.updateBuffer(this.modelViewMatrix);

    this.updateBuffer(this.vPosition);
    this.updateBuffer(this.vColor);

    // this.updateBuffer(this.vNormal);

  }

  updateBuffer(bufferContainer){
    if(bufferContainer.scope === "uniform"){
      this.updateUniform(bufferContainer);

    } else if (bufferContainer.scope === "attribute") {
      this.updateAttribute(bufferContainer);

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
          new Float32Array(uniform.value)
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

}