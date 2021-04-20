import Model from "./model.js";

import m4 from "../../utils/m4-utils.js";

import angle from "../../utils/angle-utils.js";

import { createProgram } from "../../utils/webgl-utils.js";

import { minecraftVS } from "../../shaders/vertex.js";

import { minecraftFS } from "../../shaders/fragment.js";

export default class Minecraft extends Model {

    // CONSTRUCTOR
    constructor(canvas, gl) {
        super(canvas, gl);

        this.program = createProgram(this.gl, minecraftVS, minecraftFS);

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

        this.enableTextureAndShading = {
            scope: "uniform",
            location: gl.getUniformLocation(this.program, "enableTextureAndShading"),
            value: true,
            type: "bool",
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
            buffer: gl.createBuffer(),
            size: 4,
        };

        this.vTang = {
            scope: "attribute",
            location: gl.getAttribLocation(this.program, "vTang"),
            value: [],
            buffer: gl.createBuffer(),
            size: 3,
        };

        this.vBitang = {
            scope: "attribute",
            location: gl.getAttribLocation(this.program, "vBitang"),
            value: [],
            buffer: gl.createBuffer(),
            size: 3,
        };

        this.vTexCoord = {
            scope: "attribute",
            location: gl.getAttribLocation(this.program, "vTexCoord"),
            value: [],
            buffer: gl.createBuffer(),
            size: 2,
        };

        this.texNorm = {
            scope: "uniform",
            location: gl.getUniformLocation(this.program, "texNorm"),
            value: undefined,
            type: "texture",
        };

        this.vIndex = {
            scope: "index",
            value: [],
            buffer: gl.createBuffer(),
        };

        this.texture = this.gl.createTexture();
        this.bumpTexture = document.getElementById("texBump");

        this.TORSO_ID = 0;
        this.HEAD = 1;
        this.ARM_LEFT = 2;
        this.ARM_RIGHT = 3;
        this.LEG_LEFT = 4;
        this.LEG_RIGHT = 5;

        this.anglesSet = [
            { x: 0, y: 90, z: -90, tx: -15, ty: -15, tz: 0 },
            { x: 0, y: 0, z: -30 },
            { x: 0, y: -90 }, { x: 0, y: 90 },
            { x: 0, y: 90 }, { x: 0, y: -90 },
        ];

        this.speed = {
            head: 1.5,
            torso: 0.5,
            arm: 5,
            leg: -5
        }

        this.init();
    }

    // IMPORTANT FUNCTION

    init() {
        this.initShape();
        this.initTexture();

        this.initTorso();
        this.initHead();
        this.initArmLeft();
        this.initArmRight();
        this.initLegLeft();
        this.initLegRight();
    }
    render() {
        this.updateVars();
        this.traverse(this.TORSO_ID);
    }

    setProjectionMatrix(matrixArr) {
        this.projectionMatrix.value = matrixArr;
        this.gl.useProgram(this.program);
        this.updateUniform(this.projectionMatrix);
    }

    setTextureAndShading(status) {
        this.enableTextureAndShading.value = status;
        this.updateUniform(this.enableTextureAndShading);
    }

    setImageTexture(image) {
        this.bumpTexture = image;
    }

