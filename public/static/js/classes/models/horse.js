import Model from "./model";

export default class Horse extends Model {
  constructor(canvas, gl){
    super(canvas, gl);

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
}