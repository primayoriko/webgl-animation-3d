import Model from "./model.js";

import m4 from "../../utils/m4-utils.js";

import angle from "../../utils/angle-utils.js";

import { createProgram } from "../../utils/webgl-utils.js";

import vertexShader from "../../shaders/vertex.js";

import fragmentShader from "../../shaders/fragment.js";

export default class Horse extends Model {
  constructor(canvas, gl){
    super(canvas, gl);

    this.program = createProgram(this.gl, vertexShader, fragmentShader);

    this.modelViewMatrix = {
      scope: "uniform",
      location: gl.getUniformLocation(this.program, "modelViewMatrix"),
      value: m4.new(),
      type: "mat4",
    };

    this.projectionMatrix = {
      scope: "uniform",
      location: gl.getUniformLocation(this.program, "projectionMatrix"),
      value: m4.new(),
      type: "mat4",
    };

    this.vPosition = {
      scope: "attribute",
      buffer: gl.createBuffer(),
      location: gl.getAttribLocation(this.program, "vPosition"),
      value: [],
      size: 4,
    };

    this.vColor = {
      scope: "attribute",
      location: gl.getAttribLocation(this.program, "vColor"),
      value: [],
      size: 4,
    };

    // this.vNormal = {
    //   scope: "attribute",
    //   location: gl.getAttribLocation(this.program, "vNormal"),
    //   value: [],
    //   size: 3,
    // };

    console.log(this.modelViewMatrix);
    console.log(this.projectionMatrix);

    this.TORSO_ID = 0;
    this.NECK_ID = 1;
    this.HEAD_ID = 2;
    this.HEAD1_ID = 2;
    this.HEAD2_ID = 11;
    this.LEFT_FRONT_LEG_ID = 3;
    this.LEFT_FRONT_FOOT_ID = 4;
    this.RIGHT_FRONT_LEG_ID = 5;
    this.RIGHT_FRONT_FOOT_ID = 6;
    this.LEFT_BACK_LEG_ID = 7;
    this.LEFT_BACK_FOOT_ID = 8;
    this.RIGHT_BACK_LEG_ID = 9;
    this.RIGHT_BACK_FOOT_ID = 10;
    //
    this.GLOBAL_ANGLE_ID = 12;
    this.GLOBAL_X_COORDINATE = 13;
    this.GLOBAL_Y_COORDINATE = 14;

    this.torsoHeight = 8.0;
    this.torsoWidth = 3.0;
    this.upperArmHeight = 5.0;
    this.lowerArmHeight = 2.0;
    this.upperArmWidth = 1.3;
    this.lowerArmWidth = 0.8;
    this.upperLegWidth = 1.3;
    this.lowerLegWidth = 0.8;
    this.lowerLegHeight = 2.0;
    this.upperLegHeight = 5.0;
    this.headHeight = 3.5;
    this.headWidth = 1.5;
    this.neckHeight = 4.0;
    this.neckWidth = 2.0;

    this.numNodes = 11;
    this.numAngles = 11;

    this.frameOn = 0;
    this.theta = [90, 120, 90, 70, 10, 80, 10, 90, 40, 70, 30, 0, -90, 0, 0];

    // this.globalAngle = 270;
    this.knownLastIndex = 1;

    this.numVertices = 24;

    this.verticesSet = [
      -0.5, -0.5, 0.5, 1.0,
      -0.5, 0.5, 0.5, 1.0,
      0.5, 0.5, 0.5, 1.0,
      0.5, -0.5, 0.5, 1.0,
      -0.5, -0.5, -0.5, 1.0,
      -0.5, 0.5, -0.5, 1.0,
      0.5, 0.5, -0.5, 1.0,
      0.5, -0.5, -0.5, 1.0
    ];
    
    this.colorsSet = [
      0.6, 0.32, 0.17, 1.0, // Brown
      0.7, 0.3, 0.0, 1.0, // Brown dark
      0.5, 0.3, 0.1, 1.0, // Brown light
      0.5, 0.25, 0.14, 1.0 // Brown more lighten
    ];

    this.init();
  }

  init(){
    this.initShape();
    this.updateVars();

    this.initTorso();

    console.log(this.modelViewMatrix);
    console.log(this.projectionMatrix);

    // this.render();
  }

  render(){
    this.updateVars();

    console.log(this.modelViewMatrix);
    console.log(this.projectionMatrix);

    this.traverse(this.TORSO_ID);

    console.log(this.modelViewMatrix);
    console.log(this.projectionMatrix);
  }

  updateVars() {
    this.gl.useProgram(this.program);

    this.updateBuffer(this.projectionMatrix);
    this.updateBuffer(this.modelViewMatrix);

    this.updateBuffer(this.vPosition);
    this.updateBuffer(this.vColor);

    // this.updateBuffer(this.vNormal);

  }

