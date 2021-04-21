const vector = {
  multiply: (
    x1, y1, z1,
    x2, y2, z2,
  ) => {
    return {
      x: y1 * z2 - y2 * z1,
      y: z1 * x2 - z2 * x1,
      z: x1 * y2 - x2 * y1
    };
  },
  subtract: (
    x1, y1, z1,
    x2, y2, z2,
  ) => {
    return {
      x: x1 - x2,
      y: y1 - y2,
      z: z1 - z2
    };
  },
  normal: (
    x1, y1, z1,
    x2, y2, z2,
    x3, y3, z3,
  ) => {
    const vec1 = {
      x: x2 - x1,
      y: y2 - y1,
      z: z2 - z1
    }

    const vec2 = {
      x: x3 - x2,
      y: y3 - y2,
      z: z3 - z2
    }

    const vec3 = vector.multiply(
      vec1.x, vec1.y, vec1.z,
      vec2.x, vec2.y, vec2.z
    );

    const length = Math.sqrt(
      Math.pow(vec3.x, 2) +
      Math.pow(vec3.y, 2) +
      Math.pow(vec3.z, 2)
    );

    return {
      x: vec3.x / length,
      y: vec3.y / length,
      z: vec3.z / length,
    }
  },
  normal1v: (x, y, z) => {
    const length = Math.sqrt(
      Math.pow(x, 2) +
      Math.pow(y, 2) +
      Math.pow(z, 2)
    );
    if (length > 0.00001) {
      return {x: x / length, y: y / length, z: z / length};
    } else {
      return {x: 0, y: 0, z: 0};
    }
  },
  lookAt: (camPos, target, up) => {
    let x, y, z;
    ({x, y, z} = vector.subtract(
        camPos.x, camPos.y, camPos.z,
        target.x, target.y, target.z
    ));
    let zAxis = vector.normal1v(x, y, z);
    ({x, y, z} = vector.multiply(
        up.x, up.y, up.z,
        zAxis.x, zAxis.y, zAxis.z
    ));
    let xAxis = vector.normal1v(x, y, z);
    ({x, y, z} = vector.multiply(
        zAxis.x, zAxis.y, zAxis.z,
        xAxis.x, xAxis.y, xAxis.z
    ));
    let yAxis = vector.normal1v(x, y, z);

    return [
        xAxis.x, xAxis.y, xAxis.z, 0,
        yAxis.x, yAxis.y, yAxis.z, 0,
        zAxis.x, zAxis.y, zAxis.z, 0,
        camPos.x,
        camPos.y,
        camPos.z,
        1,
    ];
}
}

export default vector;