    initTexture() {
        const { gl, texture, texNorm, bumpTexture } = this
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            new Uint8Array([255, 0, 0, 255])); // red

        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bumpTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        texNorm.value = texture;
    }

    loadTexture() {
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texNorm.value);
        this.gl.uniform1i(this.texNorm.location, 0);
    }

    updateVars() {
        this.gl.useProgram(this.program);

        this.normalMatrix.value = m4.transpose(m4.inverse(this.modelViewMatrix.value))

        this.updateBuffer(this.projectionMatrix);
        this.updateBuffer(this.modelViewMatrix);
        this.updateBuffer(this.normalMatrix);
        this.updateBuffer(this.enableTextureAndShading);

        this.updateBuffer(this.vPosition);
        this.updateBuffer(this.vColor);
        this.updateBuffer(this.vIndex);
        this.updateBuffer(this.vTang);
        this.updateBuffer(this.vBitang);
        this.updateBuffer(this.vTexCoord);

        this.loadTexture();
    }
    draw(instanceMatrix) {
        const { gl, modelViewMatrix } = this;

        const temp = modelViewMatrix.value;

        modelViewMatrix.value = instanceMatrix;
        this.updateUniform(modelViewMatrix);

        for (let i = 0; i < 6; i++) gl.drawElements(gl.TRIANGLES, this.vIndex.value.length, gl.UNSIGNED_SHORT, 0);

        modelViewMatrix.value = temp;
    }

    // Example animation, tiap 36 frame bakal balik arah.
    // Frame selalu mulai dari 1
    animate(frame) {
        this.anglesSet[this.TORSO_ID]['y'] = this.anglesSet[this.TORSO_ID]['y'] + this.speed.torso
        this.anglesSet[this.TORSO_ID]['x'] = this.anglesSet[this.TORSO_ID]['x'] + this.speed.torso
        // this.anglesSet[this.TORSO_ID]['z'] = this.anglesSet[this.TORSO_ID]['z'] + this.speed.torso * -1
        this.initTorso()
        this.anglesSet[this.HEAD]['z'] = this.anglesSet[this.HEAD]['z'] + this.speed.head
        this.initHead()
        this.anglesSet[this.ARM_LEFT]['y'] = this.anglesSet[this.ARM_LEFT]['y'] + this.speed.arm
        this.initArmLeft()
        this.anglesSet[this.ARM_RIGHT]['y'] = this.anglesSet[this.ARM_RIGHT]['y'] + this.speed.arm * -1
        this.initArmRight()
        this.anglesSet[this.LEG_LEFT]['y'] = this.anglesSet[this.LEG_LEFT]['y'] + this.speed.leg
        this.initLegLeft()
        this.anglesSet[this.LEG_RIGHT]['y'] = this.anglesSet[this.LEG_RIGHT]['y'] + this.speed.leg * -1
        this.initLegRight()
        if (frame % 36 == 0) {
            this.speed.head *= -1
            this.speed.arm *= -1
            this.speed.leg *= -1
        }
    }

    //INIT FUNCTION

    initTorso() {
        let m = m4.translation(this.anglesSet[this.TORSO_ID]['tx'], this.anglesSet[this.TORSO_ID]['ty'], this.anglesSet[this.TORSO_ID]['tz'])
        m = m4.rotate(m, angle.degToRad(this.anglesSet[this.TORSO_ID]['z']), 'z');
        m = m4.rotate(m, angle.degToRad(this.anglesSet[this.TORSO_ID]['y']), 'y');
        m = m4.rotate(m, angle.degToRad(this.anglesSet[this.TORSO_ID]['x']), 'x');

        this.components[this.TORSO_ID] =
            Model.createNode(
                m,
                () => this.renderTorso(),
                null,
                this.HEAD,
                true
            );
    }

    initHead() {
        let m = m4.translation(0.0, 0.0, -6.5);
        m = m4.rotate(m, angle.degToRad(this.anglesSet[this.HEAD]['y']), 'y');
        m = m4.rotate(m, angle.degToRad(this.anglesSet[this.HEAD]['x']), 'x');
        m = m4.rotate(m, angle.degToRad(this.anglesSet[this.HEAD]['z']), 'z');

        this.components[this.HEAD] =
            Model.createNode(
                m,
                () => this.renderHead(),
                this.ARM_LEFT,
                null
            );
    }

    initArmLeft() {
        let m = m4.translation(0.0, -7, -5);
        m = m4.rotate(m, angle.degToRad(this.anglesSet[this.ARM_LEFT]['y']), 'y');
        m = m4.rotate(m, angle.degToRad(this.anglesSet[this.ARM_LEFT]['x']), 'x');

        this.components[this.ARM_LEFT] =
            Model.createNode(
                m,
                () => this.renderArmLeft(),
                this.ARM_RIGHT,
                null
            );
    }

    initArmRight() {
        let m = m4.translation(0.0, 7, -5);
        m = m4.rotate(m, angle.degToRad(this.anglesSet[this.ARM_RIGHT]['y']), 'y');
        m = m4.rotate(m, angle.degToRad(this.anglesSet[this.ARM_RIGHT]['x']), 'x');

        this.components[this.ARM_RIGHT] =
            Model.createNode(
                m,
                () => this.renderArmRight(),
                this.LEG_LEFT,
                null
            );
    }

    initLegLeft() {
        let m = m4.translation(0.0, -2.5, 9 - 4);
        m = m4.rotate(m, angle.degToRad(this.anglesSet[this.LEG_LEFT]['y']), 'y');
        m = m4.rotate(m, angle.degToRad(this.anglesSet[this.LEG_LEFT]['x']), 'x');

        this.components[this.LEG_LEFT] =
            Model.createNode(
                m,
                () => this.renderLegLeft(),
                this.LEG_RIGHT,
                null
            );
    }

    initLegRight() {
        let m = m4.translation(0.0, 2.5, 9 - 4);
        m = m4.rotate(m, angle.degToRad(this.anglesSet[this.LEG_RIGHT]['y']), 'y');
        m = m4.rotate(m, angle.degToRad(this.anglesSet[this.LEG_RIGHT]['x']), 'x');

        this.components[this.LEG_RIGHT] =
            Model.createNode(
                m,
                () => this.renderLegRight(),
                null,
                null
            );
    }

    // RENDER FUNCTION

    renderTorso() {
        const { modelViewMatrix } = this;
        this.updateVars();
        let instanceMatrix = m4.translate(modelViewMatrix.value, 0.0, 0.0, 0.0);
        instanceMatrix = m4.scale(instanceMatrix, 3, 10, 10)
        this.draw(instanceMatrix);
    }

    renderHead() {
        const { modelViewMatrix } = this;
        this.updateVars();
        let instanceMatrix = m4.translate(modelViewMatrix.value, 0.0, 0.0, 0.0);
        instanceMatrix = m4.scale(instanceMatrix, 3, 5, 3)
        this.draw(instanceMatrix);
    }

    renderArmLeft() {
        const { modelViewMatrix } = this;
        this.updateVars();
        let instanceMatrix = m4.translate(modelViewMatrix.value, 0.0, 0.0, 5.0);
        instanceMatrix = m4.scale(instanceMatrix, 3, 4, 6)
        this.draw(instanceMatrix);
    }

    renderArmRight() {
        const { modelViewMatrix } = this;
        this.updateVars();
        let instanceMatrix = m4.translate(modelViewMatrix.value, 0.0, 0.0, 5.0);
        instanceMatrix = m4.scale(instanceMatrix, 3, 4, 6)
        this.draw(instanceMatrix);
    }

    renderLegLeft() {
        const { modelViewMatrix } = this;
        this.updateVars();
        let instanceMatrix = m4.translate(modelViewMatrix.value, 0.0, 0.0, 4.0);
        instanceMatrix = m4.scale(instanceMatrix, 3, 4, 8)
        this.draw(instanceMatrix);
    }

    renderLegRight() {
        const { modelViewMatrix } = this;
        this.updateVars();
        let instanceMatrix = m4.translate(modelViewMatrix.value, 0.0, 0.0, 4.0);
        instanceMatrix = m4.scale(instanceMatrix, 3, 4, 8)
        this.draw(instanceMatrix);
    }

    initShape() {
        this.vPosition.value = [
            -0.5, -0.5,  0.5,  1,    0.5,  0.5,  0.5,  1,   -0.5,  0.5,  0.5,  1,    0.5, -0.5,  0.5,  1, // Front
            -0.5, -0.5, -0.5,  1,    0.5,  0.5, -0.5,  1,   -0.5,  0.5, -0.5,  1,    0.5, -0.5, -0.5,  1, // Back
             0.5, -0.5, -0.5,  1,    0.5,  0.5,  0.5,  1,    0.5, -0.5,  0.5,  1,    0.5,  0.5, -0.5,  1, // Right
            -0.5, -0.5, -0.5,  1,   -0.5,  0.5,  0.5,  1,   -0.5, -0.5,  0.5,  1,   -0.5,  0.5, -0.5,  1, // Left
            -0.5,  0.5, -0.5,  1,    0.5,  0.5,  0.5,  1,   -0.5,  0.5,  0.5,  1,    0.5,  0.5, -0.5,  1, // Top
            -0.5, -0.5, -0.5,  1,    0.5, -0.5,  0.5,  1,   -0.5, -0.5,  0.5,  1,    0.5, -0.5, -0.5,  1, // Bottom
        ];

        this.vTang.value = [
            1,  0,  0,    1,  0,  0,    1,  0,  0,    1,  0,  0, // Front
           -1,  0,  0,   -1,  0,  0,   -1,  0,  0,   -1,  0,  0, // Back
            0,  0, -1,    0,  0, -1,    0,  0, -1,    0,  0, -1, // Right
            0,  0,  1,    0,  0,  1,    0,  0,  1,    0,  0,  1, // Left
            1,  0,  0,    1,  0,  0,    1,  0,  0,    1,  0,  0, // Top
            1,  0,  0,    1,  0,  0,    1,  0,  0,    1,  0,  0, // Bottom
        ];

        this.vBitang.value = [
            0, -1,  0,    0, -1,  0,    0, -1,  0,    0, -1,  0, // Front
            0, -1,  0,    0, -1,  0,    0, -1,  0,    0, -1,  0, // Back
            0, -1,  0,    0, -1,  0,    0, -1,  0,    0, -1,  0, // Right
            0, -1,  0,    0, -1,  0,    0, -1,  0,    0, -1,  0, // Left
            0,  0,  1,    0,  0,  1,    0,  0,  1,    0,  0,  1, // Top
            0,  0, -1,    0,  0, -1,    0,  0, -1,    0,  0, -1, // Bot
        ];

        this.vTexCoord.value = [
            0,  1,  1,  0,  0,  0,  1,  1, // Front
            1,  1,  0,  0,  1,  0,  0,  1, // Back
            1,  1,  0,  0,  0,  1,  1,  0, // Right
            0,  1,  1,  0,  1,  1,  0,  0, // Left
            0,  0,  1,  1,  0,  1,  1,  0, // Top
            0,  1,  1,  0,  0,  0,  1,  1, // Bottom
        ];
      
      
        this.vIndex.value = [
            0 , 1 , 2 ,    0 , 3 , 1 , // Front
            4 , 6 , 5 ,    4 , 5 , 7 , // Back
            8 , 9 , 10,    8 , 11, 9 , // Right
            12, 14, 13,    12, 13, 15, // Left
            16, 18, 17,    16, 17, 19, // Top
            20, 21, 22,    20, 23, 21, // Bottom
        ];
      
        this.vColor.value = [
            0.25, 0.14, 0.5, 1,   0.25, 0.14, 0.5, 1,   0.32, 0.17, 0.6, 1,   0.32, 0.17, 0.6, 1, // Front
            0.25, 0.14, 0.5, 1,   0.25, 0.14, 0.5, 1,   0.32, 0.17, 0.6, 1,   0.32, 0.17, 0.6, 1, // Back
            0.3 , 0   , 0.7, 1,   0.3 , 0   , 0.7, 1,   0.3 , 0   , 0.7, 1,   0.3 , 0   , 0.7, 1, // Right
            0.25, 0.14, 0.5, 1,   0.25, 0.14, 0.5, 1,   0.32, 0.17, 0.6, 1,   0.25, 0.14, 0.5, 1, // Left
            0.32, 0.17, 0.6, 1,   0.32, 0.17, 0.6, 1,   0.25, 0.14, 0.5, 1,   0.25, 0.14, 0.5, 1, // Top
            0.3 , 0.1 , 0.5, 1,   0.3 , 0.1 , 0.5, 1,   0.3 , 0.1 , 0.5, 1,   0.3 , 0.1 , 0.5, 1, // Bottom
        ];
    }

}