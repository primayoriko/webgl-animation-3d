import Model from "./model.js";

import m4 from "../../utils/m4-utils.js";

import angle from "../../utils/angle-utils.js";

import { createProgram } from "../../utils/webgl-utils.js";

import { defaultVS } from "../../shaders/vertex.js";

import { defaultFS } from "../../shaders/fragment.js";

export default class Minecraft extends Model {

    // CONSTRUCTOR
    constructor(canvas, gl) {
        super(canvas, gl);

        this.program = createProgram(this.gl, defaultVS, defaultFS);

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
        this.HEAD = 1;
        this.ARM_LEFT = 2;
        this.ARM_RIGHT = 3;
        this.LEG_LEFT = 4;
        this.LEG_RIGHT = 5;

        this.anglesSet = [
            { x: 0, y: 90, z: -90 },
            { x: 0, y: 0, z: -30 },
            { x: 0, y: -90 }, { x: 0, y: 90 },
            { x: 0, y: -90 }, { x: 0, y: 90 },
        ];

        this.speed = {
            head: 1.5,
            torso: 0.5,
            arm: 5,
            leg: 5
        }

        this.theta = [90, 0, 0, 0, 0, 0, 110, -20, 110, -20, 110, -20, 110, -20, -90, 0, 0];

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

    // IMPORTANT FUNCTION

    init() {
        this.initShape();
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

    updateVars() {
        this.gl.useProgram(this.program);

        this.updateBuffer(this.projectionMatrix);
        this.updateBuffer(this.modelViewMatrix);

        this.updateBuffer(this.vPosition);
        this.updateBuffer(this.vColor);

        // this.updateBuffer(this.vNormal);
    }
    draw(instanceMatrix) {
        const { gl, modelViewMatrix } = this;

        const temp = modelViewMatrix.value;

        modelViewMatrix.value = instanceMatrix;
        this.updateUniform(modelViewMatrix);

        for (let i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);

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
        this.anglesSet[this.LEG_LEFT]['y'] = this.anglesSet[this.LEG_LEFT]['y'] + this.speed.arm
        this.initLegLeft()
        this.anglesSet[this.LEG_RIGHT]['y'] = this.anglesSet[this.LEG_RIGHT]['y'] + this.speed.arm * -1
        this.initLegRight()
        if (frame % 36 == 0) {
            this.speed.head *= -1
            this.speed.arm *= -1
            this.speed.leg *= -1
        }
    }

    //INIT FUNCTION

    initTorso() {
        let m = m4.rotation(angle.degToRad(this.anglesSet[this.TORSO_ID]['z']), 'z');
        m = m4.rotate(m, angle.degToRad(this.anglesSet[this.TORSO_ID]['y']), 'y');
        m = m4.rotate(m, angle.degToRad(this.anglesSet[this.TORSO_ID]['x']), 'x');

        this.components[this.TORSO_ID] =
            Model.createNode(
                m,
                () => this.renderTorso(),
                null,
                this.HEAD
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


    makeQuadSurface(a, b, c, d) {
        a *= 4; b *= 4; c *= 4; d *= 4;

        this.vPosition.value.push(...this.verticesSet.slice(a, a + 4));
        this.vPosition.value.push(...this.verticesSet.slice(b, b + 4));
        this.vPosition.value.push(...this.verticesSet.slice(c, c + 4));
        this.vPosition.value.push(...this.verticesSet.slice(d, d + 4));

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