  initTorso(){
    let m = m4.new();
    this.components[this.TORSO_ID] = Model.createNode(m, () => this.renderTorso(), null, null);//this.NECK_ID);
  }

  renderTorso() {
    // this.updateVars();

    console.log(this.modelViewMatrix);
    console.log(this.projectionMatrix);

    let instanceMatrix = m4.translate(this.modelViewMatrix.value, 0.0, 0.5 * this.torsoHeight, 0.0);
    instanceMatrix = m4.scale(instanceMatrix, this.torsoWidth, this.torsoHeight, this.torsoWidth);
    this.updateUniform(this.modelViewMatrix);
    // gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (let i = 0; i < 6; i++) this.gl.drawArrays(this.gl.TRIANGLE_FAN, 4 * i, 4);
  }
  
  // head() {
  //   instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * headHeight, 0.0));
  //   instanceMatrix = mult(instanceMatrix, scale4(headWidth, headHeight, headWidth));
  //   gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  //   for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  // }
  
  // neck() {
  //   instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * neckHeight, 0.0));
  //   instanceMatrix = mult(instanceMatrix, scale4(neckWidth, neckHeight, neckWidth));
  //   gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  //   for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  // }
  
  // leftUpperArm() {
  
  //   instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0));
  //   instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth));
  //   gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  //   for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  // }
  
  // leftLowerArm() {
  
  //   instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0));
  //   instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth));
  //   gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  //   for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  // }
  
  // rightUpperArm() {
  
  //   instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0));
  //   instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth));
  //   gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  //   for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  // }
  
  // rightLowerArm() {
  
  //   instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0));
  //   instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth));
  //   gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  //   for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  // }
  
  // leftUpperLeg() {
  
  //   instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0));
  //   instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth));
  //   gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  //   for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  // }
  
  // leftLowerLeg() {
  
  //   instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerLegHeight, 0.0));
  //   instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth));
  //   gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  //   for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  // }
  
  // rightUpperLeg() {
  
  //   instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0));
  //   instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth));
  //   gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  //   for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  // }
  
  // rightLowerLeg() {
  
  //   instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerLegHeight, 0.0));
  //   instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth))
  //   gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  //   for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  // }
  
  makeQuad(a, b, c, d) {
    this.vPosition.value.push(...this.verticesSet.slice(a, a+4));
    this.vPosition.value.push(...this.verticesSet.slice(b, b+4));
    this.vPosition.value.push(...this.verticesSet.slice(c, c+4));
    this.vPosition.value.push(...this.verticesSet.slice(d, d+4));
  }
  
  initShape() {
    this.makeQuad(1, 0, 3, 2);
    this.vColor.value.push(...this.colorsSet.slice(12, 16));
    this.vColor.value.push(...this.colorsSet.slice(12, 16));
    this.vColor.value.push(...this.colorsSet.slice(0, 4));
    this.vColor.value.push(...this.colorsSet.slice(0, 4));
    this.makeQuad(2, 3, 7, 6);
    this.vColor.value.push(...this.colorsSet.slice(12, 16));
    this.vColor.value.push(...this.colorsSet.slice(12, 16));
    this.vColor.value.push(...this.colorsSet.slice(0, 4));
    this.vColor.value.push(...this.colorsSet.slice(0, 4));
    this.makeQuad(3, 0, 4, 7);
    this.vColor.value.push(...this.colorsSet.slice(0, 4));
    this.vColor.value.push(...this.colorsSet.slice(0, 4));
    this.vColor.value.push(...this.colorsSet.slice(12, 16));
    this.vColor.value.push(...this.colorsSet.slice(12, 16));
    this.makeQuad(6, 5, 1, 2);
    this.vColor.value.push(...this.colorsSet.slice(8, 12));
    this.vColor.value.push(...this.colorsSet.slice(8, 12));
    this.vColor.value.push(...this.colorsSet.slice(8, 12));
    this.vColor.value.push(...this.colorsSet.slice(8, 12));
    this.makeQuad(4, 5, 6, 7);
    this.vColor.value.push(...this.colorsSet.slice(4, 8));
    this.vColor.value.push(...this.colorsSet.slice(4, 8));
    this.vColor.value.push(...this.colorsSet.slice(4, 8));
    this.vColor.value.push(...this.colorsSet.slice(4, 8));
    this.makeQuad(5, 4, 0, 1);
    this.vColor.value.push(...this.colorsSet.slice(12, 16));
    this.vColor.value.push(...this.colorsSet.slice(12, 16));
    this.vColor.value.push(...this.colorsSet.slice(0, 4));
    this.vColor.value.push(...this.colorsSet.slice(12, 16));
  }
}