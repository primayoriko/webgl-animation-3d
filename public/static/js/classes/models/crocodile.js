import Model from "./model.js";
import m4 from "../../utils/m4-utils.js";
import v3 from "../../utils/vec3-utils.js";
import angle from "../../utils/angle-utils.js";
import { createProgram } from "../../utils/webgl-utils.js";
import { defaultVS, crocodileVS } from "../../shaders/vertex.js";
import { defaultFS, crocodileFS } from "../../shaders/fragment.js";
export default class Crocodile extends Model {

    // CONSTRUCTOR
    constructor(canvas, gl){
      super(canvas, gl);

      this.program = createProgram(this.gl, crocodileVS, crocodileFS);
  
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

      this.normalMatrix = {
        scope: "uniform",
        location: gl.getUniformLocation(this.program, "normalMatrix"),
        value: m4.new(),
        type: "mat4",
      };

      // this.enableTextureAndShading = {
      //   scope: "uniform",
      //   location: gl.getUniformLocation(this.program, "enableTextureAndShading"),
      //   value: true,
      //   type: "bool",
      // };

      this.textureLocation = {
        scope: "uniform",
        location: gl.getUniformLocation(this.program, "u_texture"),
        value: [],
        type: "samplerCube",
      };

      this.worldLocation = {
        scope: "uniform",
        location: gl.getUniformLocation(this.program, "u_world"),
        value: m4.new(),
        type: "mat4",
      };

      this.worldCameraPositionLocation = {
        scope: "uniform",
        location: gl.getUniformLocation(this.program, "u_worldCameraPosition"),
        value: v3.new(),
        type: "vec3",
      };
  
      this.vPosition = {
        scope: "attribute",
        location: gl.getAttribLocation(this.program, "aVertexPosition"),
        value: [],
        buffer: gl.createBuffer(),
        size: 3,
      };
  
      // this.vColor = {
      //   scope: "attribute",
      //   location: gl.getAttribLocation(this.program, "aVertexColor"),
      //   value: [],
      //   buffer: gl.createBuffer(),
      //   size: 4,
      // };

      this.vNormal = {
        scope: "attribute",
        location: gl.getAttribLocation(this.program, "aVertexNormal"),
        value: [],
        buffer: gl.createBuffer(),
        size: 3,
      };

      // this.vTextureCoord = {
      //   scope: "attribute",
      //   location: gl.getAttribLocation(this.program, "aTextureCoord"),
      //   value: [],
      //   buffer: gl.createBuffer(),
      //   size: 2,
      // };
  
      // this.vIndex = {
      //   scope: "index",
      //   value: [],
      //   buffer: gl.createBuffer(),
      // };

      

      this.texture = this.gl.createTexture();

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


      this.torsoHeight = 27.0;
      this.torsoWidth = 3.0;

      this.upperArmWidth = 1.6;
      this.lowerArmWidth = 6.0;
      this.upperLegWidth = 1.6;
      this.lowerLegWidth = 6.0;

      this.upperArmHeight = 3.0;
      this.lowerArmHeight = this.upperArmWidth-0.2;
      this.upperLegHeight = 3.0;
      this.lowerLegHeight = this.upperLegWidth-0.2;

      this.headHeight = .0;
      this.headWidth = 1.5;

      this.mouthTopHeight = 12;
      this.mouthTopWidth = 1.9;

      this.mouthWidth = 5;

      this.mouthBtnHeight = 11;
      this.mouthBtnWidth = 1.3;

      this.eyeHeight = 2.5;
      this.eyeWidth = 2.5;

      this.tailHeight = 16;
      this.tailWidth = this.torsoWidth;

      this.numNodes = 14;
      this.numAngles = 12;

      this.frameOn = 0;
      this.theta = [90, 0, 0, 0, 0 ,0, 110, -20, 110, -20, 110, -20, 110, -20, -90, 0, 0];

      this.speed = {
        head: 1.5,
        leg: 1,
        tail:3,
        mouth:1,
        torso:0.5

    }

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
          0.46, 0.7, 0.8, 1,
          0.2, 0.3, 0.0, 1.0, 
          0.2, 0.3, 0.0, 1.0, 
          0.2, 0.3, 0.0, 1.0 
        ];
      
