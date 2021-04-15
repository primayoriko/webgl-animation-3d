import Model from "./model.js";

import m4 from "../../utils/m4-utils.js";

import angle from "../../utils/angle-utils.js";

import { createProgram } from "../../utils/webgl-utils.js";

import vertexShader from "../../shaders/vertex.js";

import fragmentShader from "../../shaders/fragment.js";

export default class Crocodile extends Model {
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
        buffer: gl.createBuffer(),
        size: 4,
      };
  
      this.vColor = {
        scope: "attribute",
        location: gl.getAttribLocation(this.program, "vColor"),
        value: [],
        buffer: gl.createBuffer(),
        size: 4,
      };

      this.TORSO_ID = 0;
      this.MOUTH_TOP_ID = 1;
      this.EYE_LEFT_ID = 2;
      this.EYE_RIGHT_ID = 3;
      this.MOUTH_BTN_ID = 4;
      this.TAIL_ID = 5;

      // this.HEAD2_ID = 11;
      this.LEFT_FRONT_LEG_ID = 6;
      this.LEFT_FRONT_FOOT_ID = 7;
      this.RIGHT_FRONT_LEG_ID = 8;
      this.RIGHT_FRONT_FOOT_ID = 9;
      this.LEFT_BACK_LEG_ID = 10;
      this.LEFT_BACK_FOOT_ID = 11;
      this.RIGHT_BACK_LEG_ID = 12;
      this.RIGHT_BACK_FOOT_ID = 13;

      //
      this.GLOBAL_ANGLE_ID = 14;
      this.GLOBAL_X_COORDINATE = 15;
      this.GLOBAL_Y_COORDINATE = 16;

    this.anglesSet = [90, 0, 0, 0, 0 ,0, 110, -20, 110, -20, 110, -20, 110, -20, -90, 0, 0];


      this.torsoHeight = 20.0;
      this.torsoWidth = 4.0;

      this.upperArmHeight = 2.2;
      this.lowerArmHeight = 1.3;
      this.upperLegHeight = 2.2;
      this.lowerLegHeight = 1.3;

      this.upperArmWidth = 1.8;
      this.lowerArmWidth = 4.2;
      this.upperLegWidth = 1.8;
      this.lowerLegWidth = 4.2;

      this.headHeight = .0;
      this.headWidth = 1.5;

      this.mouthTopHeight = 10;
      this.mouthTopWidth = 2.5;

      this.mouthBtnHeight = 9.7;
      this.mouthBtnWidth = 1.5;

      this.eyeHeight = 2;
      this.eyeWidth = 2;

      this.tailHeight = 14;
      this.tailWidth = 0.9 * this.torsoWidth;

      this.numNodes = 14;
      this.numAngles = 12;

      this.frameOn = 0;
      this.theta = [90, 0, 0, 0, 0 ,0, 110, -20, 110, -20, 110, -20, 110, -20, -90, 0, 0];

      this.knownLastIndex = 1;
      this.numVertices = 24;
      this.stack = [];
      this.figure = [];

      // for (let i = 0; i < numNodes; i++) figure[i] = createNode(null, null, null, null);

      this.vBuffer;
      this.modelViewLoc;
      this.pointsArray = [];
      this.stepParam = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

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
          0.46, 0.7, 0.0, 1,
          0.2, 0.3, 0.0, 1.0, 
          0.2, 0.3, 0.0, 1.0, 
          0.2, 0.3, 0.0, 1.0 
        ];
      
      this.init();
    }

    init(){
      this.initShape();
      this.initTorso();
      this.initMouth_Top();

    }
    render(){
      this.updateVars();
      this.traverse(this.TORSO_ID);
  
    }
  
    setProjectionMatrix(matrixArr){ 
      this.projectionMatrix.value = matrixArr;
      this.gl.useProgram(this.program);
      this.updateUniform(this.projectionMatrix);
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
      let m = m4.rotation(angle.degToRad(this.anglesSet[this.GLOBAL_ANGLE_ID]), 'z');
      let x = m4.rotation(angle.degToRad(this.anglesSet[this.TORSO_ID]), 'y');
      m = m4.multiply(m, x);
      this.components[this.TORSO_ID] = 
        Model.createNode(
            m, 
            () => this.renderTorso(), 
            null, 
            this.MOUTH_TOP_ID
          );
    }

    initMouth_Top(){
      let m = m4.new();
      m = m4.translate(m, 0.0, this.torsoHeight + this.mouthTopHeight, -1.2);
      m = m4.rotate(m, angle.degToRad(this.anglesSet[this.MOUTH_TOP_ID]), 'x');   
      m =  m4.translate(m, 0.0, -1 * this.mouthTopHeight, 0.0);  

      this.components[this.MOUTH_TOP_ID] = 
      Model.createNode(
          m, 
          () => this.renderMouth_up(), 
          null,  
          null
        );
    }
    

    renderTorso() {
      const { gl, modelViewMatrix } = this;
      this.updateVars();

      let instanceMatrix = m4.translate(modelViewMatrix.value, 0.0, 0.5 * this.torsoHeight, 0.0);     
      instanceMatrix = m4.scale(instanceMatrix, this.torsoWidth, this.torsoHeight, this.torsoWidth+ 1.5);

      modelViewMatrix.value = instanceMatrix;
      this.updateUniform(modelViewMatrix);
      
      for (let i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    }
    
    renderMouth_up() {
      const { gl, modelViewMatrix } = this;
      this.updateVars();
      console.log("haii ini rendermouth");

      let instanceMatrix = m4.translate(modelViewMatrix.value, 0.0, 0.5 * this.mouthTopHeight, 0.0);     
      instanceMatrix = m4.scale(instanceMatrix, this.mouthTopWidth, this.mouthTopHeight, this.mouthTopWidth);
      
      modelViewMatrix.value = instanceMatrix;
      this.updateUniform(modelViewMatrix);
  
      for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    }
    
    // eyeLeft() {
    //   let instanceMatrix = multiply(modelViewMatrix, translate(0.0, 0.5 * eyeHeight, 0.0));
    //   instanceMatrix = multiply(instanceMatrix, scale4(eyeWidth, eyeHeight, eyeWidth));
    //   gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    //   for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    // }
    
    // eyeRight() {
    //   let instanceMatrix = multiply(modelViewMatrix, translate(0.0, 0.5 * eyeHeight, 0.0));
    //   instanceMatrix = multiply(instanceMatrix, scale4(eyeWidth, eyeHeight, eyeWidth));
    //   gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    //   for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    // }
    
    // mouth_down() {
    //   let instanceMatrix = multiply(modelViewMatrix, translate(0.0, 0.5 * mouthBtnHeight, 0.0));
    //   instanceMatrix = multiply(instanceMatrix, scale4(mouthBtnWidth, mouthBtnHeight, mouthBtnWidth));
    //   gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    //   for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    // }
    
    // tail() {
       
    //   instanceMatrix = multiply(modelViewMatrix, translate(0.0, 0.5 * tailHeight, 0.0));
    //   instanceMatrix = multiply(instanceMatrix, scale4(tailWidth, tailHeight, tailWidth));
    //   gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    //   for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    // }
    
    // leftUpperArm() {
    
    //   instanceMatrix = multiply(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0));
    //   instanceMatrix = multiply(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth));
    //   gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    //   for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    // }
    
    // leftLowerArm() {
    
    //   instanceMatrix = multiply(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0));
    //   instanceMatrix = multiply(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth));
    //   gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    //   for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    // }
    
    // rightUpperArm() {
    
    //   instanceMatrix = multiply(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0));
    //   instanceMatrix = multiply(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth));
    //   gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    //   for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    // }
    
    // rightLowerArm() {
    
    //   instanceMatrix = multiply(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0));
    //   instanceMatrix = multiply(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth));
    //   gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    //   for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    // }
    
    // leftUpperLeg() {
    
    //   instanceMatrix = multiply(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0));
    //   instanceMatrix = multiply(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth));
    //   gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    //   for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    // }
    
    // leftLowerLeg() {
    
    //   instanceMatrix = multiply(modelViewMatrix, translate(0.0, 0.5 * lowerLegHeight, 0.0));
    //   instanceMatrix = multiply(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth));
    //   gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    //   for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    // }
    
    // rightUpperLeg() {
    
    //   instanceMatrix = multiply(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0));
    //   instanceMatrix = multiply(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth));
    //   gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    //   for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    // }
    
    // rightLowerLeg() {
    
    //   instanceMatrix = multiply(modelViewMatrix, translate(0.0, 0.5 * lowerLegHeight, 0.0));
    //   instanceMatrix = multiply(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth))
    //   gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    //   for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    // }

    makeQuadSurface(a, b, c, d) {
      a *= 4; b *= 4; c *= 4; d *= 4;
      // console.log(this.vPosition.value);
  
      this.vPosition.value.push(...this.verticesSet.slice(a, a+4));
      this.vPosition.value.push(...this.verticesSet.slice(b, b+4));
      this.vPosition.value.push(...this.verticesSet.slice(c, c+4));
      this.vPosition.value.push(...this.verticesSet.slice(d, d+4));
  
      // console.log(this.vPosition.value);
    }

    initShape() {
      this.makeQuadSurface(1, 0, 3, 2);
      this.vColor.value.push(...this.colorsSet.slice(12, 16));
      this.vColor.value.push(...this.colorsSet.slice(12, 16));
      this.vColor.value.push(...this.colorsSet.slice(0, 4));
      this.vColor.value.push(...this.colorsSet.slice(0, 4));
      this.makeQuadSurface(2, 3, 7, 6);
      this.vColor.value.push(...this.colorsSet.slice(12, 16));
      this.vColor.value.push(...this.colorsSet.slice(12, 16));
      this.vColor.value.push(...this.colorsSet.slice(0, 4));
      this.vColor.value.push(...this.colorsSet.slice(0, 4));
      this.makeQuadSurface(3, 0, 4, 7);
      this.vColor.value.push(...this.colorsSet.slice(0, 4));
      this.vColor.value.push(...this.colorsSet.slice(0, 4));
      this.vColor.value.push(...this.colorsSet.slice(12, 16));
      this.vColor.value.push(...this.colorsSet.slice(12, 16));
      this.makeQuadSurface(6, 5, 1, 2);
      this.vColor.value.push(...this.colorsSet.slice(8, 12));
      this.vColor.value.push(...this.colorsSet.slice(8, 12));
      this.vColor.value.push(...this.colorsSet.slice(8, 12));
      this.vColor.value.push(...this.colorsSet.slice(8, 12));
      this.makeQuadSurface(4, 5, 6, 7);
      this.vColor.value.push(...this.colorsSet.slice(4, 8));
      this.vColor.value.push(...this.colorsSet.slice(4, 8));
      this.vColor.value.push(...this.colorsSet.slice(4, 8));
      this.vColor.value.push(...this.colorsSet.slice(4, 8));
      this.makeQuadSurface(5, 4, 0, 1);
      this.vColor.value.push(...this.colorsSet.slice(12, 16));
      this.vColor.value.push(...this.colorsSet.slice(12, 16));
      this.vColor.value.push(...this.colorsSet.slice(0, 4));
      this.vColor.value.push(...this.colorsSet.slice(12, 16));
    }

}