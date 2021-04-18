import m4 from "../../utils/m4-utils.js";

import angle from "../../utils/angle-utils.js";

// import vector from "../../utils/vector-utils.js";

import { createProgram } from "../../utils/webgl-utils.js";

import { zebraVS } from "../../shaders/vertex.js";

import { zebraFS } from "../../shaders/fragment.js";

import Model from "./model.js";
export default class Zebra extends Model {
  constructor(canvas, gl, image=document.getElementById("texImage")){
    super(canvas, gl);

    this.program = createProgram(this.gl, zebraVS, zebraFS);

    this.modelViewMatrix = {
      scope: "uniform",
      location: gl.getUniformLocation(this.program, "uModelViewMatrix"),
      value: m4.new(),
      type: "mat4",
    };

    this.projectionMatrix = {
      scope: "uniform",
      location: gl.getUniformLocation(this.program, "uProjectionMatrix"),
      value: m4.new(),
      type: "mat4",
    };

    this.normalMatrix = {
      scope: "uniform",
      location: gl.getUniformLocation(this.program, "uNormalMatrix"),
      value: m4.new(),
      type: "mat4",
    };

    this.enableTextureAndShading = {
      scope: "uniform",
      location: gl.getUniformLocation(this.program, "enableTextureAndShading"),
      value: true,
      type: "bool",
    };

    this.sampler2D = {
      scope: "uniform",
      location: gl.getUniformLocation(this.program, "uSampler"),
      value: undefined,
      type: "texture",
    };


    this.vPosition = {
      scope: "attribute",
      buffer: gl.createBuffer(),
      location: gl.getAttribLocation(this.program, "aVertexPosition"),
      value: [],
      buffer: gl.createBuffer(),
      size: 4,
    };

    this.vColor = {
      scope: "attribute",
      location: gl.getAttribLocation(this.program, "aVertexColor"),
      value: [],
      buffer: gl.createBuffer(),
      size: 4,
    };

    this.vNormal = {
      scope: "attribute",
      location: gl.getAttribLocation(this.program, "aVertexNormal"),
      value: [],
      buffer: gl.createBuffer(),
      size: 3,
    };

    this.vTextureCoord = {
      scope: "attribute",
      location: gl.getAttribLocation(this.program, "aTextureCoord"),
      value: [],
      buffer: gl.createBuffer(),
      size: 2,
    };

    this.vIndex = {
      scope: "index",
      value: [],
      buffer: gl.createBuffer(),
    };

    this.currentFrameIndex = 1;

    this.imageTexture = image;

    this.TEXTURE_PATH = "./static/img/zebra-skin.jpg";
    // this.TEXTURE_PATH = "./static/img/cubetexture.png";

    this.texture = this.gl.createTexture();

    // Components ID
    this.TORSO_ID = 0;
    this.NECK_ID = 1;
    this.HEAD_ID = 2;
    this.HEAD2_ID = 11;
    this.LEFT_FRONT_LEG_ID = 3;
    this.LEFT_FRONT_FOOT_ID = 4;
    this.RIGHT_FRONT_LEG_ID = 5;
    this.RIGHT_FRONT_FOOT_ID = 6;
    this.LEFT_BACK_LEG_ID = 7;
    this.LEFT_BACK_FOOT_ID = 8;
    this.RIGHT_BACK_LEG_ID = 9;
    this.RIGHT_BACK_FOOT_ID = 10;

    this.GLOBAL_ANGLE_ID = 12;
    this.GLOBAL_X_COORDINATE = 13;
    this.GLOBAL_Y_COORDINATE = 14;

    // Components Orientation
    this.anglesSet = [90, 120, 90, 70, 10, 80, 10, 90, 40, 70, 30, 0, -90, 0, 0];

    this.componentScale = 1;

    // Components Size
    this.torsoHeight = 10.0 * this.componentScale;
    this.torsoWidth = 3.0 * this.componentScale;
    this.upperArmHeight = 5.0 * this.componentScale;
    this.lowerArmHeight = 2.0 * this.componentScale;
    this.upperArmWidth = 1.3 * this.componentScale;
    this.lowerArmWidth = 0.8 * this.componentScale;
    this.upperLegWidth = 1.3 * this.componentScale;
    this.lowerLegWidth = 0.8 * this.componentScale;
    this.lowerLegHeight = 2.0 * this.componentScale;
    this.upperLegHeight = 5.0 * this.componentScale;
    this.headHeight = 3.5 * this.componentScale;
    this.headWidth = 1.5 * this.componentScale;
    this.neckHeight = 4.0 * this.componentScale;
    this.neckWidth = 2.0 * this.componentScale;

    // this.numNodes = 11;
    // this.numAngles = 11;
    // this.numVertices = 24;

    // this.texCoord = [
    //   [0, 0],
    //   [0, 1],
    //   [1, 1],
    //   [1, 0]
    // ];
    
    // this.vertices = [
    //   [-0.5, -0.5,  0.5, 1.0 ],
    //   [-0.5,  0.5,  0.5, 1.0 ],
    //   [0.5,  0.5,  0.5, 1.0 ],
    //   [0.5, -0.5,  0.5, 1.0 ],
    //   [-0.5, -0.5, -0.5, 1.0 ],
    //   [-0.5,  0.5, -0.5, 1.0 ],
    //   [0.5,  0.5, -0.5, 1.0 ],
    //   [0.5, -0.5, -0.5, 1.0 ]
    // ];
    
    // this.vertexColors = [
    //   [0.0, 0.0, 0.0, 1.0 ],  // black
    //   [1.0, 0.0, 0.0, 1.0 ],  // red
    //   [1.0, 1.0, 0.0, 1.0 ],  // yellow
    //   [0.0, 1.0, 0.0, 1.0 ],  // green
    //   [0.0, 0.0, 1.0, 1.0 ],  // blue
    //   [1.0, 0.0, 1.0, 1.0 ],  // magenta
    //   [0.0, 1.0, 1.0, 1.0 ],  // white
    //   [0.0, 1.0, 1.0, 1.0 ]  // cyan
    // ];

    this.init();
  }