      this.init();
    }
    animate(frame) {
      this.anglesSet[this.TORSO_ID] = this.anglesSet[this.TORSO_ID] + this.speed.torso
      this.initTorso()
      this.anglesSet[this.MOUTH_TOP_ID] = this.anglesSet[this.MOUTH_TOP_ID] - this.speed.mouth
      this.initMouth_Top()

      this.anglesSet[this.LEFT_BACK_LEG_ID] = this.anglesSet[this.LEFT_BACK_LEG_ID] - this.speed.leg
      this.initLeftBack_Leg()
      this.anglesSet[this.RIGHT_FRONT_LEG_ID] = this.anglesSet[this.RIGHT_FRONT_LEG_ID] - this.speed.leg
      this.initRightFront_Leg()

      this.anglesSet[this.LEFT_BACK_FOOT_ID] = this.anglesSet[this.LEFT_BACK_FOOT_ID] + this.speed.leg
      this.initLeftBack_foot()
      this.anglesSet[this.RIGHT_FRONT_FOOT_ID] = this.anglesSet[this.RIGHT_FRONT_FOOT_ID] + this.speed.leg
      this.initRightFront_foot()

      this.anglesSet[this.RIGHT_BACK_LEG_ID] = this.anglesSet[this.RIGHT_BACK_LEG_ID] - this.speed.leg *-1
      this.initRightBack_Leg()
      this.anglesSet[this.LEFT_FRONT_LEG_ID] = this.anglesSet[this.LEFT_FRONT_LEG_ID] - this.speed.leg *-1
      this.initLeftFront_Leg()

      this.anglesSet[this.RIGHT_BACK_FOOT_ID] = this.anglesSet[this.RIGHT_BACK_FOOT_ID] + this.speed.leg 
      this.initRightBack_foot()
      this.anglesSet[this.LEFT_FRONT_FOOT_ID] = this.anglesSet[this.LEFT_FRONT_FOOT_ID] + this.speed.leg 
      this.initLeftFront_foot()

      this.anglesSet[this.TAIL_ID] = this.anglesSet[this.TAIL_ID] - this.speed.tail
      this.initTail()

      if (frame % 36 == 0) {
          this.speed.mouth *= -1
          this.speed.tail *= -1
          this.speed.leg *= -1
      }
      if (frame % 72 == 0) {
        this.speed.tail *= -1
    }
  }

    loadTexture(){
      // Create a texture.
      const { gl, texture, textureLocation  } = this;
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
      const faceInfos = [
        {
          target: gl.TEXTURE_CUBE_MAP_POSITIVE_X, 
          url: '../static/img/pos-x.jpg',
        },
        {
          target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 
          url: '../static/img/neg-x.jpg',
        },
        {
          target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 
          url: '../static/img/pos-y.jpg',
        },
        {
          target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 
          url: '../static/img/neg-y.jpg',
        },
        {
          target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 
          url: '../static/img/pos-z.jpg',
        },
        {
          target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 
          url: '../static/img/neg-z.jpg',
        },
      ];

      faceInfos.forEach((faceInfo) => {
        const {target, url} = faceInfo;
       
        // Upload the canvas to the cubemap face.
        const level = 0;
        const internalFormat = gl.RGBA;
        const width = 512;
        const height = 512;
        const format = gl.RGBA;
        const type = gl.UNSIGNED_BYTE;
       
        // setup each face so it's immediately renderable
        gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null);
       
        // Asynchronously load an image
        const image = new Image();
        image.src = url;
        image.addEventListener('load', function() {
          // Now that the image has loaded upload it to the texture.
          gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
          gl.texImage2D(target, level, internalFormat, format, type, image);
          gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        });
      });

      gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
      gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

      var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;

      var _projectionMatrix = m4.perspective(60*Math.PI / 180, aspect, 1, 2000);
      // gl.uniformMatrix4fv(this.projectionMatrix.location, false, _projectionMatrix);
      this.projectionMatrix.value = _projectionMatrix;

      var cameraPosition = [0, 0, 2];
      // gl.uniform3fv(this.worldCameraPositionLocation.location, cameraPosition);


      var worldMatrix = m4.rotation(this.anglesSet[this.TORSO_ID]* Math.PI / 180, 'x');
      worldMatrix = m4.rotate(worldMatrix,this.anglesSet[this.TORSO_ID]* Math.PI / 180,'y');
      // gl.uniformMatrix4fv(this.worldLocation.location, false, worldMatrix);
      this.worldLocation.value = worldMatrix;
      
      // var cameraPosition = [0, 0, 2];
      var target = [0, 0, 0];
      var up = [0, 1, 0];
      // Compute the camera's matrix using look at.
      var cameraMatrix = m4.lookAt(cameraPosition, target, up);
      var viewMatrix = m4.inverse(cameraMatrix);
      // gl.uniformMatrix4fv(this.modelViewMatrix.location, false, viewMatrix);
      this.modelViewMatrix.value = viewMatrix;
      gl.uniform1i(this.textureLocation.location, 0);
      
    }



    // IMPORTANT FUNCTION

    init(){
      this.initShape();

      this.updateVars();

      this.initTorso();
      this.initMouth_Top();
      this.initEye_Left();
      this.initEye_Right();
      this.initMouth_Btn();
      this.initTail();
      this.initLeftFront_Leg();
      this.initRightFront_Leg();
      this.initLeftBack_Leg();
      this.initRightBack_Leg();
      this.initLeftFront_foot();
      this.initRightFront_foot();
      this.initLeftBack_foot();
      this.initRightBack_foot();

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
    setTextureAndShading(status) {
      this.enableTextureAndShading.value = status;
      this.gl.useProgram(this.program);
      this.updateUniform(this.enableTextureAndShading);
  
    }
  
    updateVars() {
      this.gl.useProgram(this.program);
  
      this.updateBuffer(this.projectionMatrix);
      this.updateBuffer(this.modelViewMatrix);
      // this.updateBuffer(this.enableTextureAndShading);
      this.updateBuffer(this.normalMatrix);
      this.updateBuffer(this.textureLocation);
      this.updateBuffer(this.worldLocation);
      this.updateBuffer(this.worldCameraPositionLocation);


      this.updateBuffer(this.vPosition);
      // this.updateBuffer(this.vColor);
      this.updateBuffer(this.vNormal);
      // this.updateBuffer(this.vIndex);
      // this.updateBuffer(this.vTextureCoord);
  
      this.loadTexture();

    }
    draw(instanceMatrix){
      const { gl, modelViewMatrix } = this;
  
      const temp = modelViewMatrix.value;
  
      modelViewMatrix.value = instanceMatrix;
      this.normalMatrix.value = m4.inverse(instanceMatrix);
  
      this.updateUniform(modelViewMatrix);
      this.updateUniform(this.normalMatrix);
  
      const vertexCount = 36;
      const type = gl.UNSIGNED_SHORT;
      const offset = 0;
  
      gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
      // modelViewMatrix.value = instanceMatrix;
      // this.updateUniform(modelViewMatrix);
  
      // for (let i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  
      modelViewMatrix.value = temp;
    }

    //INIT FUNCTION

    initTorso(){
      let m = m4.rotation(angle.degToRad(this.anglesSet[this.GLOBAL_ANGLE_ID]), 'z');
      m = m4.rotate(m, angle.degToRad(this.anglesSet[this.TORSO_ID]), 'y');

      this.components[this.TORSO_ID] = 
        Model.createNode(
            m, 
            () => this.renderTorso(), 
            null, 
            this.MOUTH_TOP_ID,
            true
          );
    }

    initMouth_Top(){
      let m = m4.translation( 0.0, this.torsoHeight, -0.8);
      m = m4.rotate(m, angle.degToRad(this.anglesSet[this.MOUTH_TOP_ID]), 'x');
      // m = m4.translate(m, 0.0, -1 * this.mouthTopHeight, 0.0);

      this.components[this.MOUTH_TOP_ID] = 
      Model.createNode(
          m, 
          () => this.renderMouth_up(), 
          this.MOUTH_BTN_ID,  
          this.EYE_LEFT_ID
        );
    }

    initEye_Left(){
      let m = m4.translation( 0.0, 0, - this.mouthTopWidth/2);
      m = m4.rotate(m, angle.degToRad(this.anglesSet[this.EYE_LEFT_ID]), 'y');

      this.components[this.EYE_LEFT_ID] = 
      Model.createNode(
          m, 
          () => this.renderEyeLeft(), 
          this.EYE_RIGHT_ID,  
          null
        );
    }

    initEye_Right(){
      let m = m4.translation( 0.0, 0, - this.mouthTopWidth/2);
      m = m4.rotate(m, angle.degToRad(this.anglesSet[this.EYE_RIGHT_ID]), 'x');

      this.components[this.EYE_RIGHT_ID] = 
      Model.createNode(
          m, 
          () => this.renderEyeRight(), 
          null,  
          null
        );
    }

    initMouth_Btn(){
      let m = m4.translation( 0.0, this.torsoHeight + this.mouthBtnHeight, 0.9);
      m = m4.rotate(m, angle.degToRad(this.anglesSet[this.MOUTH_BTN_ID]), 'x');
      m = m4.translate(m, 0.0, -1 * this.mouthBtnHeight, 0.0);

      this.components[this.MOUTH_BTN_ID] = 
      Model.createNode(
          m, 
          () => this.renderMouth_down(), 
          this.TAIL_ID,  
          null
        );
    }
    
    initTail(){
      let m = m4.translation( 0.0, 0, 0.0);
      m = m4.rotate(m, angle.degToRad(this.anglesSet[this.TAIL_ID]), 'z');
      m = m4.translate(m, 0.0, -1 * this.tailHeight, 0.0);


      this.components[this.TAIL_ID] = 
      Model.createNode(
          m, 
          () => this.renderTail(), 
          this.LEFT_FRONT_LEG_ID,  
          null
        );
    }
    initLeftFront_Leg(){
      let m = m4.translation( this.torsoWidth, 0.85 * this.torsoHeight, 1.8);
      m = m4.rotate(m, angle.degToRad(this.anglesSet[this.LEFT_FRONT_LEG_ID]), 'x');

      this.components[this.LEFT_FRONT_LEG_ID] = 
      Model.createNode(
          m, 
          () => this.renderLeftUpperArm(), 
          this.RIGHT_FRONT_LEG_ID,  
          this.LEFT_FRONT_FOOT_ID
        );
    }
    initRightFront_Leg(){
      let m = m4.translation( -this.torsoWidth , 0.85 * this.torsoHeight, 1.8);
      m = m4.rotate(m, angle.degToRad(this.anglesSet[this.RIGHT_FRONT_LEG_ID]), 'x');

      this.components[this.RIGHT_FRONT_LEG_ID] = 
      Model.createNode(
          m, 
          () => this.renderLeftUpperArm(), 
          this.LEFT_BACK_LEG_ID,  
          this.RIGHT_FRONT_FOOT_ID
        );
    }

    initLeftBack_Leg(){
      let m = m4.translation( this.torsoWidth, 1 * this.upperLegHeight, 1.8);
      m = m4.rotate(m, angle.degToRad(this.anglesSet[this.LEFT_BACK_LEG_ID]), 'x');

      this.components[this.LEFT_BACK_LEG_ID] = 
      Model.createNode(
          m, 
          () => this.renderLeftUpperLeg(), 
          this.RIGHT_BACK_LEG_ID,  
          this.LEFT_BACK_FOOT_ID
        );
    }

    initRightBack_Leg(){
      let m = m4.translation( -this.torsoWidth , 1 * this.upperLegHeight, 1.8);
      m = m4.rotate(m, angle.degToRad(this.anglesSet[this.RIGHT_BACK_LEG_ID]), 'x');

      this.components[this.RIGHT_BACK_LEG_ID] = 
      Model.createNode(
          m, 
          () => this.renderRightUpperLeg(), 
          null,  
          this.RIGHT_BACK_FOOT_ID
        );
    }

    initLeftFront_foot(){
      let m = m4.translation( 0.0, this.upperArmHeight-1.1, -1.7);
      m = m4.rotate(m, angle.degToRad(this.anglesSet[this.LEFT_FRONT_FOOT_ID]), 'x');

      this.components[this.LEFT_FRONT_FOOT_ID] = 
      Model.createNode(
          m, 
          () => this.renderLeftLowerArm(), 
          null,
          null
        );
    }
    initRightFront_foot(){
      let m = m4.translation( 0.0, this.upperArmHeight-1.1, -1.7);
      m = m4.rotate(m, angle.degToRad(this.anglesSet[this.RIGHT_FRONT_FOOT_ID]), 'x');

      this.components[this.RIGHT_FRONT_FOOT_ID] = 
      Model.createNode(
          m, 
          () => this.renderRightLowerArm(), 
          null,
          null
        );
    }

    initLeftBack_foot(){
      let m = m4.translation( 0.0, this.upperLegHeight-1.1, -1.7);
      m = m4.rotate(m, angle.degToRad(this.anglesSet[this.LEFT_BACK_FOOT_ID]), 'x');

      this.components[this.LEFT_BACK_FOOT_ID] = 
      Model.createNode(
          m, 
          () => this.renderLeftLowerLeg(), 
          null,
          null
        );
    }

    initRightBack_foot(){
      let m = m4.translation( 0.0, this.upperLegHeight-1.1, -1.7);
      m = m4.rotate(m, angle.degToRad(this.anglesSet[this.RIGHT_BACK_FOOT_ID]), 'x');

      this.components[this.RIGHT_BACK_FOOT_ID] = 
      Model.createNode(
          m, 
          () => this.renderRightLowerLeg(), 
          null,
          null
        );
    }
    
    // RENDER FUNCTION

    renderTorso() {
      const { modelViewMatrix } = this;
      this.updateVars();
      let instanceMatrix = m4.translate(modelViewMatrix.value, 0.0, 0.5 * this.torsoHeight, 0.0);
      instanceMatrix = m4.scale(instanceMatrix, this.torsoWidth+3, this.torsoHeight, this.torsoWidth+ 1.5);
      this.draw(instanceMatrix);
    }
    
    renderMouth_up() {
      const { modelViewMatrix } = this;
      this.updateVars();
      let instanceMatrix = m4.translate(modelViewMatrix.value, 0.0, 0.5 * this.mouthTopHeight, 0.0);     
      instanceMatrix = m4.scale(instanceMatrix, this.mouthWidth-1.5, this.mouthTopHeight, this.mouthTopWidth);
      this.draw(instanceMatrix);
    }
    
    renderEyeLeft() {
      const { modelViewMatrix } = this;
      this.updateVars();
      let instanceMatrix = m4.translate(modelViewMatrix.value, -this.mouthTopWidth+1, 1, -0.5);     
      instanceMatrix = m4.scale(instanceMatrix, this.eyeWidth/2, this.eyeWidth, this.eyeWidth/2);
      this.draw(instanceMatrix);
    }

    renderEyeRight() {
      const { modelViewMatrix } = this;
      this.updateVars();
      let instanceMatrix = m4.translate(modelViewMatrix.value, this.mouthTopWidth-1, 1, -0.5);     
      instanceMatrix = m4.scale(instanceMatrix, this.eyeWidth/2, this.eyeWidth, this.eyeWidth/2);
      this.draw(instanceMatrix);
    }
    
    renderMouth_down() {
      const { modelViewMatrix } = this;
      this.updateVars();
      let instanceMatrix = m4.translate(modelViewMatrix.value, 0.0, 0.5 * this.mouthBtnHeight, 0.0);     
      instanceMatrix = m4.scale(instanceMatrix, this.mouthWidth, this.mouthBtnHeight, this.mouthBtnWidth);
      this.draw(instanceMatrix);
    }

    renderTail() {
      const { modelViewMatrix } = this;
      this.updateVars();
      let instanceMatrix = m4.translate(modelViewMatrix.value, 0.0, 0.5 * this.tailHeight, 0.0);     
      instanceMatrix = m4.scale(instanceMatrix, this.tailWidth, this.tailHeight, this.tailWidth);
      this.draw(instanceMatrix);
    }
    
    renderLeftUpperArm() {
      const { modelViewMatrix } = this;
      this.updateVars();
      let instanceMatrix = m4.translate(modelViewMatrix.value, 0.0, 0.5 * this.upperArmHeight, 0.0);     
      instanceMatrix = m4.scale(instanceMatrix, this.upperArmWidth, this.upperArmHeight, this.upperArmWidth+0.5);
      this.draw(instanceMatrix);
    }

    renderRightUpperArm() {
      const { modelViewMatrix } = this;
      this.updateVars();
      let instanceMatrix = m4.translate(modelViewMatrix.value, 0, 0.5 * this.upperArmHeight, 0);     
      instanceMatrix = m4.scale(instanceMatrix, this.upperArmWidth, this.upperArmHeight, this.upperArmWidth+0.5);
      this.draw(instanceMatrix);
    }

        
    renderLeftUpperLeg() {
      const { modelViewMatrix } = this;
      this.updateVars();
      let instanceMatrix = m4.translate(modelViewMatrix.value, 0.0, 0.5 * this.upperLegHeight, 0.0);     
      instanceMatrix = m4.scale(instanceMatrix, this.upperLegWidth, this.upperLegHeight, this.upperLegWidth+0.5);
      this.draw(instanceMatrix);
    }
    
    renderRightUpperLeg() {
      const { modelViewMatrix } = this;
      this.updateVars();
      let instanceMatrix = m4.translate(modelViewMatrix.value, 0.0, 0.5 * this.upperLegHeight, 0.0);     
      instanceMatrix = m4.scale(instanceMatrix, this.upperLegWidth, this.upperLegHeight, this.upperLegWidth+0.5);
      this.draw(instanceMatrix);
    }
    
    renderLeftLowerArm() {
      const { modelViewMatrix } = this;
      this.updateVars();
      let instanceMatrix = m4.translate(modelViewMatrix.value, 0.0, 0.5 * this.lowerArmHeight, 0.0);     
      instanceMatrix = m4.scale(instanceMatrix, this.lowerArmHeight, this.lowerArmHeight, this.lowerArmWidth);
      this.draw(instanceMatrix);
    }
    
    renderRightLowerArm() {
      const { modelViewMatrix } = this;
      this.updateVars();
      let instanceMatrix = m4.translate(modelViewMatrix.value, 0.0, 0.5 * this.lowerArmHeight, 0.0);     
      instanceMatrix = m4.scale(instanceMatrix, this.lowerArmHeight, this.lowerArmHeight, this.lowerArmWidth);
      this.draw(instanceMatrix);
    }

    
    renderLeftLowerLeg() {
      const { modelViewMatrix } = this;
      this.updateVars();
      let instanceMatrix = m4.translate(modelViewMatrix.value, 0.0, 0.5 * this.lowerLegHeight, 0.0);     
      instanceMatrix = m4.scale(instanceMatrix, this.lowerLegHeight, this.lowerLegHeight, this.lowerLegWidth);
      this.draw(instanceMatrix);
    }
    
    renderRightLowerLeg() {
      const { modelViewMatrix } = this;
      this.updateVars();
      let instanceMatrix = m4.translate(modelViewMatrix.value, 0.0, 0.5 * this.lowerLegHeight, 0.0);     
      instanceMatrix = m4.scale(instanceMatrix, this.lowerLegHeight, this.lowerLegHeight, this.lowerLegWidth);
      this.draw(instanceMatrix);
    }

    // makeQuadSurface(a, b, c, d) {
    //   a *= 4; b *= 4; c *= 4; d *= 4;
    //   // console.log(this.vPosition.value);
    //   // let normal = normalize(cross(this.verticesSet.slice(b, b+4)-this.verticesSet.slice(a, a+4) , this.verticesSet.slice(c, c+4)-this.verticesSet.slice(b, b+4) ));
    //   // this.vNormal.value.push(normal);


    //   // var t1 = vector.subtract(this.verticesSet.slice(b, b+4), this.verticesSet.slice(a, a+4));
    //   // var t2 = vector.subtract(this.verticesSet.slice(c, c+4), this.verticesSet.slice(a, a+4));
    //   // var normal = vector.multiply(t1, t2);
    //   // this.vNormal.value.push(normal);


  
    //   this.vPosition.value.push(...this.verticesSet.slice(a, a+4));
    //   this.vPosition.value.push(...this.verticesSet.slice(b, b+4));
    //   this.vPosition.value.push(...this.verticesSet.slice(c, c+4));
    //   this.vPosition.value.push(...this.verticesSet.slice(d, d+4));
  
    //   // console.log(this.vPosition.value);
    // }

    initShape() {
      this.worldCameraPositionLocation.value = [0,0,2];
      
      this.vNormal.value = [
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,

        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,

        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,

        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,

        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,

        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
      ];
      
      
      this.vPosition.value = [
        -0.5, -0.5,  -0.5,
        -0.5,  0.5,  -0.5,
        0.5, -0.5,  -0.5,
        -0.5,  0.5,  -0.5,
        0.5,  0.5,  -0.5,
        0.5, -0.5,  -0.5,

        -0.5, -0.5,   0.5,
        0.5, -0.5,   0.5,
        -0.5,  0.5,   0.5,
        -0.5,  0.5,   0.5,
        0.5, -0.5,   0.5,
        0.5,  0.5,   0.5,

        -0.5,   0.5, -0.5,
        -0.5,   0.5,  0.5,
        0.5,   0.5, -0.5,
        -0.5,   0.5,  0.5,
        0.5,   0.5,  0.5,
        0.5,   0.5, -0.5,

        -0.5,  -0.5, -0.5,
        0.5,  -0.5, -0.5,
        -0.5,  -0.5,  0.5,
        -0.5,  -0.5,  0.5,
        0.5,  -0.5, -0.5,
        0.5,  -0.5,  0.5,

        -0.5,  -0.5, -0.5,
        -0.5,  -0.5,  0.5,
        -0.5,   0.5, -0.5,
        -0.5,  -0.5,  0.5,
        -0.5,   0.5,  0.5,
        -0.5,   0.5, -0.5,

        0.5,  -0.5, -0.5,
        0.5,   0.5, -0.5,
        0.5,  -0.5,  0.5,
        0.5,  -0.5,  0.5,
        0.5,   0.5, -0.5,
        0.5,   0.5,  0.5,
      ];
  
      // this.makeQuadSurface(1, 0, 3, 2);
      // this.vColor.value.push(...this.colorsSet.slice(12, 16));
      // this.vColor.value.push(...this.colorsSet.slice(12, 16));
      // this.vColor.value.push(...this.colorsSet.slice(0, 4));
      // this.vColor.value.push(...this.colorsSet.slice(0, 4));
      // this.makeQuadSurface(2, 3, 7, 6);
      // this.vColor.value.push(...this.colorsSet.slice(12, 16));
      // this.vColor.value.push(...this.colorsSet.slice(12, 16));
      // this.vColor.value.push(...this.colorsSet.slice(0, 4));
      // this.vColor.value.push(...this.colorsSet.slice(0, 4));
      // this.makeQuadSurface(3, 0, 4, 7);
      // this.vColor.value.push(...this.colorsSet.slice(0, 4));
      // this.vColor.value.push(...this.colorsSet.slice(0, 4));
      // this.vColor.value.push(...this.colorsSet.slice(12, 16));
      // this.vColor.value.push(...this.colorsSet.slice(12, 16));
      // this.makeQuadSurface(6, 5, 1, 2);
      // this.vColor.value.push(...this.colorsSet.slice(8, 12));
      // this.vColor.value.push(...this.colorsSet.slice(8, 12));
      // this.vColor.value.push(...this.colorsSet.slice(8, 12));
      // this.vColor.value.push(...this.colorsSet.slice(8, 12));
      // this.makeQuadSurface(4, 5, 6, 7);
      // this.vColor.value.push(...this.colorsSet.slice(4, 8));
      // this.vColor.value.push(...this.colorsSet.slice(4, 8));
      // this.vColor.value.push(...this.colorsSet.slice(4, 8));
      // this.vColor.value.push(...this.colorsSet.slice(4, 8));
      // this.makeQuadSurface(5, 4, 0, 1);
      // this.vColor.value.push(...this.colorsSet.slice(12, 16));
      // this.vColor.value.push(...this.colorsSet.slice(12, 16));
      // this.vColor.value.push(...this.colorsSet.slice(0, 4));
      // this.vColor.value.push(...this.colorsSet.slice(12, 16));
    
      // this.createTexture();
    }
    

}