import vector from "../utils/vector-utils.js";

const m4 = {
  id: (i, j) => {
    return i * 4 + j;
  },
  new: () => {
    const newMat = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (i == j) newMat.push(1);
        else newMat.push(0);
      }
    }
    return newMat;
  },
  copy: (mat) => {
    const newMat = [];
    mat.forEach(el => {
      newMat.push(el);
    });
    return newMat;
  },
  transpose: (mat) => {
    const ret = m4.new();
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        ret[m4.id(i, j)] = mat[m4.id(j, i)];
      }
    }
    return ret;
  },
  multiply: (a, b) => {
    const c = m4.new();
    const [tA, tB] = [a, b];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        let acc = 0;
        for (let k = 0; k < 4; k++) {
          acc += tA[m4.id(i, k)] * tB[m4.id(k, j)];
        }
        c[m4.id(i, j)] = acc;
      }
    }
    return c;
  },
  inverse: (m) => {
    let m00 = m[0 * 4 + 0];
    let m01 = m[0 * 4 + 1];
    let m02 = m[0 * 4 + 2];
    let m03 = m[0 * 4 + 3];
    let m10 = m[1 * 4 + 0];
    let m11 = m[1 * 4 + 1];
    let m12 = m[1 * 4 + 2];
    let m13 = m[1 * 4 + 3];
    let m20 = m[2 * 4 + 0];
    let m21 = m[2 * 4 + 1];
    let m22 = m[2 * 4 + 2];
    let m23 = m[2 * 4 + 3];
    let m30 = m[3 * 4 + 0];
    let m31 = m[3 * 4 + 1];
    let m32 = m[3 * 4 + 2];
    let m33 = m[3 * 4 + 3];
    let tmp_0 = m22 * m33;
    let tmp_1 = m32 * m23;
    let tmp_2 = m12 * m33;
    let tmp_3 = m32 * m13;
    let tmp_4 = m12 * m23;
    let tmp_5 = m22 * m13;
    let tmp_6 = m02 * m33;
    let tmp_7 = m32 * m03;
    let tmp_8 = m02 * m23;
    let tmp_9 = m22 * m03;
    let tmp_10 = m02 * m13;
    let tmp_11 = m12 * m03;
    let tmp_12 = m20 * m31;
    let tmp_13 = m30 * m21;
    let tmp_14 = m10 * m31;
    let tmp_15 = m30 * m11;
    let tmp_16 = m10 * m21;
    let tmp_17 = m20 * m11;
    let tmp_18 = m00 * m31;
    let tmp_19 = m30 * m01;
    let tmp_20 = m00 * m21;
    let tmp_21 = m20 * m01;
    let tmp_22 = m00 * m11;
    let tmp_23 = m10 * m01;

    let t0 =
      tmp_0 * m11 +
      tmp_3 * m21 +
      tmp_4 * m31 -
      (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
    let t1 =
      tmp_1 * m01 +
      tmp_6 * m21 +
      tmp_9 * m31 -
      (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
    let t2 =
      tmp_2 * m01 +
      tmp_7 * m11 +
      tmp_10 * m31 -
      (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
    let t3 =
      tmp_5 * m01 +
      tmp_8 * m11 +
      tmp_11 * m21 -
      (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

    let d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

    return [
      d * t0,
      d * t1,
      d * t2,
      d * t3,
      d *
      (tmp_1 * m10 +
        tmp_2 * m20 +
        tmp_5 * m30 -
        (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
      d *
      (tmp_0 * m00 +
        tmp_7 * m20 +
        tmp_8 * m30 -
        (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
      d *
      (tmp_3 * m00 +
        tmp_6 * m10 +
        tmp_11 * m30 -
        (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
      d *
      (tmp_4 * m00 +
        tmp_9 * m10 +
        tmp_10 * m20 -
        (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
      d *
      (tmp_12 * m13 +
        tmp_15 * m23 +
        tmp_16 * m33 -
        (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
      d *
      (tmp_13 * m03 +
        tmp_18 * m23 +
        tmp_21 * m33 -
        (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
      d *
      (tmp_14 * m03 +
        tmp_19 * m13 +
        tmp_22 * m33 -
        (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
      d *
      (tmp_17 * m03 +
        tmp_20 * m13 +
        tmp_23 * m23 -
        (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
      d *
      (tmp_14 * m22 +
        tmp_17 * m32 +
        tmp_13 * m12 -
        (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
      d *
      (tmp_20 * m32 +
        tmp_12 * m02 +
        tmp_19 * m22 -
        (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
      d *
      (tmp_18 * m12 +
        tmp_23 * m32 +
        tmp_15 * m02 -
        (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
      d *
      (tmp_22 * m22 +
        tmp_16 * m02 +
        tmp_21 * m12 -
        (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02)),
    ];
  },
  translation: (tx, ty, tz) => {
    return [
      1, 0, 0, tx,
      0, 1, 0, ty,
      0, 0, 1, tz,
      0, 0, 0, 1
    ];

  },
  rotation: (angleInRadians, sign) => {
    let x = 0, y = 0, z = 0;
    if (sign === "x") x = 1;
    else if (sign === "y") y = 1;
    else if (sign === "z") z = 1;

    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);
    const omc = 1.0 - c;

    return [
      x * x * omc + c, x * y * omc - z * s, x * z * omc + y * s, 0.0,
      x * y * omc + z * s, y * y * omc + c, y * z * omc - x * s, 0.0,
      x * z * omc - y * s, y * z * omc + x * s, z * z * omc + c, 0.0,
      0, 0, 0, 1
    ];
  },
  scaling: function (sx, sy, sz) {
    return [
      sx, 0, 0, 0,
      0, sy, 0, 0,
      0, 0, sz, 0,
      0, 0, 0, 1
    ];
  },
  translate: function (m, tx, ty, tz) {
    return m4.multiply(m, m4.translation(tx, ty, tz));
  },
  rotate: (m, angleInRadian, sign) => {
    return m4.multiply(m, m4.rotation(angleInRadian, sign));
  },
  scale: (m, sx, sy, sz) => {
    return m4.multiply(m, m4.scaling(sx, sy, sz));
  },
  orthographic: (
    left,
    right,
    bottom,
    top,
    near,
    far
  ) => {
    // prettier-ignore
    return [
      2 / (right - left), 0, 0, 0,
      0, 2 / (top - bottom), 0, 0,
      0, 0, 2 / (near - far), 0,

      (left + right) / (left - right), (bottom + top) / (bottom - top), (near + far) / (near - far), 1
    ]
  },
  oblique: (theta, phi) => {
    // prettier-ignore
    return m4.transpose([
      1, 0, 1 / Math.tan(theta), 0,
      0, 1, 1 / Math.tan(phi), 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ])
  },
  perspective: (fov, aspect, near, far) => {
    const f = Math.tan(Math.PI * 0.5 - 0.5 * fov);
    const rangeInv = 1.0 / (near - far);

    return [
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (near + far) * rangeInv, -1,
      0, 0, near * far * rangeInv * 2, 0
    ];
  }
}

export default m4;