  init(){
    this.initBaseShape();

    // this.loadTexture();
    // this.configureTexture();

    this.updateVars();

    this.initTorso();
    this.initNeck();
    this.initHead();

  }

  render(){
    this.updateVars();

    this.traverse(this.TORSO_ID);
  }

  updateVars() {
    this.gl.useProgram(this.program);

    this.updateBuffer(this.projectionMatrix);
    this.updateBuffer(this.modelViewMatrix);
    this.updateBuffer(this.normalMatrix);
    this.updateBuffer(this.enableTextureAndShading);

    this.updateBuffer(this.vPosition);
    this.updateBuffer(this.vColor);
    this.updateBuffer(this.vIndex);
    this.updateBuffer(this.vTextureCoord);

    this.loadTexture();
  }

  setProjectionMatrix(matrixArr){ 
    this.projectionMatrix.value = matrixArr;
    this.gl.useProgram(this.program);
    this.updateUniform(this.projectionMatrix);
  }

  setImageTexture(image){
    this.imageTexture = image;

  }

  loadTexture() {
    const isPowerOf2 = (value) => {
      return (value & (value - 1)) == 0;
    }

    const { gl, texture, sampler2D, imageTexture } = this;

    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([50, 100, 255, 255]);  // opaque blue

    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                  width, height, border, srcFormat, srcType,
                  pixel);

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                  srcFormat, srcType, imageTexture);

    if (isPowerOf2(imageTexture.width) && isPowerOf2(imageTexture.height)) {
      gl.generateMipmap(gl.TEXTURE_2D);

    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }

    gl.activeTexture(gl.TEXTURE0);

    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.uniform1i(sampler2D.location, 0);
  
  }

  generateTexture(){
    const { gl, program, sampler2D } = this;
    const image = document.getElementById("texImage");
    console.log(image);

    function load(){
      const texture = gl.createTexture();
      gl.bindTexture( gl.TEXTURE_2D, texture );
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB,
          gl.RGB, gl.UNSIGNED_BYTE, image );
      gl.generateMipmap( gl.TEXTURE_2D );
      gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                        gl.NEAREST_MIPMAP_LINEAR );
      gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

      // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

      gl.uniform1i(sampler2D.location, 0);
      // gl.uniform1i(gl.getUniformLocation(program, "uSampler"), 0);

    }

    // image.onload = load;

    load();
  }

  draw(instanceMatrix){
    const { gl, texture, modelViewMatrix, normalMatrix, sampler2D } = this;

    const temp = modelViewMatrix.value;

    modelViewMatrix.value = instanceMatrix;
    normalMatrix.value = m4.inverse(instanceMatrix);

    this.updateUniform(modelViewMatrix);
    this.updateUniform(normalMatrix);

    // this.loadTexture();
    // this.generateTexture();

    const vertexCount = 36;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;

    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    // for (let i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);

    modelViewMatrix.value = temp;
  }

  initTorso(){
    let m = m4.rotation(angle.degToRad(this.anglesSet[this.GLOBAL_ANGLE_ID]), 'z');

    m = m4.rotate(m, angle.degToRad(this.anglesSet[this.TORSO_ID]), 'y');

    this.components[this.TORSO_ID] = 
      Model.createNode(
          m, 
          () => this.renderTorso(), 
          null, 
          this.NECK_ID
        );
  }

  initNeck() {
    let m = m4.translation(0.0, this.torsoHeight - this.neckHeight + 3.5, 0.0);
    m = m4.rotate(m, angle.degToRad(this.anglesSet[this.NECK_ID]), 'x');
    m = m4.rotate(m, angle.degToRad(this.anglesSet[this.HEAD2_ID]), 'y');
    m = m4.translate(m, 0.0, -1 * this.neckHeight, 0.0);

    this.components[this.NECK_ID] = 
      Model.createNode(
          m, 
          () => this.renderNeck(), 
          null, // TODO: ganti 
          this.HEAD_ID
        );
  }

  initHead() {
    let m = m4.translation(0.0, 0.2 * this.headHeight, 0.0);
    m = m4.rotate(m, angle.degToRad(this.anglesSet[this.HEAD_ID]), 'x');
    m = m4.translate(m, 0.0, -0.8 * this.headHeight, 0.0);

    this.components[this.HEAD_ID] = 
      Model.createNode(
          m, 
          () => this.renderHead(), 
          null, 
          null
        );
  }
  
  initLeftUpperArm() {

  }
  
  initLeftLowerArm() {

  }

  renderTorso() {
    const { modelViewMatrix } = this;

    this.updateVars();

    let instanceMatrix = m4.translate(modelViewMatrix.value, 0.0, 0.5 * this.torsoHeight, 0.0);
    
    instanceMatrix = m4.scale(instanceMatrix, this.torsoWidth, this.torsoHeight, this.torsoWidth);
    // instanceMatrix = m4.scale(instanceMatrix, this.torsoHeight, this.torsoHeight, this.torsoHeight/2);

    this.draw(instanceMatrix);
  }
  
  renderNeck() {
    const { modelViewMatrix } = this;

    this.updateVars();

    let instanceMatrix = m4.translate(modelViewMatrix.value, 0.0, 0.5 * this.neckHeight, 0.0);
    instanceMatrix = m4.scale(instanceMatrix, this.neckWidth, this.neckHeight, this.neckWidth);

    this.draw(instanceMatrix);
  }

  renderHead() {
    const { modelViewMatrix } = this;

    this.updateVars();

    let instanceMatrix = m4.translate(modelViewMatrix.value, 0.0, 0.5 * this.headHeight, 0.0);
    instanceMatrix = m4.scale(instanceMatrix, this.headWidth, this.headHeight, this.headWidth);

    this.draw(instanceMatrix);
  }
  
  renderLeftUpperArm() {
    const { gl } = this;

    let instanceMatrix = m4.translate(this.modelViewMatrix.value, 0.0, 0.5 * this.upperArmHeight, 0.0);
    instanceMatrix = m4.scale(instanceMatrix, this.upperArmWidth, this.upperArmHeight, this.upperArmWidth);
  
    this.updateVars();

    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
  
  renderLeftLowerArm() {
    const { gl } = this;

    let instanceMatrix = m4.translate(this.modelViewMatrix.value, 0.0, 0.5 * this.lowerArmHeight, 0.0);
    instanceMatrix = m4.scale(instanceMatrix, this.lowerArmWidth, this.lowerArmHeight, this.lowerArmkWidth);

    this.updateVars();

    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
  
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

  initBaseShape(){
    // this.vPosition.value = [
    //   -0.5, 0.5, 0.5, 1,
    //   -0.5, -0.5, 0.5, 1,
    //   0.5, -0.5, 0.5, 1,
    //   0.5, 0.5, 0.5, 1,

    //   0.5, 0.5, 0.5, 1,
    //   0.5, -0.5, 0.5, 1,
    //   0.5, -0.5, -0.5, 1,
    //   0.5, 0.5, -0.5, 1,

    //   0.5, -0.5, 0.5, 1,
    //   -0.5, -0.5, 0.5, 1,
    //   -0.5, -0.5, -0.5, 1,
    //   0.5, -0.5, -0.5, 1,

    //   0.5, 0.5, -0.5, 1,
    //   -0.5, 0.5, -0.5, 1,
    //   -0.5, 0.5, 0.5, 1,
    //   0.5, 0.5, 0.5, 1,

    //   -0.5, -0.5, -0.5, 1,
    //   -0.5, 0.5, -0.5, 1,
    //   0.5, 0.5, -0.5, 1,
    //   0.5, -0.5, -0.5, 1,

    //   -0.5, 0.5, -0.5, 1,
    //   -0.5, -0.5, -0.5, 1,
    //   -0.5, -0.5, 0.5, 1,
    //   -0.5, 0.5, 0.5, 1
    // ];

    this.vPosition.value = [
      // Front face
      -0.5, -0.5, 0.5, 1,
      0.5, -0.5, 0.5, 1,
      0.5, 0.5, 0.5, 1,
      -0.5, 0.5, 0.5, 1,
  
      // Back face
      -0.5, -0.5, -0.5, 1,
      -0.5, 0.5, -0.5, 1,
      0.5, 0.5, -0.5, 1,
      0.5, -0.5, -0.5, 1,
  
      // Top face
      -0.5, 0.5, -0.5, 1,
      -0.5, 0.5, 0.5, 1,
      0.5, 0.5, 0.5, 1,
      0.5, 0.5, -0.5, 1,
  
      // Bottom face
      -0.5, -0.5, -0.5, 1,
      0.5, -0.5, -0.5, 1,
      0.5, -0.5, 0.5, 1,
      -0.5, -0.5, 0.5, 1,
  
      // Right face
      0.5, -0.5, -0.5, 1,
      0.5, 0.5, -0.5, 1,
      0.5, 0.5, 0.5, 1,
      0.5, -0.5, 0.5, 1,
  
      // Left face
      -0.5, -0.5, -0.5, 1,
      -0.5, -0.5, 0.5, 1,
      -0.5, 0.5, 0.5, 1,
      -0.5, 0.5, -0.5, 1,
    ];

    this.vNormal.value = [
      // Front
      0.0,  0.0,  1.0,
      0.0,  0.0,  1.0,
      0.0,  0.0,  1.0,
      0.0,  0.0,  1.0,

      // Back
      0.0,  0.0, -1.0,
      0.0,  0.0, -1.0,
      0.0,  0.0, -1.0,
      0.0,  0.0, -1.0,

      // Top
      0.0,  1.0,  0.0,
      0.0,  1.0,  0.0,
      0.0,  1.0,  0.0,
      0.0,  1.0,  0.0,

      // Bottom
      0.0, -1.0,  0.0,
      0.0, -1.0,  0.0,
      0.0, -1.0,  0.0,
      0.0, -1.0,  0.0,

      // Right
      1.0,  0.0,  0.0,
      1.0,  0.0,  0.0,
      1.0,  0.0,  0.0,
      1.0,  0.0,  0.0,
  
      // Left
      -1.0,  0.0,  0.0,
      -1.0,  0.0,  0.0,
      -1.0,  0.0,  0.0,
      -1.0,  0.0,  0.0
    ];

    this.vTextureCoord.value = [
      // Front
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
      // Back
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
      // Top
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
      // Bottom
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
      // Right
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
      // Left
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
    ];

    this.vIndex.value = [
      0,  1,  2,      0,  2,  3,    // front
      4,  5,  6,      4,  6,  7,    // back
      8,  9,  10,     8,  10, 11,   // top
      12, 13, 14,     12, 14, 15,   // bottom
      16, 17, 18,     16, 18, 19,   // right
      20, 21, 22,     20, 22, 23,   // left
    ];

    this.vColor.value = [
      0.5, 0.25, 0.14, 1,
      0.5, 0.25, 0.14, 1,
      0.6, 0.32, 0.17, 1,
      0.6, 0.32, 0.17, 1,

      0.5, 0.25, 0.14, 1,
      0.5, 0.25, 0.14, 1,
      0.6, 0.32, 0.17, 1,
      0.6, 0.32, 0.17, 1,

      0.6, 0.32, 0.17, 1,
      0.6, 0.32, 0.17, 1,
      0.5, 0.25, 0.14, 1,
      0.5, 0.25, 0.14, 1,

      0.5, 0.3, 0.1, 1,
      0.5, 0.3, 0.1, 1,
      0.5, 0.3, 0.1, 1,
      0.5, 0.3, 0.1, 1,

      0.7, 0.3, 0, 1,
      0.7, 0.3, 0, 1,
      0.7, 0.3, 0, 1,
      0.7, 0.3, 0, 1,

      0.5, 0.25, 0.14, 1,
      0.5, 0.25, 0.14, 1,
      0.6, 0.32, 0.17, 1,
      0.5, 0.25, 0.14, 1,
    ];

  }

  // quad(a, b, c, d) {
  //   const { vColor, vPosition, vTextureCoord,
  //       vertices, vertexColors, texCoord } = this;

  //   vPosition.value.push(...vertices[a]);
  //   vColor.value.push(...vertexColors[a]);
  //   vTextureCoord.value.push(...texCoord[0]);

  //   vPosition.value.push(...vertices[b]);
  //   vColor.value.push(...vertexColors[a]);
  //   vTextureCoord.value.push(...texCoord[1]);

  //   vPosition.value.push(...vertices[c]);
  //   vColor.value.push(...vertexColors[a]);
  //   vTextureCoord.value.push(...texCoord[2]);

  //   vPosition.value.push(...vertices[a]);
  //   vColor.value.push(...vertexColors[a]);
  //   vTextureCoord.value.push(...texCoord[0]);

  //   vPosition.value.push(...vertices[c]);
  //   vColor.value.push(...vertexColors[a]);
  //   vTextureCoord.value.push(...texCoord[2]);

  //   vPosition.value.push(...vertices[d]);
  //   vColor.value.push(...vertexColors[a]);
  //   vTextureCoord.value.push(...texCoord[3]);
  // }


  // initShape(){
  //   this.quad( 1, 0, 3, 2 );
  //   this.quad( 2, 3, 7, 6 );
  //   this.quad( 3, 0, 4, 7 );
  //   this.quad( 6, 5, 1, 2 );
  //   this.quad( 4, 5, 6, 7 );
  //   this.quad( 5, 4, 0, 1 );
  // }
}