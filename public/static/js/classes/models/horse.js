import Model from "./model";

export default class Horse extends Model {
  constructor(canvas, gl){
    super(canvas, gl);

    this.program = this.createProgram();

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
  }

  init(){

  }

  render(){

  }

  createProgram() {

  }

  torso() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * torsoHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(torsoWidth, torsoHeight, torsoWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
  
  head() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * headHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(headWidth, headHeight, headWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
  
  neck() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * neckHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(neckWidth, neckHeight, neckWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
  
  leftUpperArm() {
  
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
  
  leftLowerArm() {
  
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
  
  rightUpperArm() {
  
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
  
  rightLowerArm() {
  
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
  
  leftUpperLeg() {
  
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
  
  leftLowerLeg() {
  
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerLegHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
  
  rightUpperLeg() {
  
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
  
  rightLowerLeg() {
  
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerLegHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth))
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
  
  quad(a, b, c, d) {
    pointsArray.push(vertices[a]);
    pointsArray.push(vertices[b]);
    pointsArray.push(vertices[c]);
    pointsArray.push(vertices[d]);
  }
  
  
  cube() {
    quad(1, 0, 3, 2);
    colors.push(vertexColors[3]);
    colors.push(vertexColors[3]);
    colors.push(vertexColors[0]);
    colors.push(vertexColors[0]);
    quad(2, 3, 7, 6);
    colors.push(vertexColors[3]);
    colors.push(vertexColors[3]);
    colors.push(vertexColors[0]);
    colors.push(vertexColors[0]);
    quad(3, 0, 4, 7);
    colors.push(vertexColors[0]);
    colors.push(vertexColors[0]);
    colors.push(vertexColors[3]);
    colors.push(vertexColors[3]);
    quad(6, 5, 1, 2);
    colors.push(vertexColors[2]);
    colors.push(vertexColors[2]);
    colors.push(vertexColors[2]);
    colors.push(vertexColors[2]);
    quad(4, 5, 6, 7);
    colors.push(vertexColors[1]);
    colors.push(vertexColors[1]);
    colors.push(vertexColors[1]);
    colors.push(vertexColors[1]);
    quad(5, 4, 0, 1);
    colors.push(vertexColors[3]);
    colors.push(vertexColors[3]);
    colors.push(vertexColors[0]);
    colors.push(vertexColors[3]);
  }
}