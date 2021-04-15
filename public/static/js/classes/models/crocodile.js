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

      this.colorsSet = [
          0.46, 0.7, 0.0, 1,
          0.2, 0.3, 0.0, 1.0, 
          0.2, 0.3, 0.0, 1.0, 
          0.2, 0.3, 0.0, 1.0 
        ];
      
      this.init();
    }

    

    traverse(Id) {
      if (Id == null) return;
    
      stack.push(modelViewMatrix);
      modelViewMatrix = multiply(modelViewMatrix, figure[Id].transform);
      figure[Id].render();
      if (figure[Id].child != null) traverse(figure[Id].child);
      modelViewMatrix = stack.pop();
      if (figure[Id].sibling != null) traverse(figure[Id].sibling);
    }

    torso() {

      let instanceMatrix = multiply(modelViewMatrix, translate(0, 0.5 * torsoHeight, 0.0));
      instanceMatrix = multiply(instanceMatrix, scale4(torsoWidth, torsoHeight, torsoWidth + 1.5));
      gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
      for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    }
    
    mouth_up() {
      let instanceMatrix = multiply(modelViewMatrix, translate(0.0, 0.5 * mouthTopHeight, 0.0));
      instanceMatrix = multiply(instanceMatrix, scale4(mouthTopWidth, mouthTopHeight, mouthTopWidth));
      gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
      for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    }
    
    eyeLeft() {
      let instanceMatrix = multiply(modelViewMatrix, translate(0.0, 0.5 * eyeHeight, 0.0));
      instanceMatrix = multiply(instanceMatrix, scale4(eyeWidth, eyeHeight, eyeWidth));
      gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
      for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    }
    
    eyeRight() {
      let instanceMatrix = multiply(modelViewMatrix, translate(0.0, 0.5 * eyeHeight, 0.0));
      instanceMatrix = multiply(instanceMatrix, scale4(eyeWidth, eyeHeight, eyeWidth));
      gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
      for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    }
    
    mouth_down() {
      let instanceMatrix = multiply(modelViewMatrix, translate(0.0, 0.5 * mouthBtnHeight, 0.0));
      instanceMatrix = multiply(instanceMatrix, scale4(mouthBtnWidth, mouthBtnHeight, mouthBtnWidth));
      gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
      for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    }
    
    tail() {
       
      instanceMatrix = multiply(modelViewMatrix, translate(0.0, 0.5 * tailHeight, 0.0));
      instanceMatrix = multiply(instanceMatrix, scale4(tailWidth, tailHeight, tailWidth));
      gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
      for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    }
    
    leftUpperArm() {
    
      instanceMatrix = multiply(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0));
      instanceMatrix = multiply(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth));
      gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
      for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    }
    
    leftLowerArm() {
    
      instanceMatrix = multiply(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0));
      instanceMatrix = multiply(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth));
      gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
      for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    }
    
    rightUpperArm() {
    
      instanceMatrix = multiply(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0));
      instanceMatrix = multiply(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth));
      gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
      for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    }
    
    rightLowerArm() {
    
      instanceMatrix = multiply(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0));
      instanceMatrix = multiply(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth));
      gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
      for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    }
    
    leftUpperLeg() {
    
      instanceMatrix = multiply(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0));
      instanceMatrix = multiply(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth));
      gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
      for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    }
    
    leftLowerLeg() {
    
      instanceMatrix = multiply(modelViewMatrix, translate(0.0, 0.5 * lowerLegHeight, 0.0));
      instanceMatrix = multiply(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth));
      gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
      for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    }
    
    rightUpperLeg() {
    
      instanceMatrix = multiply(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0));
      instanceMatrix = multiply(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth));
      gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
      for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    }
    
    rightLowerLeg() {
    
      instanceMatrix = multiply(modelViewMatrix, translate(0.0, 0.5 * lowerLegHeight, 0.0));
      instanceMatrix = multiply(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth))
      gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
      for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    }

    initAll() {
      initNodes(TORSO_ID);
      initNodes(MOUTH_TOP_ID);
      initNodes(EYE_LEFT_ID);
      initNodes(EYE_RIGHT_ID);
      initNodes(MOUTH_BTN_ID);
      initNodes(TAIL_ID);
      initNodes(LEFT_FRONT_LEG_ID);
      initNodes(LEFT_FRONT_FOOT_ID);
      initNodes(RIGHT_FRONT_LEG_ID);
      initNodes(RIGHT_FRONT_FOOT_ID);
      initNodes(LEFT_BACK_LEG_ID);
      initNodes(LEFT_BACK_FOOT_ID);
      initNodes(RIGHT_BACK_LEG_ID);
      initNodes(RIGHT_BACK_FOOT_ID);
      
    }

}