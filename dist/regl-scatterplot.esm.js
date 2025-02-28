import createPubSub from 'pub-sub-es';
import createOriginalRegl from 'regl';

/**
 * Common utilities
 * @module glMatrix
 */
// Configuration Constants
var EPSILON = 0.000001;
var ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
if (!Math.hypot) Math.hypot = function () {
  var y = 0,
      i = arguments.length;

  while (i--) {
    y += arguments[i] * arguments[i];
  }

  return Math.sqrt(y);
};

/**
 * 4x4 Matrix<br>Format: column-major, when typed out it looks like row-major<br>The matrices are being post multiplied.
 * @module mat4
 */

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */

function create$2() {
  var out = new ARRAY_TYPE(16);

  if (ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
  }

  out[0] = 1;
  out[5] = 1;
  out[10] = 1;
  out[15] = 1;
  return out;
}
/**
 * Creates a new mat4 initialized with values from an existing matrix
 *
 * @param {ReadonlyMat4} a matrix to clone
 * @returns {mat4} a new 4x4 matrix
 */

function clone(a) {
  var out = new ARRAY_TYPE(16);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the source matrix
 * @returns {mat4} out
 */

function invert(out, a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15];
  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32; // Calculate the determinant

  var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  if (!det) {
    return null;
  }

  det = 1.0 / det;
  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
  return out;
}
/**
 * Multiplies two mat4s
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the first operand
 * @param {ReadonlyMat4} b the second operand
 * @returns {mat4} out
 */

function multiply(out, a, b) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15]; // Cache only the current line of the second matrix

  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3];
  out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[4];
  b1 = b[5];
  b2 = b[6];
  b3 = b[7];
  out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[8];
  b1 = b[9];
  b2 = b[10];
  b3 = b[11];
  out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[12];
  b1 = b[13];
  b2 = b[14];
  b3 = b[15];
  out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  return out;
}
/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {ReadonlyVec3} v Translation vector
 * @returns {mat4} out
 */

function fromTranslation(out, v) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.scale(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {ReadonlyVec3} v Scaling vector
 * @returns {mat4} out
 */

function fromScaling(out, v) {
  out[0] = v[0];
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = v[1];
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = v[2];
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from a given angle around a given axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotate(dest, dest, rad, axis);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @param {ReadonlyVec3} axis the axis to rotate around
 * @returns {mat4} out
 */

function fromRotation(out, rad, axis) {
  var x = axis[0],
      y = axis[1],
      z = axis[2];
  var len = Math.hypot(x, y, z);
  var s, c, t;

  if (len < EPSILON) {
    return null;
  }

  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;
  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c; // Perform rotation-specific matrix multiplication

  out[0] = x * x * t + c;
  out[1] = y * x * t + z * s;
  out[2] = z * x * t - y * s;
  out[3] = 0;
  out[4] = x * y * t - z * s;
  out[5] = y * y * t + c;
  out[6] = z * y * t + x * s;
  out[7] = 0;
  out[8] = x * z * t + y * s;
  out[9] = y * z * t - x * s;
  out[10] = z * z * t + c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Returns the translation vector component of a transformation
 *  matrix. If a matrix is built with fromRotationTranslation,
 *  the returned vector will be the same as the translation vector
 *  originally supplied.
 * @param  {vec3} out Vector to receive translation component
 * @param  {ReadonlyMat4} mat Matrix to be decomposed (input)
 * @return {vec3} out
 */

function getTranslation(out, mat) {
  out[0] = mat[12];
  out[1] = mat[13];
  out[2] = mat[14];
  return out;
}
/**
 * Returns the scaling factor component of a transformation
 *  matrix. If a matrix is built with fromRotationTranslationScale
 *  with a normalized Quaternion paramter, the returned vector will be
 *  the same as the scaling vector
 *  originally supplied.
 * @param  {vec3} out Vector to receive scaling factor component
 * @param  {ReadonlyMat4} mat Matrix to be decomposed (input)
 * @return {vec3} out
 */

function getScaling(out, mat) {
  var m11 = mat[0];
  var m12 = mat[1];
  var m13 = mat[2];
  var m21 = mat[4];
  var m22 = mat[5];
  var m23 = mat[6];
  var m31 = mat[8];
  var m32 = mat[9];
  var m33 = mat[10];
  out[0] = Math.hypot(m11, m12, m13);
  out[1] = Math.hypot(m21, m22, m23);
  out[2] = Math.hypot(m31, m32, m33);
  return out;
}

/**
 * 4 Dimensional Vector
 * @module vec4
 */

/**
 * Creates a new, empty vec4
 *
 * @returns {vec4} a new 4D vector
 */

function create$1() {
  var out = new ARRAY_TYPE(4);

  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
  }

  return out;
}
/**
 * Transforms the vec4 with a mat4.
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the vector to transform
 * @param {ReadonlyMat4} m matrix to transform with
 * @returns {vec4} out
 */

function transformMat4(out, a, m) {
  var x = a[0],
      y = a[1],
      z = a[2],
      w = a[3];
  out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
  out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
  out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
  out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
  return out;
}
/**
 * Perform some operation over an array of vec4s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

(function () {
  var vec = create$1();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 4;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      vec[3] = a[i + 3];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
      a[i + 3] = vec[3];
    }

    return a;
  };
})();

/**
 * 2 Dimensional Vector
 * @module vec2
 */

/**
 * Creates a new, empty vec2
 *
 * @returns {vec2} a new 2D vector
 */

function create() {
  var out = new ARRAY_TYPE(2);

  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
  }

  return out;
}
/**
 * Get the angle between two 2D vectors
 * @param {ReadonlyVec2} a The first operand
 * @param {ReadonlyVec2} b The second operand
 * @returns {Number} The angle in radians
 */

function angle(a, b) {
  var x1 = a[0],
      y1 = a[1],
      x2 = b[0],
      y2 = b[1],
      // mag is the product of the magnitudes of a and b
  mag = Math.sqrt(x1 * x1 + y1 * y1) * Math.sqrt(x2 * x2 + y2 * y2),
      // mag &&.. short circuits if mag == 0
  cosine = mag && (x1 * x2 + y1 * y2) / mag; // Math.min(Math.max(cosine, -1), 1) clamps the cosine between -1 and 1

  return Math.acos(Math.min(Math.max(cosine, -1), 1));
}
/**
 * Perform some operation over an array of vec2s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

(function () {
  var vec = create();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 2;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
    }

    return a;
  };
})();

const createCamera = (
  initTarget = [0, 0],
  initDistance = 1,
  initRotation = 0,
  initViewCenter = [0, 0],
  initScaleBounds = [
    [0, Infinity],
    [0, Infinity],
  ],
  initTranslationBounds = [
    [-Infinity, Infinity],
    [-Infinity, Infinity],
  ]
) => {
  // Scratch variables
  const scratch0 = new Float32Array(16);
  const scratch1 = new Float32Array(16);
  const scratch2 = new Float32Array(16);

  let view = create$2();
  let viewCenter = [...initViewCenter.slice(0, 2), 0, 1];

  const scaleXBounds = Array.isArray(initScaleBounds[0])
    ? [...initScaleBounds[0]]
    : [...initScaleBounds];
  const scaleYBounds = Array.isArray(initScaleBounds[0])
    ? [...initScaleBounds[1]]
    : [...initScaleBounds];

  const translationXBounds = Array.isArray(initTranslationBounds[0])
    ? [...initTranslationBounds[0]]
    : [...initTranslationBounds];
  const translationYBounds = Array.isArray(initTranslationBounds[0])
    ? [...initTranslationBounds[1]]
    : [...initTranslationBounds];

  const getScaling$1 = () => getScaling(scratch0, view).slice(0, 2);
  const getMinScaling = () => {
    const scaling = getScaling$1();
    return Math.min(scaling[0], scaling[1]);
  };
  const getMaxScaling = () => {
    const scaling = getScaling$1();
    return Math.max(scaling[0], scaling[1]);
  };

  const getRotation = () => Math.acos(view[0] / getMaxScaling());

  const getScaleBounds = () => [[...scaleXBounds], [...scaleYBounds]];
  const getTranslationBounds = () => [
    [...translationXBounds],
    [...translationYBounds],
  ];

  const getDistance = () => {
    const scaling = getScaling$1();
    return [1 / scaling[0], 1 / scaling[1]];
  };
  const getMinDistance = () => 1 / getMinScaling();
  const getMaxDistance = () => 1 / getMaxScaling();

  const getTranslation$1 = () => getTranslation(scratch0, view).slice(0, 2);

  const getTarget = () =>
    transformMat4(scratch0, viewCenter, invert(scratch2, view))
      .slice(0, 2);

  const getView = () => view;

  const getViewCenter = () => viewCenter.slice(0, 2);

  const lookAt = ([x = 0, y = 0] = [], newDistance = 1, newRotation = 0) => {
    // Reset the view
    view = create$2();

    translate([-x, -y]);
    rotate(newRotation);
    scale(1 / newDistance);
  };

  const translate = ([x = 0, y = 0] = []) => {
    scratch0[0] = x;
    scratch0[1] = y;
    scratch0[2] = 0;

    const t = fromTranslation(scratch1, scratch0);

    // Translate about the viewport center
    // This is identical to `i * t * i * view` where `i` is the identity matrix
    multiply(view, t, view);
  };

  const scale = (d, mousePos) => {
    const isArray = Array.isArray(d);
    let dx = isArray ? d[0] : d;
    let dy = isArray ? d[1] : d;

    if (dx <= 0 || dy <= 0 || (dx === 1 && dy === 1)) return;

    const scaling = getScaling$1();
    const newXScale = scaling[0] * dx;
    const newYScale = scaling[1] * dy;

    dx =
      Math.max(scaleXBounds[0], Math.min(newXScale, scaleXBounds[1])) /
      scaling[0];
    dy =
      Math.max(scaleYBounds[0], Math.min(newYScale, scaleYBounds[1])) /
      scaling[1];

    if (dx === 1 && dy === 1) return; // There is nothing to do

    scratch0[0] = dx;
    scratch0[1] = dy;
    scratch0[2] = 1;

    const s = fromScaling(scratch1, scratch0);

    const scaleCenter = mousePos ? [...mousePos, 0] : viewCenter;
    const a = fromTranslation(scratch0, scaleCenter);

    // Translate about the scale center
    // I.e., the mouse position or the view center
    multiply(
      view,
      a,
      multiply(
        view,
        s,
        multiply(view, invert(scratch2, a), view)
      )
    );
  };

  const rotate = (rad) => {
    const r = create$2();
    fromRotation(r, rad, [0, 0, 1]);

    // Rotate about the viewport center
    // This is identical to `i * r * i * view` where `i` is the identity matrix
    multiply(view, r, view);
  };

  const setScaleBounds = (newBounds) => {
    const isArray = Array.isArray(newBounds[0]);
    scaleXBounds[0] = isArray ? newBounds[0][0] : newBounds[0];
    scaleXBounds[1] = isArray ? newBounds[0][1] : newBounds[1];
    scaleYBounds[0] = isArray ? newBounds[1][0] : newBounds[0];
    scaleYBounds[1] = isArray ? newBounds[1][1] : newBounds[1];
  };

  const setTranslationBounds = (newBounds) => {
    const isArray = Array.isArray(newBounds[0]);
    translationXBounds[0] = isArray ? newBounds[0][0] : newBounds[0];
    translationXBounds[1] = isArray ? newBounds[0][1] : newBounds[1];
    translationYBounds[0] = isArray ? newBounds[1][0] : newBounds[0];
    translationYBounds[1] = isArray ? newBounds[1][1] : newBounds[1];
  };

  const setView = (newView) => {
    if (!newView || newView.length < 16) return;
    view = newView;
  };

  const setViewCenter = (newViewCenter) => {
    viewCenter = [...newViewCenter.slice(0, 2), 0, 1];
  };

  const reset = () => {
    lookAt(initTarget, initDistance, initRotation);
  };

  // Init
  lookAt(initTarget, initDistance, initRotation);

  return {
    get translation() {
      return getTranslation$1();
    },
    get target() {
      return getTarget();
    },
    get scaling() {
      return getScaling$1();
    },
    get minScaling() {
      return getMinScaling();
    },
    get maxScaling() {
      return getMaxScaling();
    },
    get scaleBounds() {
      return getScaleBounds();
    },
    get translationBounds() {
      return getTranslationBounds();
    },
    get distance() {
      return getDistance();
    },
    get minDistance() {
      return getMinDistance();
    },
    get maxDistance() {
      return getMaxDistance();
    },
    get rotation() {
      return getRotation();
    },
    get view() {
      return getView();
    },
    get viewCenter() {
      return getViewCenter();
    },
    lookAt,
    translate,
    pan: translate,
    rotate,
    scale,
    zoom: scale,
    reset,
    set: (...args) => {
      console.warn('`set()` is deprecated. Please use `setView()` instead.');
      return setView(...args);
    },
    setScaleBounds,
    setTranslationBounds,
    setView,
    setViewCenter,
  };
};

const MOUSE_DOWN_MOVE_ACTIONS = ["pan", "rotate"];
const KEY_MAP = {
  alt: "altKey",
  cmd: "metaKey",
  ctrl: "ctrlKey",
  meta: "metaKey",
  shift: "shiftKey"
};

const dom2dCamera = (
  element,
  {
    distance = 1.0,
    target = [0, 0],
    rotation = 0,
    isNdc = true,
    isFixed = false,
    isPan = true,
    isPanInverted = [false, true],
    panSpeed = 1,
    isRotate = true,
    rotateSpeed = 1,
    defaultMouseDownMoveAction = "pan",
    mouseDownMoveModKey = "alt",
    isZoom = true,
    zoomSpeed = 1,
    viewCenter,
    scaleBounds,
    translationBounds,
    onKeyDown = () => {},
    onKeyUp = () => {},
    onMouseDown = () => {},
    onMouseUp = () => {},
    onMouseMove = () => {},
    onWheel = () => {}
  } = {}
) => {
  let camera = createCamera(
    target,
    distance,
    rotation,
    viewCenter,
    scaleBounds,
    translationBounds
  );
  let mouseX = 0;
  let mouseY = 0;
  let mouseRelX = 0;
  let mouseRelY = 0;
  let prevMouseX = 0;
  let prevMouseY = 0;
  let isLeftMousePressed = false;
  let yScroll = 0;

  let width = 1;
  let height = 1;
  let aspectRatio = 1;

  let isInteractivelyChanged = false;
  let isProgrammaticallyChanged = false;
  let isMouseDownMoveModActive = false;

  let panOnMouseDownMove = defaultMouseDownMoveAction === "pan";

  let isPanX = isPan;
  let isPanY = isPan;
  let isPanXInverted = isPanInverted;
  let isPanYInverted = isPanInverted;
  let isZoomX = isZoom;
  let isZoomY = isZoom;

  const spreadXYSettings = () => {
    isPanX = Array.isArray(isPan) ? Boolean(isPan[0]) : isPan;
    isPanY = Array.isArray(isPan) ? Boolean(isPan[1]) : isPan;
    isPanXInverted = Array.isArray(isPanInverted)
      ? Boolean(isPanInverted[0])
      : isPanInverted;
    isPanYInverted = Array.isArray(isPanInverted)
      ? Boolean(isPanInverted[1])
      : isPanInverted;
    isZoomX = Array.isArray(isZoom) ? Boolean(isZoom[0]) : isZoom;
    isZoomY = Array.isArray(isZoom) ? Boolean(isZoom[1]) : isZoom;
  };

  spreadXYSettings();

  const transformPanX = isNdc
    ? dX => (dX / width) * 2 * aspectRatio // to normalized device coords
    : dX => dX;
  const transformPanY = isNdc
    ? dY => (dY / height) * 2 // to normalized device coords
    : dY => -dY;

  const transformScaleX = isNdc
    ? x => (-1 + (x / width) * 2) * aspectRatio // to normalized device coords
    : x => x;
  const transformScaleY = isNdc
    ? y => 1 - (y / height) * 2 // to normalized device coords
    : y => y;

  const tick = () => {
    if (isFixed) return false;

    isInteractivelyChanged = false;
    const currentMouseX = mouseX;
    const currentMouseY = mouseY;

    if (
      (isPanX || isPanY) &&
      isLeftMousePressed &&
      ((panOnMouseDownMove && !isMouseDownMoveModActive) ||
        (!panOnMouseDownMove && isMouseDownMoveModActive))
    ) {
      const dX = isPanXInverted
        ? prevMouseX - currentMouseX
        : currentMouseX - prevMouseX;

      const transformedPanX = isPanX ? transformPanX(panSpeed * dX) : 0;

      const dY = isPanYInverted
        ? prevMouseY - currentMouseY
        : currentMouseY - prevMouseY;

      const transformedPanY = isPanY ? transformPanY(panSpeed * dY) : 0;

      if (transformedPanX !== 0 || transformedPanY !== 0) {
        camera.pan([transformedPanX, transformedPanY]);
        isInteractivelyChanged = true;
      }
    }

    if (isZoom && yScroll) {
      const dZ = zoomSpeed * Math.exp(yScroll / height);

      const transformedX = transformScaleX(mouseRelX);
      const transformedY = transformScaleY(mouseRelY);

      camera.scale(
        [isZoomX ? 1 / dZ : 1, isZoomY ? 1 / dZ : 1],
        [transformedX, transformedY]
      );

      isInteractivelyChanged = true;
    }

    if (
      isRotate &&
      isLeftMousePressed &&
      ((panOnMouseDownMove && isMouseDownMoveModActive) ||
        (!panOnMouseDownMove && !isMouseDownMoveModActive)) &&
      Math.abs(prevMouseX - currentMouseX) +
        Math.abs(prevMouseY - currentMouseY) >
        0
    ) {
      const wh = width / 2;
      const hh = height / 2;
      const x1 = prevMouseX - wh;
      const y1 = hh - prevMouseY;
      const x2 = currentMouseX - wh;
      const y2 = hh - currentMouseY;
      // Angle between the start and end mouse position with respect to the
      // viewport center
      const radians = angle([x1, y1], [x2, y2]);
      // Determine the orientation
      const cross = x1 * y2 - x2 * y1;

      camera.rotate(rotateSpeed * radians * Math.sign(cross));

      isInteractivelyChanged = true;
    }

    // Reset scroll delta and mouse position
    yScroll = 0;
    prevMouseX = currentMouseX;
    prevMouseY = currentMouseY;

    const isChanged = isInteractivelyChanged || isProgrammaticallyChanged;

    isProgrammaticallyChanged = false;

    return isChanged;
  };

  const config = ({
    defaultMouseDownMoveAction: newDefaultMouseDownMoveAction = null,
    isFixed: newIsFixed = null,
    isPan: newIsPan = null,
    isPanInverted: newIsPanInverted = null,
    isRotate: newIsRotate = null,
    isZoom: newIsZoom = null,
    panSpeed: newPanSpeed = null,
    rotateSpeed: newRotateSpeed = null,
    zoomSpeed: newZoomSpeed = null,
    mouseDownMoveModKey: newMouseDownMoveModKey = null
  } = {}) => {
    defaultMouseDownMoveAction =
      newDefaultMouseDownMoveAction !== null &&
      MOUSE_DOWN_MOVE_ACTIONS.includes(newDefaultMouseDownMoveAction)
        ? newDefaultMouseDownMoveAction
        : defaultMouseDownMoveAction;

    panOnMouseDownMove = defaultMouseDownMoveAction === "pan";

    isFixed = newIsFixed !== null ? newIsFixed : isFixed;
    isPan = newIsPan !== null ? newIsPan : isPan;
    isPanInverted =
      newIsPanInverted !== null ? newIsPanInverted : isPanInverted;
    isRotate = newIsRotate !== null ? newIsRotate : isRotate;
    isZoom = newIsZoom !== null ? newIsZoom : isZoom;
    panSpeed = +newPanSpeed > 0 ? newPanSpeed : panSpeed;
    rotateSpeed = +newRotateSpeed > 0 ? newRotateSpeed : rotateSpeed;
    zoomSpeed = +newZoomSpeed > 0 ? newZoomSpeed : zoomSpeed;

    spreadXYSettings();

    mouseDownMoveModKey =
      newMouseDownMoveModKey !== null &&
      Object.keys(KEY_MAP).includes(newMouseDownMoveModKey)
        ? newMouseDownMoveModKey
        : mouseDownMoveModKey;
  };

  const refresh = () => {
    const bBox = element.getBoundingClientRect();
    width = bBox.width;
    height = bBox.height;
    aspectRatio = width / height;
  };

  const keyUpHandler = event => {
    isMouseDownMoveModActive = false;

    onKeyUp(event);
  };

  const keyDownHandler = event => {
    isMouseDownMoveModActive = event[KEY_MAP[mouseDownMoveModKey]];

    onKeyDown(event);
  };

  const mouseUpHandler = event => {
    isLeftMousePressed = false;

    onMouseUp(event);
  };

  const mouseDownHandler = event => {
    isLeftMousePressed = event.buttons === 1;

    onMouseDown(event);
  };

  const offsetXSupport =
    document.createEvent("MouseEvent").offsetX !== undefined;

  const updateMouseRelXY = offsetXSupport
    ? event => {
        mouseRelX = event.offsetX;
        mouseRelY = event.offsetY;
      }
    : event => {
        const bBox = element.getBoundingClientRect();
        mouseRelX = event.clientX - bBox.left;
        mouseRelY = event.clientY - bBox.top;
      };

  const updateMouseXY = event => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  };

  const mouseMoveHandler = event => {
    updateMouseXY(event);
    onMouseMove(event);
  };

  const wheelHandler = event => {
    event.preventDefault();

    updateMouseXY(event);
    updateMouseRelXY(event);

    const scale = event.deltaMode === 1 ? 12 : 1;

    yScroll += scale * (event.deltaY || 0);

    onWheel(event);
  };

  const dispose = () => {
    camera = undefined;
    window.removeEventListener("keydown", keyDownHandler);
    window.removeEventListener("keyup", keyUpHandler);
    element.removeEventListener("mousedown", mouseDownHandler);
    window.removeEventListener("mouseup", mouseUpHandler);
    window.removeEventListener("mousemove", mouseMoveHandler);
    element.removeEventListener("wheel", wheelHandler);
  };

  window.addEventListener("keydown", keyDownHandler, { passive: true });
  window.addEventListener("keyup", keyUpHandler, { passive: true });
  element.addEventListener("mousedown", mouseDownHandler, { passive: true });
  window.addEventListener("mouseup", mouseUpHandler, { passive: true });
  window.addEventListener("mousemove", mouseMoveHandler, { passive: true });
  element.addEventListener("wheel", wheelHandler, { passive: false });

  camera.config = config;
  camera.dispose = dispose;
  camera.refresh = refresh;
  camera.tick = tick;

  const withProgrammaticChange = fn =>
    function() {
      fn.apply(null, arguments);
      isProgrammaticallyChanged = true;
    };

  camera.lookAt = withProgrammaticChange(camera.lookAt);
  camera.translate = withProgrammaticChange(camera.translate);
  camera.pan = withProgrammaticChange(camera.pan);
  camera.rotate = withProgrammaticChange(camera.rotate);
  camera.scale = withProgrammaticChange(camera.scale);
  camera.zoom = withProgrammaticChange(camera.zoom);
  camera.reset = withProgrammaticChange(camera.reset);
  camera.set = withProgrammaticChange(camera.set);
  camera.setScaleBounds = withProgrammaticChange(camera.setScaleBounds);
  camera.setTranslationBounds = withProgrammaticChange(
    camera.setTranslationBounds
  );
  camera.setView = withProgrammaticChange(camera.setView);
  camera.setViewCenter = withProgrammaticChange(camera.setViewCenter);

  refresh();

  return camera;
};

function sortKD(ids, coords, nodeSize, left, right, depth) {
    if (right - left <= nodeSize) return;

    const m = (left + right) >> 1;

    select(ids, coords, m, left, right, depth % 2);

    sortKD(ids, coords, nodeSize, left, m - 1, depth + 1);
    sortKD(ids, coords, nodeSize, m + 1, right, depth + 1);
}

function select(ids, coords, k, left, right, inc) {

    while (right > left) {
        if (right - left > 600) {
            const n = right - left + 1;
            const m = k - left + 1;
            const z = Math.log(n);
            const s = 0.5 * Math.exp(2 * z / 3);
            const sd = 0.5 * Math.sqrt(z * s * (n - s) / n) * (m - n / 2 < 0 ? -1 : 1);
            const newLeft = Math.max(left, Math.floor(k - m * s / n + sd));
            const newRight = Math.min(right, Math.floor(k + (n - m) * s / n + sd));
            select(ids, coords, k, newLeft, newRight, inc);
        }

        const t = coords[2 * k + inc];
        let i = left;
        let j = right;

        swapItem(ids, coords, left, k);
        if (coords[2 * right + inc] > t) swapItem(ids, coords, left, right);

        while (i < j) {
            swapItem(ids, coords, i, j);
            i++;
            j--;
            while (coords[2 * i + inc] < t) i++;
            while (coords[2 * j + inc] > t) j--;
        }

        if (coords[2 * left + inc] === t) swapItem(ids, coords, left, j);
        else {
            j++;
            swapItem(ids, coords, j, right);
        }

        if (j <= k) left = j + 1;
        if (k <= j) right = j - 1;
    }
}

function swapItem(ids, coords, i, j) {
    swap(ids, i, j);
    swap(coords, 2 * i, 2 * j);
    swap(coords, 2 * i + 1, 2 * j + 1);
}

function swap(arr, i, j) {
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
}

function range(ids, coords, minX, minY, maxX, maxY, nodeSize) {
    const stack = [0, ids.length - 1, 0];
    const result = [];
    let x, y;

    while (stack.length) {
        const axis = stack.pop();
        const right = stack.pop();
        const left = stack.pop();

        if (right - left <= nodeSize) {
            for (let i = left; i <= right; i++) {
                x = coords[2 * i];
                y = coords[2 * i + 1];
                if (x >= minX && x <= maxX && y >= minY && y <= maxY) result.push(ids[i]);
            }
            continue;
        }

        const m = Math.floor((left + right) / 2);

        x = coords[2 * m];
        y = coords[2 * m + 1];

        if (x >= minX && x <= maxX && y >= minY && y <= maxY) result.push(ids[m]);

        const nextAxis = (axis + 1) % 2;

        if (axis === 0 ? minX <= x : minY <= y) {
            stack.push(left);
            stack.push(m - 1);
            stack.push(nextAxis);
        }
        if (axis === 0 ? maxX >= x : maxY >= y) {
            stack.push(m + 1);
            stack.push(right);
            stack.push(nextAxis);
        }
    }

    return result;
}

function within(ids, coords, qx, qy, r, nodeSize) {
    const stack = [0, ids.length - 1, 0];
    const result = [];
    const r2 = r * r;

    while (stack.length) {
        const axis = stack.pop();
        const right = stack.pop();
        const left = stack.pop();

        if (right - left <= nodeSize) {
            for (let i = left; i <= right; i++) {
                if (sqDist(coords[2 * i], coords[2 * i + 1], qx, qy) <= r2) result.push(ids[i]);
            }
            continue;
        }

        const m = Math.floor((left + right) / 2);

        const x = coords[2 * m];
        const y = coords[2 * m + 1];

        if (sqDist(x, y, qx, qy) <= r2) result.push(ids[m]);

        const nextAxis = (axis + 1) % 2;

        if (axis === 0 ? qx - r <= x : qy - r <= y) {
            stack.push(left);
            stack.push(m - 1);
            stack.push(nextAxis);
        }
        if (axis === 0 ? qx + r >= x : qy + r >= y) {
            stack.push(m + 1);
            stack.push(right);
            stack.push(nextAxis);
        }
    }

    return result;
}

function sqDist(ax, ay, bx, by) {
    const dx = ax - bx;
    const dy = ay - by;
    return dx * dx + dy * dy;
}

const defaultGetX = p => p[0];
const defaultGetY = p => p[1];

class KDBush {
    constructor(points, getX = defaultGetX, getY = defaultGetY, nodeSize = 64, ArrayType = Float64Array) {
        this.nodeSize = nodeSize;
        this.points = points;

        const IndexArrayType = points.length < 65536 ? Uint16Array : Uint32Array;

        const ids = this.ids = new IndexArrayType(points.length);
        const coords = this.coords = new ArrayType(points.length * 2);

        for (let i = 0; i < points.length; i++) {
            ids[i] = i;
            coords[2 * i] = getX(points[i]);
            coords[2 * i + 1] = getY(points[i]);
        }

        sortKD(ids, coords, nodeSize, 0, ids.length - 1, 0);
    }

    range(minX, minY, maxX, maxY) {
        return range(this.ids, this.coords, minX, minY, maxX, maxY, this.nodeSize);
    }

    within(x, y, r) {
        return within(this.ids, this.coords, x, y, r, this.nodeSize);
    }
}

const FRAGMENT_SHADER$3 = `
precision mediump float;
varying vec4 color;
void main() {
  gl_FragColor = color;
}`;

// Vertex shader from https://mattdesl.svbtle.com/drawing-lines-is-hard
// The MIT License (MIT) Copyright (c) 2015 Matt DesLauriers
const VERTEX_SHADER$1 = `
uniform mat4 projectionViewModel;
uniform float aspectRatio;

uniform sampler2D colorTex;
uniform float colorTexRes;
uniform float colorTexEps;
uniform float width;
uniform float useOpacity;
uniform float useColorOpacity;
uniform int miter;

attribute vec3 prevPosition;
attribute vec3 currPosition;
attribute vec3 nextPosition;
attribute float opacity;
attribute float offsetScale;
attribute float colorIndex;

varying vec4 color;

void main() {
  vec2 aspectVec = vec2(aspectRatio, 1.0);
  vec4 prevProjected = projectionViewModel * vec4(prevPosition, 1.0);
  vec4 currProjected = projectionViewModel * vec4(currPosition, 1.0);
  vec4 nextProjected = projectionViewModel * vec4(nextPosition, 1.0);

  // get 2D screen space with W divide and aspect correction
  vec2 prevScreen = prevProjected.xy / prevProjected.w * aspectVec;
  vec2 currScreen = currProjected.xy / currProjected.w * aspectVec;
  vec2 nextScreen = nextProjected.xy / nextProjected.w * aspectVec;

  // starting point uses (next - current)
  vec2 dir = vec2(0.0);
  if (currScreen == prevScreen) {
    dir = normalize(nextScreen - currScreen);
  }
  // ending point uses (current - previous)
  else if (currScreen == nextScreen) {
    dir = normalize(currScreen - prevScreen);
  }
  // somewhere in middle, needs a join
  else {
    // get directions from (C - B) and (B - A)
    vec2 dirA = normalize((currScreen - prevScreen));
    if (miter == 1) {
      vec2 dirB = normalize((nextScreen - currScreen));
      // now compute the miter join normal and length
      vec2 tangent = normalize(dirA + dirB);
      vec2 perp = vec2(-dirA.y, dirA.x);
      vec2 miter = vec2(-tangent.y, tangent.x);
      dir = tangent;
    } else {
      dir = dirA;
    }
  }

  vec2 normal = vec2(-dir.y, dir.x) * width;
  normal.x /= aspectRatio;
  vec4 offset = vec4(normal * offsetScale, 0.0, 0.0);
  gl_Position = currProjected + offset;

  // Get color from texture
  float colorRowIndex = floor((colorIndex + colorTexEps) / colorTexRes);
  vec2 colorTexIndex = vec2(
    (colorIndex / colorTexRes) - colorRowIndex + colorTexEps,
    colorRowIndex / colorTexRes + colorTexEps
  );

  color = texture2D(colorTex, colorTexIndex);
  color.a = useColorOpacity * color.a + useOpacity * opacity;
}`;

const { push, splice } = Array.prototype;

const I = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
const FLOAT_BYTES$1 = Float32Array.BYTES_PER_ELEMENT;

const createMesh = (numPointsPerLine, buffer = []) => {
  let numPrevPoints = 0;
  numPointsPerLine.forEach((numPoints) => {
    for (let i = 0; i < numPoints - 1; i++) {
      const a = numPrevPoints + i * 2; // `2`  because we duplicated all points
      const b = a + 1;
      const c = a + 2;
      const d = a + 3;
      buffer.push(a, b, c, c, b, d);
    }
    // Each line adds an additional start and end point, hence, `numPoints + 2`
    // And again, since all points are duplicated, we have `* 2`
    numPrevPoints += (numPoints + 2) * 2;
  });
  return buffer;
};

const Buffer = {
  duplicate(buffer, stride = 1, dupScale = 1) {
    const out = [];
    const component = new Array(stride * 2);
    for (let i = 0, il = buffer.length / stride; i < il; i++) {
      const index = i * stride;
      for (let j = 0; j < stride; j++) {
        const value = buffer[index + j];
        component[j] = value;
        component[j + stride] = value * dupScale;
      }
      push.apply(out, component);
    }
    return out;
  },

  mapElement(buffer, elementIndex, stride, map) {
    for (let i = 0, il = buffer.length / stride; i < il; i++) {
      const index = elementIndex + i * stride;
      buffer[index] = map(buffer[index], index, i);
    }
    return buffer;
  },

  copyElement(buffer, sourceElementIndex, targetIndex, stride) {
    const component = new Array(stride);
    const ai = sourceElementIndex * stride;
    // Copy source element component wise
    for (let i = 0; i < stride; i++) component[i] = buffer[ai + i];
    splice.call(buffer, targetIndex * stride, 0, ...component);
    return buffer;
  },

  increaseStride(buffer, stride, newStride, undefValue = 0) {
    const out = [];
    const component = new Array(newStride).fill(undefValue);
    for (let i = 0, il = buffer.length / stride; i < il; i++) {
      const index = i * stride;
      for (let j = 0; j < stride; j++) {
        component[j] = buffer[index + j];
      }
      push.apply(out, component);
    }
    return out;
  },
};

const createLine = (
  regl,
  {
    projection = I,
    model = I,
    view = I,
    points = [],
    colorIndices = [],
    color = [0.8, 0.5, 0, 1],
    opacity = null,
    opacities = [],
    width = 1,
    widths = [],
    miter = 1,
    is2d = false,
    zPos2d = 0,
  } = {}
) => {
  if (!regl) {
    console.error('Regl instance is undefined.');
    return;
  }

  const pvm = new Float32Array(16);

  let numLines;
  let numPoints;
  let numPointsPerLine;
  let pointsPadded;
  let pointsDup;
  let colorIndicesDup;
  let opacitiesDup;
  let widthsDup;
  let indices;
  let pointBuffer;
  let opacityBuffer;
  let widthBuffer;
  let colorTex;
  let colorTexRes;
  let colorIndexBuffer;
  let attributes;
  let elements;
  let drawLine;
  let dim = is2d ? 2 : 3;

  const useOpacity = () =>
    +(opacities.length === numPoints || opacity !== null);

  const init = () => {
    pointBuffer = regl.buffer();
    opacityBuffer = regl.buffer();
    widthBuffer = regl.buffer();
    colorIndexBuffer = regl.buffer();

    attributes = {
      prevPosition: {
        buffer: () => pointBuffer,
        offset: 0,
        stride: FLOAT_BYTES$1 * 3,
      },
      currPosition: {
        buffer: () => pointBuffer,
        // note that each point is duplicated, hence we need to skip over the first two
        offset: FLOAT_BYTES$1 * 3 * 2,
        stride: FLOAT_BYTES$1 * 3,
      },
      nextPosition: {
        buffer: () => pointBuffer,
        // note that each point is duplicated, hence we need to skip over the first four
        offset: FLOAT_BYTES$1 * 3 * 4,
        stride: FLOAT_BYTES$1 * 3,
      },
      opacity: {
        buffer: () => opacityBuffer,
        // note that each point is duplicated, hence we need to skip over the first two
        offset: FLOAT_BYTES$1 * 2,
        stride: FLOAT_BYTES$1,
      },
      offsetScale: {
        buffer: () => widthBuffer,
        // note that each point is duplicated, hence we need to skip over the first two
        offset: FLOAT_BYTES$1 * 2,
        stride: FLOAT_BYTES$1,
      },
      colorIndex: {
        buffer: () => colorIndexBuffer,
        // note that each point is duplicated, hence we need to skip over the first two
        offset: FLOAT_BYTES$1 * 2,
        stride: FLOAT_BYTES$1,
      },
    };

    elements = regl.elements();

    drawLine = regl({
      attributes,
      depth: { enable: !is2d },
      blend: {
        enable: true,
        func: {
          srcRGB: 'src alpha',
          srcAlpha: 'one',
          dstRGB: 'one minus src alpha',
          dstAlpha: 'one minus src alpha',
        },
      },
      uniforms: {
        projectionViewModel: (context, props) => {
          const projection = context.projection || props.projection;
          const model = context.model || props.model;
          const view = context.view || props.view;
          return multiply(
            pvm,
            projection,
            multiply(pvm, view, model)
          );
        },
        aspectRatio: ({ viewportWidth, viewportHeight }) =>
          viewportWidth / viewportHeight,
        colorTex: () => colorTex,
        colorTexRes: () => colorTexRes,
        colorTexEps: () => 0.5 / colorTexRes,
        pixelRatio: ({ pixelRatio }) => pixelRatio,
        width: ({ pixelRatio, viewportHeight }) =>
          (width / viewportHeight) * pixelRatio,
        useOpacity,
        useColorOpacity: () => +!useOpacity(),
        miter,
      },
      elements: () => elements,
      vert: VERTEX_SHADER$1,
      frag: FRAGMENT_SHADER$3,
    });
  };

  const prepare = () => {
    if (numLines === 1 && points.length % dim > 0) {
      console.warn(
        `The length of points (${numPoints}) does not match the dimensions (${dim}). Incomplete points are ignored.`
      );
    }

    // Copy all points belonging to complete points
    pointsPadded = points.flat().slice(0, numPoints * dim);

    // Add the missing z point
    if (is2d) {
      pointsPadded = Buffer.increaseStride(pointsPadded, 2, 3, zPos2d);
    }

    if (colorIndices.length !== numPoints)
      colorIndices = new Array(numPoints).fill(0);

    if (widths.length !== numPoints) widths = new Array(numPoints).fill(1);

    let finalColorIndices = colorIndices.slice();
    let finalOpacities =
      opacities.length === numPoints
        ? opacities.slice()
        : new Array(numPoints).fill(+opacity);
    let finalWidths = widths.slice();

    let k = 0;
    numPointsPerLine.forEach((n) => {
      const lastPointIdx = k + n - 1;
      // For each line, duplicate the first and last point.
      // E.g., [1,2,3] -> [1,1,2,3,3]
      // First, copy the last point to the end
      Buffer.copyElement(pointsPadded, lastPointIdx, lastPointIdx, 3);
      // Second, copy the first point to the beginning
      Buffer.copyElement(pointsPadded, k, k, 3);

      Buffer.copyElement(finalColorIndices, lastPointIdx, lastPointIdx, 1);
      Buffer.copyElement(finalColorIndices, k, k, 1);
      Buffer.copyElement(finalOpacities, lastPointIdx, lastPointIdx, 1);
      Buffer.copyElement(finalOpacities, k, k, 1);
      Buffer.copyElement(finalWidths, lastPointIdx, lastPointIdx, 1);
      Buffer.copyElement(finalWidths, k, k, 1);

      k += n + 2;
    });

    // duplicate each point for the positive and negative width (see below)
    pointsDup = new Float32Array(Buffer.duplicate(pointsPadded, 3));
    // duplicate each color, opacity, and width such that we have a positive
    // and negative width
    colorIndicesDup = Buffer.duplicate(finalColorIndices);
    opacitiesDup = Buffer.duplicate(finalOpacities);
    widthsDup = Buffer.duplicate(finalWidths, 1, -1);
    // create the line mesh, i.e., the vertex indices
    indices = createMesh(numPointsPerLine);

    pointBuffer({
      usage: 'dynamic',
      type: 'float',
      length: pointsDup.length * FLOAT_BYTES$1,
      data: pointsDup,
    });

    opacityBuffer({
      usage: 'dynamic',
      type: 'float',
      length: opacitiesDup.length * FLOAT_BYTES$1,
      data: opacitiesDup,
    });

    widthBuffer({
      usage: 'dynamic',
      type: 'float',
      length: widthsDup.length * FLOAT_BYTES$1,
      data: widthsDup,
    });

    colorIndexBuffer({
      usage: 'dynamic',
      type: 'float',
      length: colorIndicesDup.length * FLOAT_BYTES$1,
      data: colorIndicesDup,
    });

    elements({
      primitive: 'triangles',
      usage: 'dynamic',
      type: indices.length > 2 ** 16 ? 'uint32' : 'uint16',
      data: indices,
    });
  };

  const clear = () => {
    destroy();
    init();
  };

  const destroy = () => {
    points = null;
    pointsPadded = null;
    pointsDup = null;
    widthsDup = null;
    indices = null;
    pointBuffer.destroy();
    widthBuffer.destroy();
    elements.destroy();
  };

  const draw = ({
    projection: newProjection,
    model: newModel,
    view: newView,
  } = {}) => {
    // cache the view-defining matrices
    if (newProjection) {
      projection = newProjection;
    }
    if (newModel) {
      model = newModel;
    }
    if (newView) {
      view = newView;
    }
    // only draw when some points have been specified
    if (points && points.length > 1) {
      drawLine({ projection, model, view });
    }
  };

  const getPerPointProperty = (property, newValues) => {
    const flatNewValues = newValues.flat(2);

    if (flatNewValues.length === numPoints) {
      return flatNewValues;
    } else if (flatNewValues.length === numLines) {
      return numPointsPerLine
        .map((n, i) => Array(n).fill(flatNewValues[i]))
        .flat();
    }

    return property;
  };

  const getPoints = () => points;

  const setPoints = (
    newPoints = [],
    {
      colorIndices: newColorIndices = colorIndices,
      opacities: newOpacities = opacities,
      widths: newWidths = widths,
      is2d: newIs2d = is2d,
    } = {}
  ) => {
    points = newPoints;
    is2d = newIs2d;
    dim = is2d ? 2 : 3;

    numLines = Array.isArray(points[0]) ? points.length : 1;
    numPointsPerLine =
      numLines > 1
        ? points.map((pts) => Math.floor(pts.length / dim))
        : [Math.floor(points.length / dim)];
    numPoints = numPointsPerLine.reduce((n, nPts) => n + nPts, 0);

    colorIndices = getPerPointProperty(colorIndices, newColorIndices);
    opacities = getPerPointProperty(opacities, newOpacities);
    widths = getPerPointProperty(widths, newWidths);

    if (points && numPoints > 1) {
      prepare();
    } else {
      clear();
    }
  };

  const getNestedness = (arr, level = -1) => {
    if (!Array.isArray(arr)) return level;
    if (arr.length && !Array.isArray(arr[0])) return level + 1;
    return getNestedness(arr[0], ++level);
  };

  const createColorTexture = () => {
    const colors = getNestedness(color) === 0 ? [color] : color;

    colorTexRes = Math.max(2, Math.ceil(Math.sqrt(colors.length)));
    const rgba = new Uint8Array(colorTexRes ** 2 * 4);

    colors.forEach((color, i) => {
      rgba[i * 4] = Math.min(255, Math.max(0, Math.round(color[0] * 255))); // r
      rgba[i * 4 + 1] = Math.min(255, Math.max(0, Math.round(color[1] * 255))); // g
      rgba[i * 4 + 2] = Math.min(255, Math.max(0, Math.round(color[2] * 255))); // b
      rgba[i * 4 + 3] = Number.isNaN(+color[3])
        ? 255
        : Math.min(255, Math.max(0, Math.round(color[3] * 255))); // a
    });

    colorTex = regl.texture({
      data: rgba,
      shape: [colorTexRes, colorTexRes, 4],
    });
  };

  const setColor = (newColor, newOpacity = opacity) => {
    color = newColor;
    opacity = newOpacity;
    if (colorTex) colorTex.destroy();
    createColorTexture();
  };

  const getStyle = () => ({ color, miter, width });

  const setStyle = ({
    color: newColor,
    opacity: newOpacity,
    miter: newMiter,
    width: newWidth,
  } = {}) => {
    if (newColor) setColor(newColor, newOpacity);
    if (newMiter) miter = newMiter;
    if (+newWidth > 0) width = newWidth;
  };

  const getBuffer = () => ({
    points: pointBuffer,
    widths: widthBuffer,
    opacities: opacityBuffer,
    colorIndices: colorIndexBuffer,
  });

  const getData = () => ({
    points: pointsDup,
    widths: widthsDup,
    opacities: opacitiesDup,
    colorIndices: colorIndicesDup,
  });

  // initialize parameters
  init();
  createColorTexture();

  // prepare data if points are already specified
  if (points && points.length > 1) {
    setPoints(points);
  }

  return {
    clear,
    destroy,
    draw,
    getPoints,
    setPoints,
    getData,
    getBuffer,
    getStyle,
    setStyle,
  };
};

// @flekschas/utils v0.29.0 Copyright 2021 Fritz Lekschas
/* eslint no-param-reassign:0 */

/**
 * Cubic in easing function
 * @param {number} t - The input time to be eased. Must be in [0, 1] where `0`
 *   refers to the start and `1` to the end
 * @return {number} The eased time
 */
const cubicIn = (t) => t * t * t;

/**
 * Cubic in and out easing function
 * @param {number} t - The input time to be eased. Must be in [0, 1] where `0`
 *   refers to the start and `1` to the end
 * @return {number} The eased time
 */
const cubicInOut = (t) =>
  t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

/**
 * Cubic out easing function
 * @param {number} t - The input time to be eased. Must be in [0, 1] where `0`
 *   refers to the start and `1` to the end
 * @return {number} The eased time
 */
const cubicOut = (t) => --t * t * t + 1;

/**
 * Linear easing function
 * @param {number} t - The input time to be eased. Must be in [0, 1] where `0`
 *   refers to the start and `1` to the end
 * @return {number} Same as the input
 */
const linear = (t) => t;

/**
 * Quadratic in easing function
 * @param {number} t - The input time to be eased. Must be in [0, 1] where `0`
 *   refers to the start and `1` to the end
 * @return {number} The eased time
 */
const quadIn = (t) => t * t;

/**
 * Quadratic in and out easing function
 * @param {number} t - The input time to be eased. Must be in [0, 1] where `0`
 *   refers to the start and `1` to the end
 * @return {number} The eased time
 */
const quadInOut = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

/**
 * Quadratic out easing function
 * @param {number} t - The input time to be eased. Must be in [0, 1] where `0`
 *   refers to the start and `1` to the end
 * @return {number} The eased time
 */
const quadOut = (t) => t * (2 - t);

/**
 * Identity function
 * @param   {*}  x  Any kind of value
 * @return  {*}  `x`
 */
const identity = (x) => x;

/**
 * Initialize an array of a certain length using a mapping function
 *
 * @description
 * This is equivalent to `Array(length).fill().map(mapFn)` but about 60% faster
 *
 * @param {number} length - Size of the array
 * @param {function} mapFn - Mapping function
 * @return {array} Initialized array
 */
const rangeMap = (length, mapFn = (x) => x) => {
  const out = [];
  for (let i = 0; i < length; i++) {
    out.push(mapFn(i, length));
  }
  return out;
};

/**
 * Get the unique union of two vectors of integers
 * @param {array} v - First vector of integers
 * @param {array} w - Second vector of integers
 * @return {array} Unique union of `v` and `w`
 */
const unionIntegers = (v, w) => {
  const a = [];
  v.forEach((x) => {
    a[x] = true;
  });
  w.forEach((x) => {
    a[x] = true;
  });
  return a.reduce((union, value, i) => {
    if (value) union.push(i);
    return union;
  }, []);
};

const assign = (target, ...sources) => {
  sources.forEach((source) => {
    // eslint-disable-next-line no-shadow
    const descriptors = Object.keys(source).reduce((descriptors, key) => {
      descriptors[key] = Object.getOwnPropertyDescriptor(source, key);
      return descriptors;
    }, {});

    // By default, Object.assign copies enumerable Symbols, too
    Object.getOwnPropertySymbols(source).forEach((symbol) => {
      const descriptor = Object.getOwnPropertyDescriptor(source, symbol);
      if (descriptor.enumerable) {
        descriptors[symbol] = descriptor;
      }
    });
    Object.defineProperties(target, descriptors);
  });
  return target;
};

/**
 * Convenience function to compose functions
 * @param {...function} fns - Array of functions
 * @return {function} The composed function
 */
const pipe = (...fns) =>
  /**
   * @param {*} x - Some value
   * @return {*} Output of the composed function
   */
  (x) => fns.reduce((y, f) => f(y), x);

/**
 * Assign a constructor to the object
 * @param {function} constructor - Constructor functions
 */
const withConstructor = (constructor) => (self) =>
  assign(
    {
      __proto__: {
        constructor,
      },
    },
    self
  );

/**
 * Assign a static property to an object
 * @param {string} name - Name of the property
 * @param {*} value - Static value
 */
const withStaticProperty = (name, value) => (self) =>
  assign(self, {
    get [name]() {
      return value;
    },
  });

/**
 * L2 distance between a pair of points
 *
 * @description
 * Identical but much faster than `l2Dist([fromX, fromY], [toX, toY])`
 *
 * @param {number} fromX - X coordinate of the first point
 * @param {number} fromY - Y coordinate of the first point
 * @param {number} toX - X coordinate of the second point
 * @param {number} toY - Y coordinate of the first point
 * @return {number} L2 distance
 */
const l2PointDist = (fromX, fromY, toX, toY) =>
  Math.sqrt((fromX - toX) ** 2 + (fromY - toY) ** 2);

/**
 * Create a worker from a function
 * @param {function} fn - Function to be turned into a worker
 * @return {Worker} Worker function
 */
const createWorker = (fn) =>
  new Worker(
    window.URL.createObjectURL(
      new Blob([`(${fn.toString()})()`], { type: 'text/javascript' })
    )
  );

/**
 * Get a promise that resolves after the next `n` animation frames
 * @param {number} n - Number of animation frames to wait
 * @return {Promise} A promise that resolves after the next `n` animation frames
 */
const nextAnimationFrame = (n = 1) =>
  new Promise((resolve) => {
    let i = 0;

    const raf = () =>
      requestAnimationFrame(() => {
        i++;
        if (i < n) raf();
        else resolve();
      });

    raf();
  });

/**
 * Throttle and debounce a function call
 *
 * Throttling a function call means that the function is called at most every
 * `interval` milliseconds no matter how frequently you trigger a call.
 * Debouncing a function call means that the function is called the earliest
 * after `finalWait` milliseconds wait time where the function was not called.
 * Combining the two ensures that the function is called at most every
 * `interval` milliseconds and is ensured to be called with the very latest
 * arguments after after `finalWait` milliseconds wait time at the end.
 *
 * The following imaginary scenario describes the behavior:
 *
 * MS | throttleTime=3 and debounceTime=3
 * 1. y(f, 3, 3)(args1) => f(args1) called
 * 2. y(f, 3, 3)(args2) => call ignored due to throttling
 * 3. y(f, 3, 3)(args3) => call ignored due to throttling
 * 4. y(f, 3, 3)(args4) => f(args4) called
 * 5. y(f, 3, 3)(args5) => all ignored due to throttling
 * 6. No call           => nothing
 * 7. No call           => f(args5) called due to debouncing
 *
 * @param {functon} func - Function to be throttled and debounced
 * @param {number} interval - Throttle intevals in milliseconds
 * @param {number} wait - Debounce wait time in milliseconds By default this is
 *   the same as `interval`.
 * @return {function} - Throttled and debounced function
 */
const throttleAndDebounce = (fn, throttleTime, debounceTime = null) => {
  let timeout;
  let blockedCalls = 0;

  // eslint-disable-next-line no-param-reassign
  debounceTime = debounceTime === null ? throttleTime : debounceTime;

  const debounced = (...args) => {
    const later = () => {
      // Since we throttle and debounce we should check whether there were
      // actually multiple attempts to call this function after the most recent
      // throttled call. If there were no more calls we don't have to call
      // the function again.
      if (blockedCalls > 0) {
        fn(...args);
        blockedCalls = 0;
      }
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, debounceTime);
  };

  let isWaiting = false;
  const throttledAndDebounced = (...args) => {
    if (!isWaiting) {
      fn(...args);
      debounced(...args);

      isWaiting = true;
      blockedCalls = 0;

      setTimeout(() => {
        isWaiting = false;
      }, throttleTime);
    } else {
      blockedCalls++;
      debounced(...args);
    }
  };

  throttledAndDebounced.reset = () => {
    isWaiting = false;
  };

  throttledAndDebounced.cancel = () => {
    clearTimeout(timeout);
  };

  throttledAndDebounced.now = (...args) => fn(...args);

  return throttledAndDebounced;
};

/**
 * Promise that resolves after some time
 * @param {number} msec - Time in milliseconds until the promise is resolved
 * @return {Promise} Promise resolving after `msec` milliseconds
 */
const wait = (msec) =>
  new Promise((resolve) => setTimeout(resolve, msec));

const AUTO = 'auto';

const COLOR_NORMAL_IDX = 0;
const COLOR_ACTIVE_IDX = 1;
const COLOR_HOVER_IDX = 2;
const COLOR_BG_IDX = 3;
const COLOR_NUM_STATES = 4;
const FLOAT_BYTES = Float32Array.BYTES_PER_ELEMENT;
const GL_EXTENSIONS = [
  'OES_texture_float',
  'OES_element_index_uint',
  'WEBGL_color_buffer_float',
  'EXT_float_blend',
];
const CLEAR_OPTIONS = {
  color: [0, 0, 0, 0], // Transparent background color
  depth: 1,
};

const MOUSE_MODE_PANZOOM = 'panZoom';
const MOUSE_MODE_LASSO = 'lasso';
const MOUSE_MODE_ROTATE = 'rotate';
const MOUSE_MODES = [
  MOUSE_MODE_PANZOOM,
  MOUSE_MODE_LASSO,
  MOUSE_MODE_ROTATE,
];
const DEFAULT_MOUSE_MODE = MOUSE_MODE_PANZOOM;

// Easing
const EASING_FNS = {
  cubicIn,
  cubicInOut,
  cubicOut,
  linear,
  quadIn,
  quadInOut,
  quadOut,
};
const DEFAULT_EASING = cubicInOut;

// Default lasso
const LASSO_CLEAR_ON_DESELECT = 'deselect';
const LASSO_CLEAR_ON_END = 'lassoEnd';
const LASSO_CLEAR_EVENTS = [LASSO_CLEAR_ON_DESELECT, LASSO_CLEAR_ON_END];
const DEFAULT_LASSO_COLOR = [0, 0.666666667, 1, 1];
const DEFAULT_LASSO_LINE_WIDTH = 2;
const DEFAULT_LASSO_INITIATOR = false;
const DEFAULT_LASSO_MIN_DELAY$1 = 10;
const DEFAULT_LASSO_MIN_DIST$1 = 3;
const DEFAULT_LASSO_CLEAR_EVENT = LASSO_CLEAR_ON_END;

// Key mapping
const KEY_ACTION_LASSO = 'lasso';
const KEY_ACTION_ROTATE = 'rotate';
const KEY_ACTION_MERGE = 'merge';
const KEY_ACTIONS = [
  KEY_ACTION_LASSO,
  KEY_ACTION_ROTATE,
  KEY_ACTION_MERGE,
];
const KEY_ALT = 'alt';
const KEY_CMD = 'cmd';
const KEY_CTRL = 'ctrl';
const KEY_META = 'meta';
const KEY_SHIFT = 'shift';
const KEYS = [KEY_ALT, KEY_CMD, KEY_CTRL, KEY_META, KEY_SHIFT];
const DEFAULT_KEY_MAP = {
  [KEY_ALT]: KEY_ACTION_ROTATE,
  [KEY_SHIFT]: KEY_ACTION_LASSO,
  [KEY_CMD]: KEY_ACTION_MERGE,
};

// Default attribute
const DEFAULT_DATA_ASPECT_RATIO = 1;
const DEFAULT_WIDTH = AUTO;
const DEFAULT_HEIGHT = AUTO;
const DEFAULT_GAMMA = 1;

// Default styles
const MIN_POINT_SIZE = 1;
const DEFAULT_POINT_SIZE = 6;
const DEFAULT_POINT_SIZE_SELECTED = 2;
const DEFAULT_POINT_OUTLINE_WIDTH = 2;
const DEFAULT_SIZE_BY = null;
const DEFAULT_POINT_CONNECTION_SIZE = 2;
const DEFAULT_POINT_CONNECTION_SIZE_ACTIVE = 2;
const DEFAULT_POINT_CONNECTION_SIZE_BY = null;
const DEFAULT_POINT_CONNECTION_OPACITY = null;
const DEFAULT_POINT_CONNECTION_OPACITY_BY = null;
const DEFAULT_POINT_CONNECTION_OPACITY_ACTIVE = 0.66;
const DEFAULT_OPACITY = 1;
const DEFAULT_OPACITY_BY = null;
const DEFAULT_OPACITY_BY_DENSITY_FILL = 0.15;
const DEFAULT_OPACITY_BY_DENSITY_DEBOUNCE_TIME = 25;
const DEFAULT_OPACITY_INACTIVE_MAX = 1;
const DEFAULT_OPACITY_INACTIVE_SCALE = 1;
const DEFAULT_COLOR_BY = null;
const DEFAULT_COLOR_NORMAL = [0.66, 0.66, 0.66, DEFAULT_OPACITY];
const DEFAULT_COLOR_ACTIVE = [0, 0.55, 1, 1];
const DEFAULT_COLOR_HOVER = [1, 1, 1, 1];
const DEFAULT_COLOR_BG = [0, 0, 0, 1];
const DEFAULT_POINT_CONNECTION_COLOR_BY = null;
const DEFAULT_POINT_CONNECTION_COLOR_NORMAL = [0.66, 0.66, 0.66, 0.2];
const DEFAULT_POINT_CONNECTION_COLOR_ACTIVE = [0, 0.55, 1, 1];
const DEFAULT_POINT_CONNECTION_COLOR_HOVER = [1, 1, 1, 1];

// Default view
const DEFAULT_TARGET = [0, 0];
const DEFAULT_DISTANCE = 1;
const DEFAULT_ROTATION = 0;
// prettier-ignore
const DEFAULT_VIEW = new Float32Array([
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1
]);

// Default misc
const DEFAULT_BACKGROUND_IMAGE = null;
const DEFAULT_SHOW_RETICLE = false;
const DEFAULT_RETICLE_COLOR = [1, 1, 1, 0.5];
const DEFAULT_DESELECT_ON_DBL_CLICK = true;
const DEFAULT_DESELECT_ON_ESCAPE = true;
const DEFAULT_SHOW_POINT_CONNECTIONS = false;
const DEFAULT_POINT_CONNECTION_MAX_INT_POINTS_PER_SEGMENT = 100;
const DEFAULT_POINT_CONNECTION_INT_POINTS_TOLERANCE = 1 / 500;
const DEFAULT_POINT_SIZE_MOUSE_DETECTION = 'auto';
const DEFAULT_PERFORMANCE_MODE = false;
const SINGLE_CLICK_DELAY = 200;
const LONG_CLICK_TIME = 500;
const Z_NAMES = new Set(['z', 'valueZ', 'valueA', 'value1', 'category']);
const W_NAMES = new Set(['w', 'valueW', 'valueB', 'value2', 'value']);

/**
 * Check if all GL extensions are enabled and warn otherwise
 * @param   {import('regl').Regl}  regl  Regl instance to be tested
 * @return  {function}  Returns the Regl instance itself
 */
const checkReglExtensions = (regl) => {
  if (!regl) return false;
  return GL_EXTENSIONS.reduce((every, EXTENSION) => {
    if (!regl.hasExtension(EXTENSION)) {
      console.warn(
        `WebGL: ${EXTENSION} extension not supported. Scatterplot might not render properly`
      );
      return false;
    }
    return every;
  }, true);
};

/**
 * Create a new Regl instance with `GL_EXTENSIONS` enables
 * @param   {HTMLCanvasElement}  canvas  Canvas element to be rendered on
 * @return  {import('regl').Regl}  New Regl instance
 */
const createRegl = (canvas) => {
  const gl = canvas.getContext('webgl', {
    antialias: true,
    preserveDrawingBuffer: true,
  });
  const extensions = [];

  // Needed to run the tests properly as the headless-gl doesn't support all
  // extensions, which is fine for the functional tests.
  GL_EXTENSIONS.forEach((EXTENSION) => {
    if (gl.getExtension(EXTENSION)) {
      extensions.push(EXTENSION);
    } else {
      console.warn(
        `WebGL: ${EXTENSION} extension not supported. Scatterplot might not render properly`
      );
    }
  });

  return createOriginalRegl({ gl, extensions });
};

/**
 * L2 distance between a pair of 2D points
 * @param   {number}  x1  X coordinate of the first point
 * @param   {number}  y1  Y coordinate of the first point
 * @param   {number}  x2  X coordinate of the second point
 * @param   {number}  y2  Y coordinate of the first point
 * @return  {number}  L2 distance
 */
const dist = (x1, y1, x2, y2) =>
  Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);

/**
 * Get the bounding box of a set of 2D positions
 * @param   {array}  positions2d  2D positions to be checked
 * @return  {array}  Quadruple of form `[xMin, yMin, xMax, yMax]` defining the
 *  bounding box
 */
const getBBox = (positions2d) => {
  let xMin = Infinity;
  let xMax = -Infinity;
  let yMin = Infinity;
  let yMax = -Infinity;

  for (let i = 0; i < positions2d.length; i += 2) {
    xMin = positions2d[i] < xMin ? positions2d[i] : xMin;
    xMax = positions2d[i] > xMax ? positions2d[i] : xMax;
    yMin = positions2d[i + 1] < yMin ? positions2d[i + 1] : yMin;
    yMax = positions2d[i + 1] > yMax ? positions2d[i + 1] : yMax;
  }

  return [xMin, yMin, xMax, yMax];
};

/**
 * Convert a HEX-encoded color to an RGB-encoded color
 * @param   {string}  hex  HEX-encoded color string.
 * @param   {boolean}  isNormalize  If `true` the returned RGB values will be
 *   normalized to `[0,1]`.
 * @return  {array}  Triple holding the RGB values.
 */
const hexToRgb = (hex, isNormalize = false) =>
  hex
    .replace(
      /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
      (m, r, g, b) => `#${r}${r}${g}${g}${b}${b}`
    )
    .substring(1)
    .match(/.{2}/g)
    .map((x) => parseInt(x, 16) / 255 ** isNormalize);

const isConditionalArray = (a, condition, { minLength = 0 } = {}) =>
  Array.isArray(a) && a.length >= minLength && a.every(condition);

const isPositiveNumber = (x) => !Number.isNaN(+x) && +x >= 0;

const isStrictlyPositiveNumber = (x) => !Number.isNaN(+x) && +x > 0;

/**
 * Create a function to limit choices to a predefined list
 * @param   {array}  choices  Array of acceptable choices
 * @param   {*}  defaultOption  Default choice
 * @return  {function}  Function limiting the choices
 */
const limit = (choices, defaultChoice) => (choice) =>
  choices.indexOf(choice) >= 0 ? choice : defaultChoice;

/**
 * Promised-based image loading
 * @param {string}  src  Remote image source, i.e., a URL
 * @param {boolean} isCrossOrigin If `true` allow loading image from a source of another origin.
 * @return  {Promise<HTMLImageElement>}  Promise resolving to the image once its loaded
 */
const loadImage = (src, isCrossOrigin = false) =>
  new Promise((accept, reject) => {
    const image = new Image();
    if (isCrossOrigin) image.crossOrigin = 'anonymous';
    image.src = src;
    image.onload = () => {
      accept(image);
    };
    image.onerror = (error) => {
      reject(error);
    };
  });

/**
 * @deprecated Please use `scatterplot.createTextureFromUrl(url)`
 *
 * Create a Regl texture from an URL.
 * @param   {import('regl').Regl}  regl  Regl instance used for creating the texture.
 * @param   {string}  url  Source URL of the image.
 * @return  {Promise<import('regl').Texture2D>}  Promise resolving to the texture object.
 */
const createTextureFromUrl = (regl, url) =>
  new Promise((resolve, reject) => {
    loadImage(
      url,
      url.indexOf(window.location.origin) !== 0 && url.indexOf('base64') === -1
    )
      .then((image) => {
        resolve(regl.texture(image));
      })
      .catch((error) => {
        reject(error);
      });
  });

/**
 * Convert a HEX-encoded color to an RGBA-encoded color
 * @param   {string}  hex  HEX-encoded color string.
 * @param   {boolean}  isNormalize  If `true` the returned RGBA values will be
 *   normalized to `[0,1]`.
 * @return  {array}  Triple holding the RGBA values.
 */
const hexToRgba = (hex, isNormalize = false) => [
  ...hexToRgb(hex, isNormalize),
  255 ** !isNormalize,
];

/**
 * Tests if a string is a valid HEX color encoding
 * @param   {string}  hex  HEX-encoded color string.
 * @return  {boolean}  If `true` the string is a valid HEX color encoding.
 */
const isHex = (hex) => /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(hex);

/**
 * Tests if a number is in `[0,1]`.
 * @param   {number}  x  Number to be tested.
 * @return  {boolean}  If `true` the number is in `[0,1]`.
 */
const isNormFloat = (x) => x >= 0 && x <= 1;

/**
 * Tests if an array consist of normalized numbers that are in `[0,1]` only.
 * @param   {array}  a  Array to be tested
 * @return  {boolean}  If `true` the array contains only numbers in `[0,1]`.
 */
const isNormFloatArray = (a) => Array.isArray(a) && a.every(isNormFloat);

/**
 * From: https://wrf.ecse.rpi.edu//Research/Short_Notes/pnpoly.html
 * @param   {Array}  point  Tuple of the form `[x,y]` to be tested.
 * @param   {Array}  polygon  1D list of vertices defining the polygon.
 * @return  {boolean}  If `true` point lies within the polygon.
 */
const isPointInPolygon = (polygon, [px, py] = []) => {
  let x1;
  let y1;
  let x2;
  let y2;
  let isWithin = false;
  for (let i = 0, j = polygon.length - 2; i < polygon.length; i += 2) {
    x1 = polygon[i];
    y1 = polygon[i + 1];
    x2 = polygon[j];
    y2 = polygon[j + 1];
    if (y1 > py !== y2 > py && px < ((x2 - x1) * (py - y1)) / (y2 - y1) + x1)
      isWithin = !isWithin;
    j = i;
  }
  return isWithin;
};

/**
 * Tests if a variable is a string
 * @param   {*}  s  Variable to be tested
 * @return  {boolean}  If `true` variable is a string
 */
const isString = (s) => typeof s === 'string' || s instanceof String;

/**
 * Tests if a number is an interger and in `[0,255]`.
 * @param   {number}  x  Number to be tested.
 * @return  {boolean}  If `true` the number is an interger and in `[0,255]`.
 */
const isUint8 = (x) => Number.isInteger(x) && x >= 0 && x <= 255;

/**
 * Tests if an array consist of Uint8 numbers only.
 * @param   {array}  a  Array to be tested.
 * @return  {boolean}  If `true` the array contains only Uint8 numbers.
 */
const isUint8Array = (a) => Array.isArray(a) && a.every(isUint8);

/**
 * Tests if an array is encoding an RGB color.
 * @param   {array}  rgb  Array to be tested
 * @return  {boolean}  If `true` the array hold a triple of Uint8 numbers or
 *   a triple of normalized floats.
 */
const isRgb = (rgb) =>
  rgb.length === 3 && (isNormFloatArray(rgb) || isUint8Array(rgb));

/**
 * Tests if an array is encoding an RGBA color.
 * @param   {array}  rgb  Array to be tested
 * @return  {boolean}  If `true` the array hold a quadruple of Uint8 numbers or
 *   a quadruple of normalized floats.
 */
const isRgba = (rgba) =>
  rgba.length === 4 && (isNormFloatArray(rgba) || isUint8Array(rgba));

/**
 * Test if a color is multiple colors
 * @param   {*}  color  To be tested
 * @return  {boolean}  If `true`, `color` is an array of colors.
 */
const isMultipleColors = (color) =>
  Array.isArray(color) &&
  color.length &&
  (Array.isArray(color[0]) || isString(color[0]));

/**
 * Fast version of `Math.max`. Based on
 *   https://jsperf.com/math-min-max-vs-ternary-vs-if/24 `Math.max` is not
 *   very fast
 * @param   {number}  a  Value A
 * @param   {number}  b  Value B
 * @return  {boolean}  If `true` A is greater than B.
 */
const max = (a, b) => (a > b ? a : b);

/**
 * Fast version of `Math.min`. Based on
 *   https://jsperf.com/math-min-max-vs-ternary-vs-if/24 `Math.max` is not
 *   very fast
 * @param   {number}  a  Value A
 * @param   {number}  b  Value B
 * @return  {boolean}  If `true` A is smaller than B.
 */
const min = (a, b) => (a < b ? a : b);

/**
 * Convert a color to an RGBA color
 * @param   {*}  color  Color to be converted. Currently supports:
 *   HEX, RGB, or RGBA.
 * @param   {boolean}  isNormalize  If `true` the returned RGBA values will be
 *   normalized to `[0,1]`.
 * @return  {array}  Quadruple defining an RGBA color.
 */
const toRgba = (color, shouldNormalize) => {
  if (isRgba(color)) {
    const isNormalized = isNormFloatArray(color);
    if (
      (shouldNormalize && isNormalized) ||
      (!shouldNormalize && !isNormalized)
    )
      return color;
    if (shouldNormalize && !isNormalized) return color.map((x) => x / 255);
    return color.map((x) => x * 255);
  }

  if (isRgb(color)) {
    const base = 255 ** !shouldNormalize;
    const isNormalized = isNormFloatArray(color);

    if (
      (shouldNormalize && isNormalized) ||
      (!shouldNormalize && !isNormalized)
    )
      return [...color, base];
    if (shouldNormalize && !isNormalized)
      return [...color.map((x) => x / 255), base];
    return [...color.map((x) => x * 255), base];
  }

  if (isHex(color)) return hexToRgba(color, shouldNormalize);

  console.warn(
    'Only HEX, RGB, and RGBA are handled by this function. Returning white instead.'
  );
  return shouldNormalize ? [1, 1, 1, 1] : [255, 255, 255, 255];
};

/**
 * Flip the key-value pairs of an object
 * @param {object} obj - Object to be flipped
 * @return {object} Flipped object
 */
const flipObj = (obj) =>
  Object.entries(obj).reduce((out, [key, value]) => {
    if (out[value]) {
      out[value] = [...out[value], key];
    } else {
      out[value] = key;
    }
    return out;
  }, {});

const rgbBrightness = (rgb) =>
  0.21 * rgb[0] + 0.72 * rgb[1] + 0.07 * rgb[2];

const createRenderer = (options = {}) => {
  let {
    regl,
    canvas = document.createElement('canvas'),
    gamma = DEFAULT_GAMMA,
  } = options;

  checkReglExtensions(regl);

  // Same as regl ||= createRegl(canvas) but avoids having to rely on
  // https://babeljs.io/docs/en/babel-plugin-proposal-logical-assignment-operators
  // eslint-disable-next-line no-unused-expressions
  regl || (regl = createRegl(canvas));

  const fboRes = [canvas.width, canvas.height];
  const fbo = regl.framebuffer({
    width: fboRes[0],
    height: fboRes[1],
    colorFormat: 'rgba',
    colorType: 'float',
  });

  /**
   * Render the float32 framebuffer to the internal canvas
   *
   * From https://observablehq.com/@rreusser/selecting-the-right-opacity-for-2d-point-clouds
   */
  const renderToCanvas = regl({
    vert: `
      precision highp float;
      attribute vec2 xy;
      void main () {
        gl_Position = vec4(xy, 0, 1);
      }`,
    frag: `
      precision highp float;
      uniform vec2 srcRes;
      uniform sampler2D src;
      uniform float gamma;

      vec3 approxLinearToSRGB (vec3 rgb, float gamma) {
        return pow(clamp(rgb, vec3(0), vec3(1)), vec3(1.0 / gamma));
      }

      void main () {
        vec4 color = texture2D(src, gl_FragCoord.xy / srcRes);
        gl_FragColor = vec4(approxLinearToSRGB(color.rgb, gamma), color.a);
      }`,
    attributes: {
      xy: [-4, -4, 4, -4, 0, 4],
    },
    uniforms: {
      src: () => fbo,
      srcRes: () => fboRes,
      gamma: () => gamma,
    },
    count: 3,
    depth: { enable: false },
    blend: {
      enable: true,
      func: {
        srcRGB: 'one',
        srcAlpha: 'one',
        dstRGB: 'one minus src alpha',
        dstAlpha: 'one minus src alpha',
      },
    },
  });

  /**
   * Copy the pixels from the internal canvas onto the target canvas
   */
  const copyTo = (targetCanvas) => {
    const ctx = targetCanvas.getContext('2d');
    ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
    ctx.drawImage(
      canvas,
      (canvas.width - targetCanvas.width) / 2,
      (canvas.height - targetCanvas.height) / 2,
      targetCanvas.width,
      targetCanvas.height,
      0,
      0,
      targetCanvas.width,
      targetCanvas.height
    );
  };

  const render = (draw, targetCanvas) => {
    // Clear internal canvas
    regl.clear(CLEAR_OPTIONS);
    fbo.use(() => {
      // Clear framebuffer
      regl.clear(CLEAR_OPTIONS);
      draw(
        targetCanvas.width / canvas.width,
        targetCanvas.height / canvas.height
      );
    });
    renderToCanvas();
    copyTo(targetCanvas);
  };

  /**
   * Update Regl's viewport, drawingBufferWidth, and drawingBufferHeight
   *
   * @description Call this method after the viewport has changed, e.g., width
   * or height have been altered
   */
  const refresh = () => {
    regl.poll();
  };

  const drawFns = new Set();

  const onFrame = (draw) => {
    drawFns.add(draw);
    return () => {
      drawFns.delete(draw);
    };
  };

  const frame = regl.frame(() => {
    const iterator = drawFns.values();
    let result = iterator.next();
    while (!result.done) {
      result.value(); // The draw function
      result = iterator.next();
    }
  });

  const resize = () => {
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    fboRes[0] = canvas.width;
    fboRes[1] = canvas.height;
    fbo.resize(...fboRes);
  };

  if (!options.canvas) {
    window.addEventListener('resize', resize);
    window.addEventListener('orientationchange', resize);
    resize();
  }

  const destroy = () => {
    frame.cancel();
    canvas = undefined;
    regl = undefined;
    window.removeEventListener('resize', resize);
    window.removeEventListener('orientationchange', resize);
  };

  return {
    get canvas() {
      return canvas;
    },
    get regl() {
      return regl;
    },
    get gamma() {
      return gamma;
    },
    set gamma(newGamma) {
      gamma = +newGamma;
    },
    render,
    onFrame,
    refresh,
    destroy,
  };
};

const DEFAULT_LASSO_START_INITIATOR_SHOW = true;
const DEFAULT_LASSO_MIN_DELAY = 8;
const DEFAULT_LASSO_MIN_DIST = 2;
const LASSO_SHOW_START_INITIATOR_TIME = 2500;
const LASSO_HIDE_START_INITIATOR_TIME = 250;

const ifNotNull = (v, alternative = null) => (v === null ? alternative : v);

const lassoStyleEl = document.createElement('style');
document.head.appendChild(lassoStyleEl);

const lassoStylesheets = lassoStyleEl.sheet;

const addRule = (rule) => {
  const currentNumRules = lassoStylesheets.rules.length;
  lassoStylesheets.insertRule(rule, currentNumRules);
  return currentNumRules;
};

const removeRule = (index) => {
  lassoStylesheets.deleteRule(index);
};

const inAnimation = `${LASSO_SHOW_START_INITIATOR_TIME}ms ease scaleInFadeOut 0s 1 normal backwards`;

const createInAnimationRule = (opacity, scale, rotate) => `
@keyframes scaleInFadeOut {
  0% {
    opacity: ${opacity};
    transform: translate(-50%,-50%) scale(${scale}) rotate(${rotate}deg);
  }
  10% {
    opacity: 1;
    transform: translate(-50%,-50%) scale(1) rotate(${rotate + 20}deg);
  }
  100% {
    opacity: 0;
    transform: translate(-50%,-50%) scale(0.9) rotate(${rotate + 60}deg);
  }
}
`;
let inAnimationRuleIndex = null;

const outAnimation = `${LASSO_HIDE_START_INITIATOR_TIME}ms ease fadeScaleOut 0s 1 normal backwards`;

const createOutAnimationRule = (opacity, scale, rotate) => `
@keyframes fadeScaleOut {
  0% {
    opacity: ${opacity};
    transform: translate(-50%,-50%) scale(${scale}) rotate(${rotate}deg);
  }
  100% {
    opacity: 0;
    transform: translate(-50%,-50%) scale(0) rotate(${rotate}deg);
  }
}
`;
let outAnimationRuleIndex = null;

const createLasso = (
  element,
  {
    onDraw: initialOnDraw = identity,
    onStart: initialOnStart = identity,
    onEnd: initialOnEnd = identity,
    enableInitiator:
      initialenableInitiator = DEFAULT_LASSO_START_INITIATOR_SHOW,
    initiatorParentElement: initialinitiatorParentElement = document.body,
    minDelay: initialMinDelay = DEFAULT_LASSO_MIN_DELAY,
    minDist: initialMinDist = DEFAULT_LASSO_MIN_DIST,
    pointNorm: initialPointNorm = identity,
  } = {}
) => {
  let enableInitiator = initialenableInitiator;
  let initiatorParentElement = initialinitiatorParentElement;

  let onDraw = initialOnDraw;
  let onStart = initialOnStart;
  let onEnd = initialOnEnd;

  let pointNorm = initialPointNorm;

  const initiator = document.createElement('div');
  const id =
    Math.random().toString(36).substring(2, 5) +
    Math.random().toString(36).substring(2, 5);
  initiator.id = `lasso-initiator-${id}`;
  initiator.style.position = 'fixed';
  initiator.style.display = 'flex';
  initiator.style.justifyContent = 'center';
  initiator.style.alignItems = 'center';
  initiator.style.zIndex = 99;
  initiator.style.width = '4rem';
  initiator.style.height = '4rem';
  initiator.style.borderRadius = '4rem';
  initiator.style.opacity = 0.5;
  initiator.style.transform = 'translate(-50%,-50%) scale(0) rotate(0deg)';

  let isMouseDown = false;
  let isLasso = false;
  let lassoPos = [];
  let lassoPosFlat = [];
  let lassoPrevMousePos;

  const mouseUpHandler = () => {
    isMouseDown = false;
  };

  const getMousePosition = (event) => {
    const { left, top } = element.getBoundingClientRect();

    return [event.clientX - left, event.clientY - top];
  };

  window.addEventListener('mouseup', mouseUpHandler);

  const resetinitiatorStyle = () => {
    initiator.style.opacity = 0.5;
    initiator.style.transform = 'translate(-50%,-50%) scale(0) rotate(0deg)';
  };

  const getCurrentinitiatorAnimationStyle = () => {
    const computedStyle = getComputedStyle(initiator);
    const opacity = +computedStyle.opacity;
    // The css rule `transform: translate(-1, -1) scale(0.5);` is represented as
    // `matrix(0.5, 0, 0, 0.5, -1, -1)`
    const m = computedStyle.transform.match(/([0-9.-]+)+/g);

    const a = +m[0];
    const b = +m[1];

    const scale = Math.sqrt(a * a + b * b);
    const rotate = Math.atan2(b, a) * (180 / Math.PI);

    return { opacity, scale, rotate };
  };

  const showInitiator = (event) => {
    if (!enableInitiator) return;

    wait(0).then(() => {
      const x = event.clientX;
      const y = event.clientY;

      if (isMouseDown) return;

      let opacity = 0.5;
      let scale = 0;
      let rotate = 0;

      const style = getCurrentinitiatorAnimationStyle();
      opacity = style.opacity;
      scale = style.scale;
      rotate = style.rotate;
      initiator.style.opacity = opacity;
      initiator.style.transform = `translate(-50%,-50%) scale(${scale}) rotate(${rotate}deg)`;

      initiator.style.animation = 'none';

      // See https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Tips
      // why we need to wait for two animation frames
      nextAnimationFrame(2).then(() => {
        initiator.style.top = `${y}px`;
        initiator.style.left = `${x}px`;

        if (inAnimationRuleIndex !== null) removeRule(inAnimationRuleIndex);

        inAnimationRuleIndex = addRule(
          createInAnimationRule(opacity, scale, rotate)
        );

        initiator.style.animation = inAnimation;

        nextAnimationFrame().then(() => {
          resetinitiatorStyle();
        });
      });
    });
  };

  const hideInitiator = () => {
    const { opacity, scale, rotate } = getCurrentinitiatorAnimationStyle();
    initiator.style.opacity = opacity;
    initiator.style.transform = `translate(-50%,-50%) scale(${scale}) rotate(${rotate}deg)`;

    initiator.style.animation = 'none';

    nextAnimationFrame(2).then(() => {
      if (outAnimationRuleIndex !== null) removeRule(outAnimationRuleIndex);

      outAnimationRuleIndex = addRule(
        createOutAnimationRule(opacity, scale, rotate)
      );

      initiator.style.animation = outAnimation;

      nextAnimationFrame().then(() => {
        resetinitiatorStyle();
      });
    });
  };

  const draw = () => {
    onDraw(lassoPos, lassoPosFlat);
  };

  const extend = (currMousePos) => {
    if (!lassoPrevMousePos) {
      if (!isLasso) {
        isLasso = true;
        onStart();
      }
      lassoPrevMousePos = currMousePos;
      const point = pointNorm(currMousePos);
      lassoPos = [point];
      lassoPosFlat = [point[0], point[1]];
    } else {
      const d = l2PointDist(
        currMousePos[0],
        currMousePos[1],
        lassoPrevMousePos[0],
        lassoPrevMousePos[1]
      );

      if (d > DEFAULT_LASSO_MIN_DIST) {
        lassoPrevMousePos = currMousePos;
        const point = pointNorm(currMousePos);
        lassoPos.push(point);
        lassoPosFlat.push(point[0], point[1]);
        if (lassoPos.length > 1) {
          draw();
        }
      }
    }
  };

  const extendDb = throttleAndDebounce(
    extend,
    DEFAULT_LASSO_MIN_DELAY,
    DEFAULT_LASSO_MIN_DELAY
  );

  const extendPublic = (event, debounced) => {
    const mousePosition = getMousePosition(event);
    if (debounced) return extendDb(mousePosition);
    return extend(mousePosition);
  };

  const clear = () => {
    lassoPos = [];
    lassoPosFlat = [];
    lassoPrevMousePos = undefined;
    draw();
  };

  const initiatorClickHandler = (event) => {
    showInitiator(event);
  };

  const initiatorMouseDownHandler = () => {
    isMouseDown = true;
    isLasso = true;
    clear();
    onStart();
  };

  const initiatorMouseLeaveHandler = () => {
    hideInitiator();
  };

  const end = ({ merge = false } = {}) => {
    isLasso = false;

    const currLassoPos = [...lassoPos];
    const currLassoPosFlat = [...lassoPosFlat];

    extendDb.cancel();

    clear();

    // When `currLassoPos` is empty the user didn't actually lasso
    if (currLassoPos.length) onEnd(currLassoPos, currLassoPosFlat, { merge });

    return currLassoPos;
  };

  const set = ({
    onDraw: newOnDraw = null,
    onStart: newOnStart = null,
    onEnd: newOnEnd = null,
    enableInitiator: newEnableInitiator = null,
    initiatorParentElement: newInitiatorParentElement = null,
    minDelay: newMinDelay = null,
    minDist: newMinDist = null,
    pointNorm: newPointNorm = null,
  } = {}) => {
    onDraw = ifNotNull(newOnDraw, onDraw);
    onStart = ifNotNull(newOnStart, onStart);
    onEnd = ifNotNull(newOnEnd, onEnd);
    enableInitiator = ifNotNull(newEnableInitiator, enableInitiator);
    pointNorm = ifNotNull(newPointNorm, pointNorm);

    if (
      newInitiatorParentElement !== null &&
      newInitiatorParentElement !== initiatorParentElement
    ) {
      initiatorParentElement.removeChild(initiator);
      newInitiatorParentElement.appendChild(initiator);
      initiatorParentElement = newInitiatorParentElement;
    }

    if (enableInitiator) {
      initiator.addEventListener('click', initiatorClickHandler);
      initiator.addEventListener('mousedown', initiatorMouseDownHandler);
      initiator.addEventListener('mouseleave', initiatorMouseLeaveHandler);
    } else {
      initiator.removeEventListener('mousedown', initiatorMouseDownHandler);
      initiator.removeEventListener('mouseleave', initiatorMouseLeaveHandler);
    }
  };

  const destroy = () => {
    initiatorParentElement.removeChild(initiator);
    window.removeEventListener('mouseup', mouseUpHandler);
    initiator.removeEventListener('click', initiatorClickHandler);
    initiator.removeEventListener('mousedown', initiatorMouseDownHandler);
    initiator.removeEventListener('mouseleave', initiatorMouseLeaveHandler);
  };

  const withPublicMethods = () => (self) =>
    assign(self, {
      clear,
      destroy,
      end,
      extend: extendPublic,
      set,
      showInitiator,
      hideInitiator,
    });

  initiatorParentElement.appendChild(initiator);

  set({
    onDraw,
    onStart,
    onEnd,
    enableInitiator,
    initiatorParentElement,
  });

  return pipe(
    withStaticProperty('initiator', initiator),
    withPublicMethods(),
    withConstructor(createLasso)
  )({});
};

const FRAGMENT_SHADER$2 = `
precision mediump float;

uniform sampler2D texture;

varying vec2 uv;

void main () {
  gl_FragColor = texture2D(texture, uv);
}
`;

const VERTEX_SHADER = `
precision mediump float;

uniform mat4 modelViewProjection;

attribute vec2 position;

varying vec2 uv;

void main () {
  uv = position;
  gl_Position = modelViewProjection * vec4(-1.0 + 2.0 * uv.x, 1.0 - 2.0 * uv.y, 0, 1);
}
`;

const FRAGMENT_SHADER$1 = `
precision highp float;

varying vec4 color;
varying float finalPointSize;

float linearstep(float edge0, float edge1, float x) {
  return clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
}

void main() {
  vec2 c = gl_PointCoord * 2.0 - 1.0;
  float sdf = length(c) * finalPointSize;
  float alpha = linearstep(finalPointSize + 0.5, finalPointSize - 0.5, sdf);

  gl_FragColor = vec4(color.rgb, alpha * color.a);
}
`;

const FRAGMENT_SHADER = `precision highp float;

varying vec4 color;

void main() {
  gl_FragColor = color;
}
`;

const createVertexShader = (globalState) => `
precision highp float;

uniform sampler2D colorTex;
uniform float colorTexRes;
uniform float colorTexEps;
uniform sampler2D stateTex;
uniform float stateTexRes;
uniform float stateTexEps;
uniform float devicePixelRatio;
uniform sampler2D encodingTex;
uniform float encodingTexRes;
uniform float encodingTexEps;
uniform float pointSizeExtra;
uniform float pointOpacityMax;
uniform float pointOpacityScale;
uniform float numPoints;
uniform float globalState;
uniform float isColoredByZ;
uniform float isColoredByW;
uniform float isOpacityByZ;
uniform float isOpacityByW;
uniform float isOpacityByDensity;
uniform float isSizedByZ;
uniform float isSizedByW;
uniform float colorMultiplicator;
uniform float opacityMultiplicator;
uniform float opacityDensity;
uniform float sizeMultiplicator;
uniform float numColorStates;
uniform float pointScale;
uniform mat4 modelViewProjection;

attribute vec2 stateIndex;

varying vec4 color;
varying float finalPointSize;

void main() {
  vec4 state = texture2D(stateTex, stateIndex);

  gl_Position = modelViewProjection * vec4(state.x, state.y, 0.0, 1.0);

  // Determine color index
  float colorIndexZ =  isColoredByZ * floor(state.z * colorMultiplicator);
  float colorIndexW =  isColoredByW * floor(state.w * colorMultiplicator);

  // Multiply by the number of color states per color
  // I.e., normal, active, hover, background, etc.
  float colorIndex = (colorIndexZ + colorIndexW) * numColorStates;

  // Half a "pixel" or "texel" in texture coordinates
  float colorLinearIndex = colorIndex + globalState;

  // Need to add cEps here to avoid floating point issue that can lead to
  // dramatic changes in which color is loaded as floor(3/2.9999) = 1 but
  // floor(3/3.0001) = 0!
  float colorRowIndex = floor((colorLinearIndex + colorTexEps) / colorTexRes);

  vec2 colorTexIndex = vec2(
    (colorLinearIndex / colorTexRes) - colorRowIndex + colorTexEps,
    colorRowIndex / colorTexRes + colorTexEps
  );

  color = texture2D(colorTex, colorTexIndex);

  // Retrieve point size
  float pointSizeIndexZ = isSizedByZ * floor(state.z * sizeMultiplicator);
  float pointSizeIndexW = isSizedByW * floor(state.w * sizeMultiplicator);
  float pointSizeIndex = pointSizeIndexZ + pointSizeIndexW;

  float pointSizeRowIndex = floor((pointSizeIndex + encodingTexEps) / encodingTexRes);
  vec2 pointSizeTexIndex = vec2(
    (pointSizeIndex / encodingTexRes) - pointSizeRowIndex + encodingTexEps,
    pointSizeRowIndex / encodingTexRes + encodingTexEps
  );
  float pointSize = texture2D(encodingTex, pointSizeTexIndex).x;

  // Retrieve opacity
  ${
    (() => {
      // Drawing the inner border of selected points
      if (globalState === 3) return '';

      // Draw points with opacity encoding or dynamic opacity
      return `
        if (isOpacityByDensity < 0.5) {
          float opacityIndexZ = isOpacityByZ * floor(state.z * opacityMultiplicator);
          float opacityIndexW = isOpacityByW * floor(state.w * opacityMultiplicator);
          float opacityIndex = opacityIndexZ + opacityIndexW;

          float opacityRowIndex = floor((opacityIndex + encodingTexEps) / encodingTexRes);
          vec2 opacityTexIndex = vec2(
            (opacityIndex / encodingTexRes) - opacityRowIndex + encodingTexEps,
            opacityRowIndex / encodingTexRes + encodingTexEps
          );
          color.a = texture2D(encodingTex, opacityTexIndex)[${1 + globalState}];
        } else {
          color.a = min(1.0, opacityDensity + globalState);
        }
      `;
    })()
  }

  color.a = min(pointOpacityMax, color.a) * pointOpacityScale;
  finalPointSize = (pointSize * pointScale) + pointSizeExtra;
  gl_PointSize = finalPointSize;
}
`;

const SHADER$1 = `precision highp float;

uniform sampler2D startStateTex;
uniform sampler2D endStateTex;
uniform float t;

varying vec2 particleTextureIndex;

void main() {
  // Interpolate x, y, and value
  vec3 start = texture2D(startStateTex, particleTextureIndex).xyw;
  vec3 end = texture2D(endStateTex, particleTextureIndex).xyw;
  vec3 curr = start * (1.0 - t) + end * t;

  // The category cannot be interpolated
  float endCategory = texture2D(endStateTex, particleTextureIndex).z;

  gl_FragColor = vec4(curr.xy, endCategory, curr.z);
}`;

const SHADER = `precision highp float;

attribute vec2 position;
varying vec2 particleTextureIndex;

void main() {
  // map normalized device coords to texture coords
  particleTextureIndex = 0.5 * (1.0 + position);

  gl_Position = vec4(position, 0, 1);
}`;

/* eslint-env worker */
/* eslint no-restricted-globals: 1 */

const worker = function worker() {

  /**
   * Catmull-Rom interpolation
   * @param {number} t - Progress value
   * @param {array} p0 - First point
   * @param {array} p1 - Second point
   * @param {array} p2 - Third point
   * @param {array} p3 - Forth point
   * @return {number} Interpolated value
   */
  const catmullRom = (t, p0, p1, p2, p3) => {
    const v0 = (p2 - p0) * 0.5;
    const v1 = (p3 - p1) * 0.5;
    return (
      (2 * p1 - 2 * p2 + v0 + v1) * t * t * t +
      (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t * t +
      v0 * t +
      p1
    );
  };

  /**
   * Interpolate a point with Catmull-Rom
   * @param {number} t - Progress value
   * @param {array} points - Key points
   * @param {number}  maxPointIdx - Highest point index. Same as array.length - 1
   * @return {array} Interpolated point
   */
  const interpolatePoint = (t, points, maxPointIdx) => {
    const p = maxPointIdx * t;

    const intPoint = Math.floor(p);
    const weight = p - intPoint;

    const p0 = points[Math.max(0, intPoint - 1)];
    const p1 = points[intPoint];
    const p2 = points[Math.min(maxPointIdx, intPoint + 1)];
    const p3 = points[Math.min(maxPointIdx, intPoint + 2)];

    return [
      catmullRom(weight, p0[0], p1[0], p2[0], p3[0]),
      catmullRom(weight, p0[1], p1[1], p2[1], p3[1]),
    ];
  };

  /**
   * Square distance
   * @param {number} x1 - First x coordinate
   * @param {number} y1 - First y coordinate
   * @param {number} x2 - Second x coordinate
   * @param {number} y2 - Second y coordinate
   * @return {number} Distance
   */
  const sqDist = (x1, y1, x2, y2) => (x1 - x2) ** 2 + (y1 - y2) ** 2;

  /**
   * Douglas Peucker square segment distance
   * Implementation from https://github.com/mourner/simplify-js
   * @author Vladimir Agafonkin
   * @copyright Vladimir Agafonkin 2013
   * @license BSD
   * @param {array} p - Point
   * @param {array} p1 - First boundary point
   * @param {array} p2 - Second boundary point
   * @return {number} Distance
   */
  const sqSegDist = (p, p1, p2) => {
    let x = p1[0];
    let y = p1[1];
    let dx = p2[0] - x;
    let dy = p2[1] - y;

    if (dx !== 0 || dy !== 0) {
      const t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);

      if (t > 1) {
        x = p2[0];
        y = p2[1];
      } else if (t > 0) {
        x += dx * t;
        y += dy * t;
      }
    }

    dx = p[0] - x;
    dy = p[1] - y;

    return dx * dx + dy * dy;
  };

  /**
   * Douglas Peucker step function
   * Implementation from https://github.com/mourner/simplify-js
   * @author Vladimir Agafonkin
   * @copyright Vladimir Agafonkin 2013
   * @license BSD
   * @param   {[type]}  points  [description]
   * @param   {[type]}  first  [description]
   * @param   {[type]}  last  [description]
   * @param   {[type]}  tolerance  [description]
   * @param   {[type]}  simplified  [description]
   * @return  {[type]}  [description]
   */
  const simplifyDPStep = (points, first, last, tolerance, simplified) => {
    let maxDist = tolerance;
    let index;

    for (let i = first + 1; i < last; i++) {
      const dist = sqSegDist(points[i], points[first], points[last]);

      if (dist > maxDist) {
        index = i;
        maxDist = dist;
      }
    }

    if (maxDist > tolerance) {
      if (index - first > 1)
        simplifyDPStep(points, first, index, tolerance, simplified);
      simplified.push(points[index]);
      if (last - index > 1)
        simplifyDPStep(points, index, last, tolerance, simplified);
    }
  };

  /**
   * Douglas Peucker. Implementation from https://github.com/mourner/simplify-js
   * @author Vladimir Agafonkin
   * @copyright Vladimir Agafonkin 2013
   * @license BSD
   * @param {array} points - List of points to be simplified
   * @param {number} tolerance - Tolerance level. Points below this distance level will be ignored
   * @return {array} Simplified point list
   */
  const simplifyDouglasPeucker = (points, tolerance) => {
    const last = points.length - 1;
    const simplified = [points[0]];

    simplifyDPStep(points, 0, last, tolerance, simplified);
    simplified.push(points[last]);

    return simplified;
  };

  /**
   * Interpolate intermediate points between key points
   * @param {array} points - Fixed key points
   * @param {number} options.maxIntPointsPerSegment - Maximum number of points between two key points
   * @param {number} options.tolerance - Simplification tolerance
   * @return {array} Interpolated points including key points
   */
  const interpolatePoints = (
    points,
    { maxIntPointsPerSegment = 100, tolerance = 0.002 } = {}
  ) => {
    const numPoints = points.length;
    const maxPointIdx = numPoints - 1;

    const maxOutPoints = maxPointIdx * maxIntPointsPerSegment + 1;
    const sqTolerance = tolerance ** 2;

    let outPoints = [];
    let prevPoint;

    // Generate interpolated points where the squared-distance between points
    // is larger than sqTolerance
    for (let i = 0; i < numPoints - 1; i++) {
      let segmentPoints = [points[i].slice(0, 2)];
      prevPoint = points[i];

      for (let j = 1; j < maxIntPointsPerSegment; j++) {
        const t = (i * maxIntPointsPerSegment + j) / maxOutPoints;
        const intPoint = interpolatePoint(t, points, maxPointIdx);

        // Check squared distance simplification
        if (
          sqDist(prevPoint[0], prevPoint[1], intPoint[0], intPoint[1]) >
          sqTolerance
        ) {
          segmentPoints.push(intPoint);
          prevPoint = intPoint;
        }
      }

      // Add next key point. Needed for the simplification algorithm
      segmentPoints.push(points[i + 1]);
      // Simplify interpolated points using the douglas-peuckner algorithm
      segmentPoints = simplifyDouglasPeucker(segmentPoints, sqTolerance);
      // Add simplified points without the last key point, which is added
      // anyway in the next segment
      outPoints = outPoints.concat(
        segmentPoints.slice(0, segmentPoints.length - 1)
      );
    }
    outPoints.push(points[points.length - 1].slice(0, 2));

    return outPoints.flat();
  };

  /**
   * Group points by line assignment (the fifth component of a point)
   * @param {array} points - Flat list of points
   * @return {array} List of lists of ordered points by line
   */
  const groupPoints = (points) => {
    const groupedPoints = {};

    const isOrdered = !Number.isNaN(+points[0][5]);
    points.forEach((point) => {
      const segId = point[4];

      if (!groupedPoints[segId]) groupedPoints[segId] = [];

      if (isOrdered) groupedPoints[segId][point[5]] = point;
      else groupedPoints[segId].push(point);
    });

    // The filtering ensures that non-existing array entries are removed
    Object.entries(groupedPoints).forEach((idPoints) => {
      groupedPoints[idPoints[0]] = idPoints[1].filter((v) => v);
      // Store the first point as the reference
      groupedPoints[idPoints[0]].reference = idPoints[1][0];
    });

    return groupedPoints;
  };

  self.onmessage = function onmessage(event) {
    const numPoints = event.data.points ? +event.data.points.length : 0;

    if (!numPoints)
      self.postMessage({ error: new Error('No points provided') });

    event.data.points;

    const groupedPoints = groupPoints(event.data.points);

    self.postMessage({
      points: Object.entries(groupedPoints).reduce(
        (curvePoints, idAndPoints) => {
          curvePoints[idAndPoints[0]] = interpolatePoints(
            idAndPoints[1],
            event.data.options
          );
          // Make sure the reference is passed on
          curvePoints[idAndPoints[0]].reference = idAndPoints[1].reference;
          return curvePoints;
        },
        {}
      ),
    });
  };
};

const createSplineCurve = (
  points,
  options = { tolerance: 0.002, maxIntPointsPerSegment: 100 }
) =>
  new Promise((resolve, reject) => {
    const worker$1 = createWorker(worker);

    worker$1.onmessage = (e) => {
      if (e.data.error) reject(e.data.error);
      else resolve(e.data.points);
      worker$1.terminate();
    };

    worker$1.postMessage({ points, options });
  });

var version = "1.3.0";

const deprecations = {
  showRecticle: 'showReticle',
  recticleColor: 'reticleColor',
};

const checkDeprecations = (properties) => {
  Object.keys(properties)
    .filter((prop) => deprecations[prop])
    .forEach((name) => {
      console.warn(
        `regl-scatterplot: the "${name}" property is deprecated. Please use "${deprecations[name]}" instead.`
      );
      properties[deprecations[name]] = properties[name];
      delete properties[name];
    });
};

const getEncodingType = (
  type,
  defaultValue,
  { allowSegment = false, allowDensity = false } = {}
) => {
  // Z refers to the 3rd component of the RGBA value
  if (Z_NAMES.has(type)) return 'valueZ';

  // W refers to the 4th component of the RGBA value
  if (W_NAMES.has(type)) return 'valueW';

  if (type === 'segment') return allowSegment ? 'segment' : defaultValue;

  if (type === 'density') return allowDensity ? 'density' : defaultValue;

  return defaultValue;
};

const getEncodingIdx = (type) => {
  switch (type) {
    case 'valueZ':
      return 2;

    case 'valueW':
      return 3;

    default:
      return null;
  }
};

const createScatterplot = (
  /** @type {Partial<import('./types').Properties>} */ initialProperties = {}
) => {
  /** @type {import('./types').PubSub} */
  const pubSub = createPubSub({
    async: !initialProperties.syncEvents,
    caseInsensitive: true,
  });
  const scratch = new Float32Array(16);
  const pvm = new Float32Array(16);
  const mousePosition = [0, 0];

  checkDeprecations(initialProperties);

  let {
    renderer,
    backgroundColor = DEFAULT_COLOR_BG,
    backgroundImage = DEFAULT_BACKGROUND_IMAGE,
    canvas = document.createElement('canvas'),
    colorBy = DEFAULT_COLOR_BY,
    deselectOnDblClick = DEFAULT_DESELECT_ON_DBL_CLICK,
    deselectOnEscape = DEFAULT_DESELECT_ON_ESCAPE,
    lassoColor = DEFAULT_LASSO_COLOR,
    lassoLineWidth = DEFAULT_LASSO_LINE_WIDTH,
    lassoMinDelay = DEFAULT_LASSO_MIN_DELAY$1,
    lassoMinDist = DEFAULT_LASSO_MIN_DIST$1,
    lassoClearEvent = DEFAULT_LASSO_CLEAR_EVENT,
    lassoInitiator = DEFAULT_LASSO_INITIATOR,
    lassoInitiatorParentElement = document.body,
    keyMap = DEFAULT_KEY_MAP,
    mouseMode = DEFAULT_MOUSE_MODE,
    showReticle = DEFAULT_SHOW_RETICLE,
    reticleColor = DEFAULT_RETICLE_COLOR,
    pointColor = DEFAULT_COLOR_NORMAL,
    pointColorActive = DEFAULT_COLOR_ACTIVE,
    pointColorHover = DEFAULT_COLOR_HOVER,
    showPointConnections = DEFAULT_SHOW_POINT_CONNECTIONS,
    pointConnectionColor = DEFAULT_POINT_CONNECTION_COLOR_NORMAL,
    pointConnectionColorActive = DEFAULT_POINT_CONNECTION_COLOR_ACTIVE,
    pointConnectionColorHover = DEFAULT_POINT_CONNECTION_COLOR_HOVER,
    pointConnectionColorBy = DEFAULT_POINT_CONNECTION_COLOR_BY,
    pointConnectionOpacity = DEFAULT_POINT_CONNECTION_OPACITY,
    pointConnectionOpacityBy = DEFAULT_POINT_CONNECTION_OPACITY_BY,
    pointConnectionOpacityActive = DEFAULT_POINT_CONNECTION_OPACITY_ACTIVE,
    pointConnectionSize = DEFAULT_POINT_CONNECTION_SIZE,
    pointConnectionSizeActive = DEFAULT_POINT_CONNECTION_SIZE_ACTIVE,
    pointConnectionSizeBy = DEFAULT_POINT_CONNECTION_SIZE_BY,
    pointConnectionMaxIntPointsPerSegment = DEFAULT_POINT_CONNECTION_MAX_INT_POINTS_PER_SEGMENT,
    pointConnectionTolerance = DEFAULT_POINT_CONNECTION_INT_POINTS_TOLERANCE,
    pointSize = DEFAULT_POINT_SIZE,
    pointSizeSelected = DEFAULT_POINT_SIZE_SELECTED,
    pointSizeMouseDetection = DEFAULT_POINT_SIZE_MOUSE_DETECTION,
    pointOutlineWidth = DEFAULT_POINT_OUTLINE_WIDTH,
    opacity = AUTO,
    opacityBy = DEFAULT_OPACITY_BY,
    opacityByDensityFill = DEFAULT_OPACITY_BY_DENSITY_FILL,
    opacityInactiveMax = DEFAULT_OPACITY_INACTIVE_MAX,
    opacityInactiveScale = DEFAULT_OPACITY_INACTIVE_SCALE,
    sizeBy = DEFAULT_SIZE_BY,
    height = DEFAULT_HEIGHT,
    width = DEFAULT_WIDTH,
  } = initialProperties;

  let currentWidth = width === AUTO ? 1 : width;
  let currentHeight = height === AUTO ? 1 : height;

  // The following properties cannot be changed after the initialization
  const {
    performanceMode = DEFAULT_PERFORMANCE_MODE,
    opacityByDensityDebounceTime = DEFAULT_OPACITY_BY_DENSITY_DEBOUNCE_TIME,
  } = initialProperties;

  // Same as renderer ||= createRenderer({ ... }) but avoids having to rely on
  // https://babeljs.io/docs/en/babel-plugin-proposal-logical-assignment-operators
  // eslint-disable-next-line no-unused-expressions
  renderer ||
    (renderer = createRenderer({
      regl: initialProperties.regl,
      gamma: initialProperties.gamma,
    }));

  backgroundColor = toRgba(backgroundColor, true);
  lassoColor = toRgba(lassoColor, true);
  reticleColor = toRgba(reticleColor, true);

  let backgroundColorBrightness = rgbBrightness(backgroundColor);
  let camera;
  let lasso;
  let mouseDown = false;
  let selection = [];
  const selectionSet = new Set();
  const selectionConnecionSet = new Set();
  let mouseDownTime = null;
  let mouseDownPosition = [0, 0];
  let numPoints = 0;
  let numPointsInView = 0;
  let lassoActive = false;
  let lassoPointsCurr = [];
  let searchIndex;
  let viewAspectRatio;
  let dataAspectRatio = DEFAULT_DATA_ASPECT_RATIO;
  let projectionLocal;
  let projection;
  let model;
  let pointConnections;
  let pointConnectionMap;
  let computingPointConnectionCurves;
  let reticleHLine;
  let reticleVLine;
  let computedPointSizeMouseDetection;
  let keyActionMap = flipObj(keyMap);
  let lassoInitiatorTimeout;
  let topRightNdc;
  let bottomLeftNdc;
  let preventEventView = false;
  let draw = true;
  let drawReticleOnce = false;
  let canvasObserver;

  pointColor = isMultipleColors(pointColor) ? [...pointColor] : [pointColor];
  pointColorActive = isMultipleColors(pointColorActive)
    ? [...pointColorActive]
    : [pointColorActive];
  pointColorHover = isMultipleColors(pointColorHover)
    ? [...pointColorHover]
    : [pointColorHover];

  pointColor = pointColor.map((color) => toRgba(color, true));
  pointColorActive = pointColorActive.map((color) => toRgba(color, true));
  pointColorHover = pointColorHover.map((color) => toRgba(color, true));

  opacity =
    !Array.isArray(opacity) && Number.isNaN(+opacity)
      ? pointColor[0][3]
      : opacity;
  opacity = isConditionalArray(opacity, isPositiveNumber, {
    minLength: 1,
  })
    ? [...opacity]
    : [opacity];

  pointSize = isConditionalArray(pointSize, isPositiveNumber, {
    minLength: 1,
  })
    ? [...pointSize]
    : [pointSize];

  let minPointScale = MIN_POINT_SIZE / pointSize[0];

  if (pointConnectionColor === 'inherit') {
    pointConnectionColor = [...pointColor];
  } else {
    pointConnectionColor = isMultipleColors(pointConnectionColor)
      ? [...pointConnectionColor]
      : [pointConnectionColor];
    pointConnectionColor = pointConnectionColor.map((color) =>
      toRgba(color, true)
    );
  }

  if (pointConnectionColorActive === 'inherit') {
    pointConnectionColorActive = [...pointColorActive];
  } else {
    pointConnectionColorActive = isMultipleColors(pointConnectionColorActive)
      ? [...pointConnectionColorActive]
      : [pointConnectionColorActive];
    pointConnectionColorActive = pointConnectionColorActive.map((color) =>
      toRgba(color, true)
    );
  }

  if (pointConnectionColorHover === 'inherit') {
    pointConnectionColorHover = [...pointColorHover];
  } else {
    pointConnectionColorHover = isMultipleColors(pointConnectionColorHover)
      ? [...pointConnectionColorHover]
      : [pointConnectionColorHover];
    pointConnectionColorHover = pointConnectionColorHover.map((color) =>
      toRgba(color, true)
    );
  }

  if (pointConnectionOpacity === 'inherit') {
    pointConnectionOpacity = [...opacity];
  } else {
    pointConnectionOpacity = isConditionalArray(
      pointConnectionOpacity,
      isPositiveNumber,
      {
        minLength: 1,
      }
    )
      ? [...pointConnectionOpacity]
      : [pointConnectionOpacity];
  }

  if (pointConnectionSize === 'inherit') {
    pointConnectionSize = [...pointSize];
  } else {
    pointConnectionSize = isConditionalArray(
      pointConnectionSize,
      isPositiveNumber,
      {
        minLength: 1,
      }
    )
      ? [...pointConnectionSize]
      : [pointConnectionSize];
  }

  colorBy = getEncodingType(colorBy, DEFAULT_COLOR_BY);
  opacityBy = getEncodingType(opacityBy, DEFAULT_OPACITY_BY, {
    allowDensity: true,
  });
  sizeBy = getEncodingType(sizeBy, DEFAULT_SIZE_BY);

  pointConnectionColorBy = getEncodingType(
    pointConnectionColorBy,
    DEFAULT_POINT_CONNECTION_COLOR_BY,
    { allowSegment: true }
  );
  pointConnectionOpacityBy = getEncodingType(
    pointConnectionOpacityBy,
    DEFAULT_POINT_CONNECTION_OPACITY_BY,
    { allowSegment: true }
  );
  pointConnectionSizeBy = getEncodingType(
    pointConnectionSizeBy,
    DEFAULT_POINT_CONNECTION_SIZE_BY,
    { allowSegment: true }
  );

  let stateTex; // Stores the point texture holding x, y, category, and value
  let prevStateTex; // Stores the previous point texture. Used for transitions
  let tmpStateTex; // Stores a temporary point texture. Used for transitions
  let tmpStateBuffer; // Temporary frame buffer
  let stateTexRes = 0; // Width and height of the texture
  let stateTexEps = 0; // Half a texel
  let normalPointsIndexBuffer; // Buffer holding the indices pointing to the correct texel
  let selectedPointsIndexBuffer; // Used for pointing to the selected texels
  let hoveredPointIndexBuffer; // Used for pointing to the hovered texels

  let isTransitioning = false;
  let transitionStartTime = null;
  let transitionDuration;
  let transitionEasing;
  let preTransitionShowReticle = showReticle;

  let colorTex; // Stores the point color texture
  let colorTexRes = 0; // Width and height of the texture
  let encodingTex; // Stores the point sizes and opacity values
  let encodingTexRes = 0; // Width and height of the texture

  let isViewChanged = false;
  let isInit = false;

  let maxValueZ = 0;
  let maxValueW = 0;

  let hoveredPoint;
  let isMouseInCanvas = false;

  let xScale = initialProperties.xScale || null;
  let yScale = initialProperties.yScale || null;
  let xDomainStart = 0;
  let xDomainSize = 0;
  let yDomainStart = 0;
  let yDomainSize = 0;
  if (xScale) {
    xDomainStart = xScale.domain()[0];
    xDomainSize = xScale.domain()[1] - xScale.domain()[0];
    xScale.range([0, currentWidth]);
  }
  if (yScale) {
    yDomainStart = yScale.domain()[0];
    yDomainSize = yScale.domain()[1] - yScale.domain()[0];
    yScale.range([currentHeight, 0]);
  }

  const getNdcX = (x) => -1 + (x / currentWidth) * 2;
  const getNdcY = (y) => 1 + (y / currentHeight) * -2;

  // Get relative WebGL position
  const getMouseGlPos = () => [
    getNdcX(mousePosition[0]),
    getNdcY(mousePosition[1]),
  ];

  const getScatterGlPos = (xGl, yGl) => {
    // Homogeneous vector
    const v = [xGl, yGl, 1, 1];

    // projection^-1 * view^-1 * model^-1 is the same as
    // model * view^-1 * projection
    const mvp = invert(
      scratch,
      multiply(
        scratch,
        projectionLocal,
        multiply(scratch, camera.view, model)
      )
    );

    // Translate vector
    transformMat4(v, v, mvp);

    return v.slice(0, 2);
  };

  const raycast = () => {
    const [xGl, yGl] = getMouseGlPos();
    const [xNdc, yNdc] = getScatterGlPos(xGl, yGl);

    // eslint-disable-next-line no-use-before-define
    const pointScale = getPointScale();

    // The height of the view in normalized device coordinates
    const heightNdc = topRightNdc[1] - bottomLeftNdc[1];
    // The size of a pixel in the current view in normalized device coordinates
    const pxNdc = heightNdc / currentHeight;
    // The scaled point size in normalized device coordinates
    const pointSizeNdc =
      computedPointSizeMouseDetection * pointScale * pxNdc * 0.66;

    // Get all points within a close range
    const pointsInBBox = searchIndex.range(
      xNdc - pointSizeNdc,
      yNdc - pointSizeNdc,
      xNdc + pointSizeNdc,
      yNdc + pointSizeNdc
    );

    // Find the closest point
    let minDist = pointSizeNdc;
    let clostestPoint;
    pointsInBBox.forEach((idx) => {
      const [ptX, ptY] = searchIndex.points[idx];
      const d = dist(ptX, ptY, xNdc, yNdc);
      if (d < minDist) {
        minDist = d;
        clostestPoint = idx;
      }
    });

    if (minDist < (computedPointSizeMouseDetection / currentWidth) * 2)
      return clostestPoint;
    return -1;
  };

  const lassoExtend = (lassoPoints, lassoPointsFlat) => {
    lassoPointsCurr = lassoPoints;
    lasso.setPoints(lassoPointsFlat);
    pubSub.publish('lassoExtend', { coordinates: lassoPoints });
  };

  const findPointsInLasso = (lassoPolygon) => {
    // get the bounding box of the lasso selection...
    const bBox = getBBox(lassoPolygon);
    // ...to efficiently preselect potentially selected points
    const pointsInBBox = searchIndex.range(...bBox);
    // next we test each point in the bounding box if it is in the polygon too
    const pointsInPolygon = [];
    pointsInBBox.forEach((pointIdx) => {
      if (isPointInPolygon(lassoPolygon, searchIndex.points[pointIdx]))
        pointsInPolygon.push(pointIdx);
    });

    return pointsInPolygon;
  };

  const lassoClear = () => {
    lassoPointsCurr = [];
    if (lasso) lasso.clear();
  };

  const hasPointConnections = (point) => point && point.length > 4;

  const setPointConnectionColorState = (pointIdxs, stateIndex) => {
    if (
      computingPointConnectionCurves ||
      !showPointConnections ||
      !hasPointConnections(searchIndex.points[pointIdxs[0]])
    )
      return;

    const isNormal = stateIndex === 0;
    const lineIdCacher =
      stateIndex === 1
        ? (lineId) => selectionConnecionSet.add(lineId)
        : identity;

    // Get line IDs
    const lineIds = Object.keys(
      pointIdxs.reduce((ids, pointIdx) => {
        const point = searchIndex.points[pointIdx];
        const isStruct = Array.isArray(point[4]);
        const lineId = isStruct ? point[4][0] : point[4];

        ids[lineId] = true;

        return ids;
      }, {})
    );

    const buffer = pointConnections.getData().opacities;

    lineIds
      .filter((lineId) => !selectionConnecionSet.has(+lineId))
      .forEach((lineId) => {
        const index = pointConnectionMap[lineId][0];
        const numPointPerLine = pointConnectionMap[lineId][2];
        const pointOffset = pointConnectionMap[lineId][3];

        const bufferStart = index * 4 + pointOffset * 2;
        const bufferEnd = bufferStart + numPointPerLine * 2 + 4;

        // eslint-disable-next-line no-underscore-dangle
        if (buffer.__original__ === undefined) {
          // eslint-disable-next-line no-underscore-dangle
          buffer.__original__ = buffer.slice();
        }

        for (let i = bufferStart; i < bufferEnd; i++) {
          // buffer[i] = Math.floor(buffer[i] / 4) * 4 + stateIndex;
          buffer[i] = isNormal
            ? // eslint-disable-next-line no-underscore-dangle
              buffer.__original__[i]
            : pointConnectionOpacityActive;
        }

        lineIdCacher(lineId);
      });

    pointConnections.getBuffer().opacities.subdata(buffer, 0);
  };

  const indexToStateTexCoord = (index) => [
    (index % stateTexRes) / stateTexRes + stateTexEps,
    Math.floor(index / stateTexRes) / stateTexRes + stateTexEps,
  ];

  const deselect = ({ preventEvent = false } = {}) => {
    if (lassoClearEvent === LASSO_CLEAR_ON_DESELECT) lassoClear();
    if (selection.length) {
      if (!preventEvent) pubSub.publish('deselect');
      selectionConnecionSet.clear();
      setPointConnectionColorState(selection, 0);
      selection = [];
      selectionSet.clear();
      draw = true;
    }
  };

  /**
   * @param {number | number[]} pointIdxs
   * @param {import('./types').ScatterplotMethodOptions['select']}
   */
  const select = (pointIdxs, { merge = false, preventEvent = false } = {}) => {
    const pointIdxsArr = Array.isArray(pointIdxs) ? pointIdxs : [pointIdxs];

    if (merge) {
      selection = unionIntegers(selection, pointIdxsArr);
    } else {
      // Unset previously highlight point connections
      if (selection && selection.length)
        setPointConnectionColorState(selection, 0);
      selection = pointIdxsArr;
    }

    const selectionBuffer = [];

    selectionSet.clear();
    selectionConnecionSet.clear();

    for (let i = selection.length - 1; i >= 0; i--) {
      const pointIdx = selection[i];

      if (pointIdx < 0 || pointIdx >= numPoints) {
        // Remove invalid selection
        selection.splice(i, 1);
      } else {
        selectionSet.add(pointIdx);
        const texCoords = indexToStateTexCoord(pointIdx);
        selectionBuffer.push(texCoords[0]);
        selectionBuffer.push(texCoords[1]);
      }
    }

    selectedPointsIndexBuffer({
      usage: 'dynamic',
      type: 'float',
      data: selectionBuffer,
    });

    setPointConnectionColorState(selection, 1);

    if (!preventEvent) pubSub.publish('select', { points: selection });

    draw = true;
  };

  const getRelativeMousePosition = (event) => {
    const rect = canvas.getBoundingClientRect();

    mousePosition[0] = event.clientX - rect.left;
    mousePosition[1] = event.clientY - rect.top;

    return [...mousePosition];
  };

  const lassoStart = () => {
    // Fix camera for the lasso selection
    camera.config({ isFixed: true });
    mouseDown = true;
    lassoActive = true;
    lassoClear();
    pubSub.publish('lassoStart');
  };

  const lassoEnd = (lassoPoints, lassoPointsFlat, { merge = false } = {}) => {
    camera.config({ isFixed: false });
    lassoPointsCurr = [...lassoPoints];
    // const t0 = performance.now();
    const pointsInLasso = findPointsInLasso(lassoPointsFlat);
    // console.log(`found ${pointsInLasso.length} in ${performance.now() - t0} msec`);
    select(pointsInLasso, { merge });
    pubSub.publish('lassoEnd', {
      coordinates: lassoPointsCurr,
    });
    if (lassoClearEvent === LASSO_CLEAR_ON_END) lassoClear();
  };

  const lassoManager = createLasso(canvas, {
    onStart: lassoStart,
    onDraw: lassoExtend,
    onEnd: lassoEnd,
    enableInitiator: lassoInitiator,
    initiatorParentElement: lassoInitiatorParentElement,
    pointNorm: ([x, y]) => getScatterGlPos(getNdcX(x), getNdcY(y)),
  });

  const checkLassoMode = () => mouseMode === MOUSE_MODE_LASSO;

  const checkModKey = (event, action) => {
    switch (keyActionMap[action]) {
      case KEY_ALT:
        return event.altKey;

      case KEY_CMD:
        return event.metaKey;

      case KEY_CTRL:
        return event.ctrlKey;

      case KEY_META:
        return event.metaKey;

      case KEY_SHIFT:
        return event.shiftKey;

      default:
        return false;
    }
  };

  const mouseDownHandler = (event) => {
    if (!isInit) return;

    mouseDown = true;
    mouseDownTime = performance.now();

    mouseDownPosition = getRelativeMousePosition(event);
    lassoActive = checkLassoMode() || checkModKey(event, KEY_ACTION_LASSO);
  };

  const mouseUpHandler = (event) => {
    if (!isInit) return;

    mouseDown = false;

    if (lassoActive) {
      event.preventDefault();
      lassoActive = false;
      lassoManager.end({
        merge: checkModKey(event, KEY_ACTION_MERGE),
      });
    }
  };

  const mouseClickHandler = (event) => {
    if (!isInit) return;

    event.preventDefault();

    const currentMousePosition = getRelativeMousePosition(event);

    if (dist(...currentMousePosition, ...mouseDownPosition) >= lassoMinDist)
      return;

    const clickTime = performance.now() - mouseDownTime;

    if (lassoInitiator && clickTime > LONG_CLICK_TIME) {
      // Show lasso initiator on long click immideately
      lassoManager.showInitiator(event);
    } else {
      // If the user clicked normally (i.e., fast) we'll only show the lasso
      // initiator if the use click into the void
      const clostestPoint = raycast();
      if (clostestPoint >= 0) {
        if (selection.length && lassoClearEvent === LASSO_CLEAR_ON_DESELECT) {
          // Special case where we silently "deselect" the previous points by
          // overriding the selection. Hence, we need to clear the lasso.
          lassoClear();
        }
        select([clostestPoint], {
          merge: checkModKey(event, KEY_ACTION_MERGE),
        });
      } else {
        deselect();
        if (!lassoInitiatorTimeout) {
          // We'll also wait to make sure the user didn't double click
          lassoInitiatorTimeout = setTimeout(() => {
            lassoInitiatorTimeout = null;
            lassoManager.showInitiator(event);
          }, SINGLE_CLICK_DELAY);
        }
      }
    }
  };

  const mouseDblClickHandler = (event) => {
    lassoManager.hideInitiator();
    if (lassoInitiatorTimeout) {
      clearTimeout(lassoInitiatorTimeout);
      lassoInitiatorTimeout = null;
    }
    if (deselectOnDblClick) {
      event.preventDefault();
      deselect();
    }
  };

  const mouseMoveHandler = (event) => {
    if (!isInit || (!isMouseInCanvas && !mouseDown)) return;

    getRelativeMousePosition(event);

    // Only ray cast if the mouse cursor is inside
    if (isMouseInCanvas && !lassoActive) {
      hover(raycast()); // eslint-disable-line no-use-before-define
    }

    if (lassoActive) {
      event.preventDefault();
      lassoManager.extend(event, true);
    }

    // Always redraw when mousedown as the user might have panned or lassoed
    if (mouseDown) draw = true;
  };

  const blurHandler = () => {
    if (!isInit) return;

    if (+hoveredPoint >= 0 && !selectionSet.has(hoveredPoint))
      setPointConnectionColorState([hoveredPoint], 0);
    hoveredPoint = undefined;
    isMouseInCanvas = false;
    mouseUpHandler();
    draw = true;
  };

  const createEncodingTexture = () => {
    const maxEncoding = Math.max(pointSize.length, opacity.length);

    encodingTexRes = Math.max(2, Math.ceil(Math.sqrt(maxEncoding)));
    const rgba = new Float32Array(encodingTexRes ** 2 * 4);

    for (let i = 0; i < maxEncoding; i++) {
      rgba[i * 4] = pointSize[i] || 0;
      rgba[i * 4 + 1] = Math.min(1, opacity[i] || 0);

      const active = Number((pointColorActive[i] || pointColorActive[0])[3]);
      rgba[i * 4 + 2] = Math.min(1, Number.isNaN(active) ? 1 : active);

      const hover = Number((pointColorHover[i] || pointColorHover[0])[3]);
      rgba[i * 4 + 3] = Math.min(1, Number.isNaN(hover) ? 1 : hover);
    }

    return renderer.regl.texture({
      data: rgba,
      shape: [encodingTexRes, encodingTexRes, 4],
      type: 'float',
    });
  };

  const getColors = (
    baseColor = pointColor,
    activeColor = pointColorActive,
    hoverColor = pointColorHover
  ) => {
    const n = baseColor.length;
    const n2 = activeColor.length;
    const n3 = hoverColor.length;
    const colors = [];
    if (n === n2 && n2 === n3) {
      for (let i = 0; i < n; i++) {
        colors.push(
          baseColor[i],
          activeColor[i],
          hoverColor[i],
          backgroundColor
        );
      }
    } else {
      for (let i = 0; i < n; i++) {
        const rgbaOpaque = [
          baseColor[i][0],
          baseColor[i][1],
          baseColor[i][2],
          1,
        ];
        const colorActive =
          colorBy === DEFAULT_COLOR_BY ? activeColor[0] : rgbaOpaque;
        const colorHover =
          colorBy === DEFAULT_COLOR_BY ? hoverColor[0] : rgbaOpaque;
        colors.push(baseColor[i], colorActive, colorHover, backgroundColor);
      }
    }
    return colors;
  };

  const createColorTexture = () => {
    const colors = getColors();
    const numColors = colors.length;
    colorTexRes = Math.max(2, Math.ceil(Math.sqrt(numColors)));
    const rgba = new Float32Array(colorTexRes ** 2 * 4);
    colors.forEach((color, i) => {
      rgba[i * 4] = color[0]; // r
      rgba[i * 4 + 1] = color[1]; // g
      rgba[i * 4 + 2] = color[2]; // b
      rgba[i * 4 + 3] = color[3]; // a
    });

    return renderer.regl.texture({
      data: rgba,
      shape: [colorTexRes, colorTexRes, 4],
      type: 'float',
    });
  };

  /**
   * Since we're using an external renderer whose canvas' width and height
   * might differ from this instance's width and height, we have to adjust the
   * projection of camera spaces into clip space accordingly.
   *
   * The `widthRatio` is rendererCanvas.width / thisCanvas.width
   * The `heightRatio` is rendererCanvas.height / thisCanvas.height
   */
  const updateProjectionMatrix = (widthRatio, heightRatio) => {
    projection[0] = widthRatio / viewAspectRatio;
    projection[5] = heightRatio;
  };

  const updateViewAspectRatio = () => {
    viewAspectRatio = currentWidth / currentHeight;
    projectionLocal = fromScaling([], [1 / viewAspectRatio, 1, 1]);
    projection = fromScaling([], [1 / viewAspectRatio, 1, 1]);
    model = fromScaling([], [dataAspectRatio, 1, 1]);
  };

  const setDataAspectRatio = (newDataAspectRatio) => {
    if (+newDataAspectRatio <= 0) return;
    dataAspectRatio = newDataAspectRatio;
  };

  const setColors = (getter, setter) => (newColors) => {
    if (!newColors || !newColors.length) return;

    const colors = getter();
    const prevColors = [...colors];

    let tmpColors = isMultipleColors(newColors) ? newColors : [newColors];
    tmpColors = tmpColors.map((color) => toRgba(color, true));

    if (colorTex) colorTex.destroy();

    try {
      setter(tmpColors);
      colorTex = createColorTexture();
    } catch (e) {
      console.error('Invalid colors. Switching back to default colors.');
      // eslint-disable-next-line no-param-reassign
      setter(prevColors);
      colorTex = createColorTexture();
    }
  };

  const setPointColor = setColors(
    () => pointColor,
    (colors) => {
      pointColor = colors;
    }
  );
  const setPointColorActive = setColors(
    () => pointColorActive,
    (colors) => {
      pointColorActive = colors;
    }
  );
  const setPointColorHover = setColors(
    () => pointColorHover,
    (colors) => {
      pointColorHover = colors;
    }
  );

  const computeDomainView = () => {
    const xyStartPt = getScatterGlPos(-1, -1);
    const xyEndPt = getScatterGlPos(1, 1);

    const xStart = (xyStartPt[0] + 1) / 2;
    const xEnd = (xyEndPt[0] + 1) / 2;
    const yStart = (xyStartPt[1] + 1) / 2;
    const yEnd = (xyEndPt[1] + 1) / 2;

    const xDomainView = [
      xDomainStart + xStart * xDomainSize,
      xDomainStart + xEnd * xDomainSize,
    ];
    const yDomainView = [
      yDomainStart + yStart * yDomainSize,
      yDomainStart + yEnd * yDomainSize,
    ];

    return [xDomainView, yDomainView];
  };

  const updateScales = () => {
    if (!xScale && !yScale) return;

    const [xDomainView, yDomainView] = computeDomainView();

    if (xScale) xScale.domain(xDomainView);
    if (yScale) yScale.domain(yDomainView);
  };

  const setCurrentHeight = (newCurrentHeight) => {
    currentHeight = newCurrentHeight;
    canvas.height = Math.floor(currentHeight * window.devicePixelRatio);
    if (yScale) {
      yScale.range([currentHeight, 0]);
      updateScales();
    }
  };

  const setHeight = (newHeight) => {
    if (newHeight === AUTO) {
      height = newHeight;
      canvas.style.height = '100%';
      window.requestAnimationFrame(() => {
        if (canvas) setCurrentHeight(canvas.getBoundingClientRect().height);
      });
      return;
    }

    if (!+newHeight || +newHeight <= 0) return;

    height = +newHeight;
    setCurrentHeight(height);
    canvas.style.height = `${height}px`;
  };

  const computePointSizeMouseDetection = () => {
    computedPointSizeMouseDetection = pointSizeMouseDetection;

    if (pointSizeMouseDetection === AUTO) {
      computedPointSizeMouseDetection = Array.isArray(pointSize)
        ? pointSize[Math.floor(pointSize.length / 2)]
        : pointSize;
    }
  };

  const setPointSize = (newPointSize) => {
    if (isConditionalArray(newPointSize, isPositiveNumber, { minLength: 1 }))
      pointSize = [...newPointSize];

    if (isStrictlyPositiveNumber(+newPointSize)) pointSize = [+newPointSize];

    minPointScale = MIN_POINT_SIZE / pointSize[0];
    encodingTex = createEncodingTexture();
    computePointSizeMouseDetection();
  };

  const setPointSizeSelected = (newPointSizeSelected) => {
    if (!+newPointSizeSelected || +newPointSizeSelected < 0) return;
    pointSizeSelected = +newPointSizeSelected;
  };

  const setPointOutlineWidth = (newPointOutlineWidth) => {
    if (!+newPointOutlineWidth || +newPointOutlineWidth < 0) return;
    pointOutlineWidth = +newPointOutlineWidth;
  };

  const setCurrentWidth = (newCurrentWidth) => {
    currentWidth = newCurrentWidth;
    canvas.width = Math.floor(currentWidth * window.devicePixelRatio);
    if (xScale) {
      xScale.range([0, currentWidth]);
      updateScales();
    }
  };

  const setWidth = (newWidth) => {
    if (newWidth === AUTO) {
      width = newWidth;
      canvas.style.width = '100%';
      window.requestAnimationFrame(() => {
        if (canvas) setCurrentWidth(canvas.getBoundingClientRect().width);
      });
      return;
    }

    if (!+newWidth || +newWidth <= 0) return;

    width = +newWidth;
    setCurrentWidth(width);
    canvas.style.width = `${currentWidth}px`;
  };

  const setOpacity = (newOpacity) => {
    if (isConditionalArray(newOpacity, isPositiveNumber, { minLength: 1 }))
      opacity = [...newOpacity];

    if (isStrictlyPositiveNumber(+newOpacity)) opacity = [+newOpacity];

    encodingTex = createEncodingTexture();
  };

  const getEncodingDataType = (type) => {
    switch (type) {
      case 'valueZ':
        return maxValueZ > 1 ? 'categorical' : 'continuous';

      case 'valueW':
        return maxValueW > 1 ? 'categorical' : 'continuous';

      default:
        return null;
    }
  };

  const getEncodingValueToIdx = (type, rangeValues) => {
    switch (type) {
      case 'continuous':
        return (value) => Math.round(value * (rangeValues.length - 1));

      case 'categorical':
      default:
        return identity;
    }
  };

  const setColorBy = (type) => {
    colorBy = getEncodingType(type, DEFAULT_COLOR_BY);
  };
  const setOpacityBy = (type) => {
    opacityBy = getEncodingType(type, DEFAULT_OPACITY_BY, {
      allowDensity: true,
    });
  };
  const setSizeBy = (type) => {
    sizeBy = getEncodingType(type, DEFAULT_SIZE_BY);
  };
  const setPointConnectionColorBy = (type) => {
    pointConnectionColorBy = getEncodingType(
      type,
      DEFAULT_POINT_CONNECTION_COLOR_BY,
      { allowSegment: true }
    );
  };
  const setPointConnectionOpacityBy = (type) => {
    pointConnectionOpacityBy = getEncodingType(
      type,
      DEFAULT_POINT_CONNECTION_OPACITY_BY,
      { allowSegment: true }
    );
  };
  const setPointConnectionSizeBy = (type) => {
    pointConnectionSizeBy = getEncodingType(
      type,
      DEFAULT_POINT_CONNECTION_SIZE_BY,
      { allowSegment: true }
    );
  };

  const getResolution = () => [canvas.width, canvas.height];
  const getBackgroundImage = () => backgroundImage;
  const getColorTex = () => colorTex;
  const getColorTexRes = () => colorTexRes;
  const getColorTexEps = () => 0.5 / colorTexRes;
  const getDevicePixelRatio = () => window.devicePixelRatio;
  const getNormalPointsIndexBuffer = () => normalPointsIndexBuffer;
  const getSelectedPointsIndexBuffer = () => selectedPointsIndexBuffer;
  const getEncodingTex = () => encodingTex;
  const getEncodingTexRes = () => encodingTexRes;
  const getEncodingTexEps = () => 0.5 / encodingTexRes;
  const getNormalPointSizeExtra = () => 0;
  const getStateTex = () => tmpStateTex || stateTex;
  const getStateTexRes = () => stateTexRes;
  const getStateTexEps = () => 0.5 / stateTexRes;
  const getProjection = () => projection;
  const getView = () => camera.view;
  const getModel = () => model;
  const getModelViewProjection = () =>
    multiply(pvm, projection, multiply(pvm, camera.view, model));
  const getPointScale = () => {
    if (camera.scaling[0] > 1)
      return (
        (Math.asinh(max(1.0, camera.scaling[0])) / Math.asinh(1)) *
        window.devicePixelRatio
      );

    return max(minPointScale, camera.scaling[0]) * window.devicePixelRatio;
  };
  const getNormalNumPoints = () => numPoints;
  const getSelectedNumPoints = () => selection.length;
  const getPointOpacityMaxBase = () =>
    getSelectedNumPoints() > 0 ? opacityInactiveMax : 1;
  const getPointOpacityScaleBase = () =>
    getSelectedNumPoints() > 0 ? opacityInactiveScale : 1;
  const getIsColoredByZ = () => +(colorBy === 'valueZ');
  const getIsColoredByW = () => +(colorBy === 'valueW');
  const getIsOpacityByZ = () => +(opacityBy === 'valueZ');
  const getIsOpacityByW = () => +(opacityBy === 'valueW');
  const getIsOpacityByDensity = () => +(opacityBy === 'density');
  const getIsSizedByZ = () => +(sizeBy === 'valueZ');
  const getIsSizedByW = () => +(sizeBy === 'valueW');
  const getColorMultiplicator = () => {
    if (colorBy === 'valueZ') return maxValueZ <= 1 ? pointColor.length - 1 : 1;
    return maxValueW <= 1 ? pointColor.length - 1 : 1;
  };
  const getOpacityMultiplicator = () => {
    if (opacityBy === 'valueZ') return maxValueZ <= 1 ? opacity.length - 1 : 1;
    return maxValueW <= 1 ? opacity.length - 1 : 1;
  };
  const getSizeMultiplicator = () => {
    if (sizeBy === 'valueZ') return maxValueZ <= 1 ? pointSize.length - 1 : 1;
    return maxValueW <= 1 ? pointSize.length - 1 : 1;
  };
  const getOpacityDensity = (context) => {
    if (opacityBy !== 'density') return 1;

    // Adopted from the fabulous Ricky Reusser:
    // https://observablehq.com/@rreusser/selecting-the-right-opacity-for-2d-point-clouds
    // Extended with a point-density based approach
    const pointScale = getPointScale();
    const p = pointSize[0] * pointScale;

    // Compute the plot's x and y range from the view matrix, though these could come from any source
    const s = (2 / (2 / camera.view[0])) * (2 / (2 / camera.view[5]));

    // Viewport size, in device pixels
    const H = context.viewportHeight;
    const W = context.viewportWidth;

    // Adaptation: Instead of using the global number of points, I am using a
    // density-based approach that takes the points in the view into context
    // when zooming in. This ensure that in sparse areas, points are opaque and
    // in dense areas points are more translucent.
    let alpha =
      ((opacityByDensityFill * W * H) / (numPointsInView * p * p)) * min(1, s);

    // In performanceMode we use squares, otherwise we use circles, which only
    // take up (pi r^2) of the unit square
    alpha *= performanceMode ? 1 : 1 / (0.25 * Math.PI);

    // If the pixels shrink below the minimum permitted size, then we adjust the opacity instead
    // and apply clamping of the point size in the vertex shader. Note that we add 0.5 since we
    // slightly inrease the size of points during rendering to accommodate SDF-style antialiasing.
    const clampedPointDeviceSize = max(MIN_POINT_SIZE, p) + 0.5;

    // We square this since we're concerned with the ratio of *areas*.
    // eslint-disable-next-line no-restricted-properties
    alpha *= (p / clampedPointDeviceSize) ** 2;

    // And finally, we clamp to the range [0, 1]. We should really clamp this to 1 / precision
    // on the low end, depending on the data type of the destination so that we never render *nothing*.
    return min(1, max(0, alpha));
  };

  const updatePoints = renderer.regl({
    framebuffer: () => tmpStateBuffer,

    vert: SHADER,
    frag: SHADER$1,

    attributes: {
      position: [-4, 0, 4, 4, 4, -4],
    },

    uniforms: {
      startStateTex: () => prevStateTex,
      endStateTex: () => stateTex,
      t: (ctx, props) => props.t,
    },

    count: 3,
  });

  const drawPoints = (
    getPointSizeExtra,
    getNumPoints,
    getStateIndexBuffer,
    globalState = COLOR_NORMAL_IDX,
    getPointOpacityMax = getPointOpacityMaxBase,
    getPointOpacityScale = getPointOpacityScaleBase
  ) =>
    renderer.regl({
      frag: performanceMode ? FRAGMENT_SHADER : FRAGMENT_SHADER$1,
      vert: createVertexShader(globalState),

      blend: {
        enable: !performanceMode,
        func: {
          srcRGB: 'src alpha',
          srcAlpha: 'one',
          dstRGB: 'one minus src alpha',
          dstAlpha: 'one minus src alpha',
        },
      },

      depth: { enable: false },

      attributes: {
        stateIndex: {
          buffer: getStateIndexBuffer,
          size: 2,
        },
      },

      uniforms: {
        resolution: getResolution,
        modelViewProjection: getModelViewProjection,
        devicePixelRatio: getDevicePixelRatio,
        pointScale: getPointScale,
        encodingTex: getEncodingTex,
        encodingTexRes: getEncodingTexRes,
        encodingTexEps: getEncodingTexEps,
        pointOpacityMax: getPointOpacityMax,
        pointOpacityScale: getPointOpacityScale,
        pointSizeExtra: getPointSizeExtra,
        globalState,
        colorTex: getColorTex,
        colorTexRes: getColorTexRes,
        colorTexEps: getColorTexEps,
        stateTex: getStateTex,
        stateTexRes: getStateTexRes,
        stateTexEps: getStateTexEps,
        isColoredByZ: getIsColoredByZ,
        isColoredByW: getIsColoredByW,
        isOpacityByZ: getIsOpacityByZ,
        isOpacityByW: getIsOpacityByW,
        isOpacityByDensity: getIsOpacityByDensity,
        isSizedByZ: getIsSizedByZ,
        isSizedByW: getIsSizedByW,
        colorMultiplicator: getColorMultiplicator,
        opacityMultiplicator: getOpacityMultiplicator,
        opacityDensity: getOpacityDensity,
        sizeMultiplicator: getSizeMultiplicator,
        numColorStates: COLOR_NUM_STATES,
      },

      count: getNumPoints,

      primitive: 'points',
    });

  const drawPointBodies = drawPoints(
    getNormalPointSizeExtra,
    getNormalNumPoints,
    getNormalPointsIndexBuffer
  );

  const drawHoveredPoint = drawPoints(
    getNormalPointSizeExtra,
    () => 1,
    () => hoveredPointIndexBuffer,
    COLOR_HOVER_IDX,
    () => 1,
    () => 1
  );

  const drawSelectedPointOutlines = drawPoints(
    () => (pointSizeSelected + pointOutlineWidth * 2) * window.devicePixelRatio,
    getSelectedNumPoints,
    getSelectedPointsIndexBuffer,
    COLOR_ACTIVE_IDX,
    () => 1,
    () => 1
  );

  const drawSelectedPointInnerBorder = drawPoints(
    () => (pointSizeSelected + pointOutlineWidth) * window.devicePixelRatio,
    getSelectedNumPoints,
    getSelectedPointsIndexBuffer,
    COLOR_BG_IDX,
    () => 1,
    () => 1
  );

  const drawSelectedPointBodies = drawPoints(
    () => pointSizeSelected * window.devicePixelRatio,
    getSelectedNumPoints,
    getSelectedPointsIndexBuffer,
    COLOR_ACTIVE_IDX,
    () => 1,
    () => 1
  );

  const drawSelectedPoints = () => {
    drawSelectedPointOutlines();
    drawSelectedPointInnerBorder();
    drawSelectedPointBodies();
  };

  const drawBackgroundImage = renderer.regl({
    frag: FRAGMENT_SHADER$2,
    vert: VERTEX_SHADER,

    attributes: {
      position: [0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0],
    },

    uniforms: {
      modelViewProjection: getModelViewProjection,
      texture: getBackgroundImage,
    },

    count: 6,
  });

  const drawPolygon2d = renderer.regl({
    vert: `
      precision mediump float;
      uniform mat4 modelViewProjection;
      attribute vec2 position;
      void main () {
        gl_Position = modelViewProjection * vec4(position, 0, 1);
      }`,

    frag: `
      precision mediump float;
      uniform vec4 color;
      void main () {
        gl_FragColor = vec4(color.rgb, 0.2);
      }`,

    depth: { enable: false },

    blend: {
      enable: true,
      func: {
        srcRGB: 'src alpha',
        srcAlpha: 'one',
        dstRGB: 'one minus src alpha',
        dstAlpha: 'one minus src alpha',
      },
    },

    attributes: {
      position: () => lassoPointsCurr,
    },

    uniforms: {
      modelViewProjection: getModelViewProjection,
      color: () => lassoColor,
    },

    elements: () =>
      Array.from({ length: lassoPointsCurr.length - 2 }, (_, i) => [
        0,
        i + 1,
        i + 2,
      ]),
  });

  const drawReticle = () => {
    if (!(hoveredPoint >= 0)) return;

    const [x, y] = searchIndex.points[hoveredPoint].slice(0, 2);

    // Homogeneous coordinates of the point
    const v = [x, y, 0, 1];

    // We have to calculate the model-view-projection matrix outside of the
    // shader as we actually don't want the model, view, or projection of the
    // line view space to change such that the reticle is visualized across the
    // entire view container and not within the view of the scatterplot
    multiply(
      scratch,
      projection,
      multiply(scratch, camera.view, model)
    );

    transformMat4(v, v, scratch);

    reticleHLine.setPoints([-1, v[1], 1, v[1]]);
    reticleVLine.setPoints([v[0], 1, v[0], -1]);

    reticleHLine.draw();
    reticleVLine.draw();

    // Draw outer outline
    drawPoints(
      () =>
        (pointSizeSelected + pointOutlineWidth * 2) * window.devicePixelRatio,
      () => 1,
      hoveredPointIndexBuffer,
      COLOR_ACTIVE_IDX
    )();

    // Draw inner outline
    drawPoints(
      () => (pointSizeSelected + pointOutlineWidth) * window.devicePixelRatio,
      () => 1,
      hoveredPointIndexBuffer,
      COLOR_BG_IDX
    )();
  };

  const createPointIndex = (numNewPoints) => {
    const index = new Float32Array(numNewPoints * 2);

    let j = 0;
    for (let i = 0; i < numNewPoints; ++i) {
      const texCoord = indexToStateTexCoord(i);
      index[j] = texCoord[0]; // x
      index[j + 1] = texCoord[1]; // y
      j += 2;
    }

    return index;
  };

  const createStateTexture = (newPoints) => {
    const numNewPoints = newPoints.length;
    stateTexRes = Math.max(2, Math.ceil(Math.sqrt(numNewPoints)));
    stateTexEps = 0.5 / stateTexRes;
    const data = new Float32Array(stateTexRes ** 2 * 4);

    maxValueZ = 0;
    maxValueW = 0;

    for (let i = 0; i < numNewPoints; ++i) {
      data[i * 4] = newPoints[i][0]; // x
      data[i * 4 + 1] = newPoints[i][1]; // y
      data[i * 4 + 2] = newPoints[i][2] || 0; // z: value 1
      data[i * 4 + 3] = newPoints[i][3] || 0; // w: value 2

      maxValueZ = Math.max(maxValueZ, data[i * 4 + 2]);
      maxValueW = Math.max(maxValueW, data[i * 4 + 3]);
    }

    return renderer.regl.texture({
      data,
      shape: [stateTexRes, stateTexRes, 4],
      type: 'float',
    });
  };

  const cachePoints = (newPoints) => {
    if (!stateTex) return false;

    if (isTransitioning) {
      const tmp = prevStateTex;
      prevStateTex = tmpStateTex;
      tmp.destroy();
    } else {
      prevStateTex = stateTex;
    }

    tmpStateTex = createStateTexture(newPoints);
    tmpStateBuffer = renderer.regl.framebuffer({
      color: tmpStateTex,
      depth: false,
      stencil: false,
    });
    stateTex = undefined;

    return true;
  };

  const clearCachedPoints = () => {
    if (prevStateTex) {
      prevStateTex.destroy();
      prevStateTex = undefined;
    }

    if (tmpStateTex) {
      tmpStateTex.destroy();
      tmpStateTex = undefined;
    }
  };

  const setPoints = (newPoints) => {
    isInit = false;

    numPoints = newPoints.length;
    numPointsInView = numPoints;

    if (stateTex) stateTex.destroy();
    stateTex = createStateTexture(newPoints);

    normalPointsIndexBuffer({
      usage: 'static',
      type: 'float',
      data: createPointIndex(numPoints),
    });

    searchIndex = new KDBush(
      newPoints,
      (p) => p[0],
      (p) => p[1],
      16
    );

    isInit = true;
  };

  const getPointConnectionColorIndices = (curvePoints) => {
    const colorEncoding =
      pointConnectionColorBy === 'inherit' ? colorBy : pointConnectionColorBy;

    if (colorEncoding === 'segment') {
      const maxColorIdx = pointConnectionColor.length - 1;
      if (maxColorIdx < 1) return [];
      return curvePoints.reduce((colorIndices, curve, index) => {
        let totalLength = 0;
        const segLengths = [];
        // Compute the total length of the line
        for (let i = 2; i < curve.length; i += 2) {
          const segLength = Math.sqrt(
            (curve[i - 2] - curve[i]) ** 2 + (curve[i - 1] - curve[i + 1]) ** 2
          );
          segLengths.push(segLength);
          totalLength += segLength;
        }
        colorIndices[index] = [0];
        let cumLength = 0;
        // Assign the color index based on the cumulative length
        for (let i = 0; i < curve.length / 2 - 1; i++) {
          cumLength += segLengths[i];
          // The `4` comes from the fact that we have 4 color states:
          // normal, active, hover, and background
          colorIndices[index].push(
            Math.floor((cumLength / totalLength) * maxColorIdx) * 4
          );
        }
        // The `4` comes from the fact that we have 4 color states:
        // normal, active, hover, and background
        // colorIndices[index] = rangeMap(
        //   curve.length,
        //   (i) => Math.floor((i / (curve.length - 1)) * maxColorIdx) * 4
        // );
        return colorIndices;
      }, []);
    }

    if (colorEncoding) {
      const encodingIdx = getEncodingIdx(colorEncoding);
      const encodingValueToIdx = getEncodingValueToIdx(
        getEncodingDataType(colorEncoding),
        pointConnectionColorBy === 'inherit' ? pointColor : pointConnectionColor
      );
      return pointConnectionMap.reduce(
        (colorIndices, [index, referencePoint]) => {
          // The `4` comes from the fact that we have 4 color states:
          // normal, active, hover, and background
          colorIndices[index] =
            encodingValueToIdx(referencePoint[encodingIdx]) * 4;
          return colorIndices;
        },
        []
      );
    }

    return Array(pointConnectionMap.length).fill(0);
  };

  const getPointConnectionOpacities = () => {
    const opacityEncoding =
      pointConnectionOpacityBy === 'inherit'
        ? opacityBy
        : pointConnectionOpacityBy;

    if (opacityEncoding === 'segment') {
      const maxOpacityIdx = pointConnectionOpacity.length - 1;
      if (maxOpacityIdx < 1) return [];
      return pointConnectionMap.reduce(
        // eslint-disable-next-line no-unused-vars
        (opacities, [index, referencePoint, length]) => {
          opacities[index] = rangeMap(
            length,
            (i) =>
              pointConnectionOpacity[
                Math.floor((i / (length - 1)) * maxOpacityIdx)
              ]
          );
          return opacities;
        },
        []
      );
    }

    if (opacityEncoding) {
      const encodingIdx = getEncodingIdx(opacityEncoding);
      const encodingRangeMap =
        pointConnectionOpacityBy === 'inherit'
          ? opacity
          : pointConnectionOpacity;
      const encodingValueToIdx = getEncodingValueToIdx(
        getEncodingDataType(opacityEncoding),
        encodingRangeMap
      );
      return pointConnectionMap.reduce((opacities, [index, referencePoint]) => {
        opacities[index] =
          encodingRangeMap[encodingValueToIdx(referencePoint[encodingIdx])];
        return opacities;
      }, []);
    }

    return undefined;
  };

  const getPointConnectionWidths = () => {
    const sizeEncoding =
      pointConnectionSizeBy === 'inherit' ? sizeBy : pointConnectionSizeBy;

    if (sizeEncoding === 'segment') {
      const maxSizeIdx = pointConnectionSize.length - 1;
      if (maxSizeIdx < 1) return [];
      return pointConnectionMap.reduce(
        // eslint-disable-next-line no-unused-vars
        (widths, [index, referencePoint, length]) => {
          widths[index] = rangeMap(
            length,
            (i) =>
              pointConnectionSize[Math.floor((i / (length - 1)) * maxSizeIdx)]
          );
          return widths;
        },
        []
      );
    }

    if (sizeEncoding) {
      const encodingIdx = getEncodingIdx(sizeEncoding);
      const encodingRangeMap =
        pointConnectionSizeBy === 'inherit' ? pointSize : pointConnectionSize;
      const encodingValueToIdx = getEncodingValueToIdx(
        getEncodingDataType(sizeEncoding),
        encodingRangeMap
      );
      return pointConnectionMap.reduce((widths, [index, referencePoint]) => {
        widths[index] =
          encodingRangeMap[encodingValueToIdx(referencePoint[encodingIdx])];
        return widths;
      }, []);
    }

    return undefined;
  };

  const setPointConnectionMap = (curvePoints) => {
    pointConnectionMap = [];

    let cumLinePoints = 0;
    Object.keys(curvePoints).forEach((id, index) => {
      pointConnectionMap[id] = [
        index,
        curvePoints[id].reference,
        curvePoints[id].length / 2,
        // Used for offsetting in the buffer manipulations on
        // hovering and selecting
        cumLinePoints,
      ];
      cumLinePoints += curvePoints[id].length / 2;
    });
  };

  const setPointConnections = (newPoints) =>
    new Promise((resolve) => {
      pointConnections.setPoints([]);
      if (!newPoints || !newPoints.length) {
        resolve();
      } else {
        computingPointConnectionCurves = true;
        createSplineCurve(newPoints, {
          maxIntPointsPerSegment: pointConnectionMaxIntPointsPerSegment,
          tolerance: pointConnectionTolerance,
        }).then((curvePoints) => {
          setPointConnectionMap(curvePoints);
          const curvePointValues = Object.values(curvePoints);
          pointConnections.setPoints(curvePointValues, {
            colorIndices: getPointConnectionColorIndices(curvePointValues),
            opacities: getPointConnectionOpacities(),
            widths: getPointConnectionWidths(),
          });
          computingPointConnectionCurves = false;
          resolve();
        });
      }
    });

  const getPointsInView = () =>
    searchIndex.range(
      bottomLeftNdc[0],
      bottomLeftNdc[1],
      topRightNdc[0],
      topRightNdc[1]
    );

  const getNumPointsInView = () => {
    numPointsInView = getPointsInView().length;
  };

  const getNumPointsInViewDb = throttleAndDebounce(
    getNumPointsInView,
    opacityByDensityDebounceTime
  );

  const tween = (duration, easing) => {
    if (!transitionStartTime) transitionStartTime = performance.now();

    const dt = performance.now() - transitionStartTime;

    updatePoints({ t: Math.min(1, Math.max(0, easing(dt / duration))) });

    return dt < duration;
  };

  const endTransition = () => {
    isTransitioning = false;
    transitionStartTime = null;
    transitionDuration = undefined;
    transitionEasing = undefined;
    showReticle = preTransitionShowReticle;

    clearCachedPoints();

    pubSub.publish('transitionEnd');
  };

  const startTransition = ({ duration = 500, easing = DEFAULT_EASING }) => {
    if (isTransitioning) pubSub.publish('transitionEnd');

    isTransitioning = true;
    transitionStartTime = null;
    transitionDuration = duration;
    transitionEasing = isString(easing)
      ? EASING_FNS[easing] || DEFAULT_EASING
      : easing;
    preTransitionShowReticle = showReticle;
    showReticle = false;

    pubSub.publish('transitionStart');
  };

  const toArrayOrientedPoints = (points) =>
    new Promise((resolve, reject) => {
      if (!points || Array.isArray(points)) {
        resolve(points);
      } else {
        const length =
          Array.isArray(points.x) || ArrayBuffer.isView(points.x)
            ? points.x.length
            : 0;

        const getX =
          (Array.isArray(points.x) || ArrayBuffer.isView(points.x)) &&
          ((i) => points.x[i]);
        const getY =
          (Array.isArray(points.y) || ArrayBuffer.isView(points.y)) &&
          ((i) => points.y[i]);
        const getL =
          (Array.isArray(points.line) || ArrayBuffer.isView(points.line)) &&
          ((i) => points.line[i]);
        const getLO =
          (Array.isArray(points.lineOrder) ||
            ArrayBuffer.isView(points.lineOrder)) &&
          ((i) => points.lineOrder[i]);

        const components = Object.keys(points);
        const getZ = (() => {
          const z = components.find((c) => Z_NAMES.has(c));
          return (
            z &&
            (Array.isArray(points[z]) || ArrayBuffer.isView(points[z])) &&
            ((i) => points[z][i])
          );
        })();
        const getW = (() => {
          const w = components.find((c) => W_NAMES.has(c));
          return (
            w &&
            (Array.isArray(points[w]) || ArrayBuffer.isView(points[w])) &&
            ((i) => points[w][i])
          );
        })();

        if (getX && getY && getZ && getW && getL && getLO) {
          resolve(
            points.x.map((x, i) => [
              x,
              getY(i),
              getZ(i),
              getW(i),
              getL(i),
              getLO(i),
            ])
          );
        } else if (getX && getY && getZ && getW && getL) {
          resolve(
            Array.from({ length }, (_, i) => [
              getX(i),
              getY(i),
              getZ(i),
              getW(i),
              getL(i),
            ])
          );
        } else if (getX && getY && getZ && getW) {
          resolve(
            Array.from({ length }, (_, i) => [
              getX(i),
              getY(i),
              getZ(i),
              getW(i),
            ])
          );
        } else if (getX && getY && getZ) {
          resolve(
            Array.from({ length }, (_, i) => [getX(i), getY(i), getZ(i)])
          );
        } else if (getX && getY) {
          resolve(Array.from({ length }, (_, i) => [getX(i), getY(i)]));
        } else {
          reject(new Error('You need to specify at least x and y'));
        }
      }
    });

  /**
   * @param {import('./types').Points} newPoints
   * @param {import('./types').ScatterplotMethodOptions['draw']} options
   * @returns {Promise<void>}
   */
  const publicDraw = (newPoints, options = {}) =>
    toArrayOrientedPoints(newPoints).then(
      (points) =>
        new Promise((resolve) => {
          let pointsCached = false;
          if (points) {
            if (options.transition) {
              if (points.length === numPoints) {
                pointsCached = cachePoints(points);
              } else {
                console.warn(
                  'Cannot transition! The number of points between the previous and current draw call must be identical.'
                );
              }
            }
            setPoints(points);
            if (
              showPointConnections ||
              (options.showPointConnectionsOnce &&
                hasPointConnections(points[0]))
            ) {
              setPointConnections(points).then(() => {
                pubSub.publish('pointConnectionsDraw');
                draw = true;
                drawReticleOnce = options.showReticleOnce;
              });
            }
          }

          if (options.transition && pointsCached) {
            pubSub.subscribe(
              'transitionEnd',
              () => {
                // Point connects cannot be transitioned yet so we hide them during
                // the transition. Hence, we need to make sure we call `draw()` once
                // the transition has ended.
                draw = true;
                drawReticleOnce = options.showReticleOnce;
                resolve();
              },
              1
            );
            startTransition({
              duration: options.transitionDuration,
              easing: options.transitionEasing,
            });
          } else {
            pubSub.subscribe('draw', resolve, 1);
            draw = true;
            drawReticleOnce = options.showReticleOnce;
          }
        })
    );

  /** @type {<F extends Function>(f: F) => (...args: Parameters<F>) => ReturnType<F>} */
  const withDraw =
    (f) =>
    (...args) => {
      const out = f(...args);
      draw = true;
      return out;
    };

  const updatePointConnectionStyle = () => {
    pointConnections.setStyle({
      color: getColors(
        pointConnectionColor,
        pointConnectionColorActive,
        pointConnectionColorHover
      ),
      opacity:
        pointConnectionOpacity === null ? null : pointConnectionOpacity[0],
      width: pointConnectionSize[0],
    });
  };

  const updateLassoInitiatorStyle = () => {
    const v = Math.round(backgroundColorBrightness) > 0 ? 0 : 255;
    lassoManager.initiator.style.border = `1px dashed rgba(${v}, ${v}, ${v}, 0.33)`;
    lassoManager.initiator.style.background = `rgba(${v}, ${v}, ${v}, 0.1)`;
  };

  const setBackgroundColor = (newBackgroundColor) => {
    if (!newBackgroundColor) return;

    backgroundColor = toRgba(newBackgroundColor, true);
    backgroundColorBrightness = rgbBrightness(backgroundColor);
    updateLassoInitiatorStyle();
  };

  const setBackgroundImage = (newBackgroundImage) => {
    if (!newBackgroundImage) {
      backgroundImage = null;
    } else if (isString(newBackgroundImage)) {
      createTextureFromUrl(renderer.regl, newBackgroundImage).then(
        (texture) => {
          backgroundImage = texture;
          draw = true;
          pubSub.publish('backgroundImageReady');
        }
      );
      // eslint-disable-next-line no-underscore-dangle
    } else if (newBackgroundImage._reglType === 'texture2d') {
      backgroundImage = newBackgroundImage;
    } else {
      backgroundImage = null;
    }
  };

  const setCameraDistance = (distance) => {
    if (distance > 0) camera.lookAt(camera.target, distance, camera.rotation);
  };

  const setCameraRotation = (rotation) => {
    if (rotation !== null)
      camera.lookAt(camera.target, camera.distance[0], rotation);
  };

  const setCameraTarget = (target) => {
    if (target) camera.lookAt(target, camera.distance[0], camera.rotation);
  };

  const setCameraView = (view) => {
    if (view) camera.setView(view);
  };

  const setLassoColor = (newLassoColor) => {
    if (!newLassoColor) return;

    lassoColor = toRgba(newLassoColor, true);

    lasso.setStyle({ color: lassoColor });
  };

  const setLassoLineWidth = (newLassoLineWidth) => {
    if (Number.isNaN(+newLassoLineWidth) || +newLassoLineWidth < 1) return;

    lassoLineWidth = +newLassoLineWidth;

    lasso.setStyle({ width: lassoLineWidth });
  };

  const setLassoMinDelay = (newLassoMinDelay) => {
    if (!+newLassoMinDelay) return;

    lassoMinDelay = +newLassoMinDelay;

    lassoManager.set({
      minDelay: lassoMinDelay,
    });
  };

  const setLassoMinDist = (newLassoMinDist) => {
    if (!+newLassoMinDist) return;

    lassoMinDist = +newLassoMinDist;

    lassoManager.set({
      minDist: lassoMinDist,
    });
  };

  const setLassoClearEvent = (newLassoClearEvent) => {
    lassoClearEvent = limit(
      LASSO_CLEAR_EVENTS,
      lassoClearEvent
    )(newLassoClearEvent);
  };

  const setLassoInitiator = (newLassoInitiator) => {
    lassoInitiator = Boolean(newLassoInitiator);

    lassoManager.set({
      enableInitiator: lassoInitiator,
    });
  };

  const setLassoInitiatorParentElement = (newLassoInitiatorParentElement) => {
    lassoInitiatorParentElement = newLassoInitiatorParentElement;

    lassoManager.set({
      startInitiatorParentElement: lassoInitiatorParentElement,
    });
  };

  const setKeyMap = (newKeyMap) => {
    keyMap = Object.entries(newKeyMap).reduce((map, [key, value]) => {
      if (KEYS.includes(key) && KEY_ACTIONS.includes(value)) {
        map[key] = value;
      }
      return map;
    }, {});
    keyActionMap = flipObj(keyMap);

    if (keyActionMap[KEY_ACTION_ROTATE]) {
      camera.config({
        isRotate: true,
        mouseDownMoveModKey: keyActionMap[KEY_ACTION_ROTATE],
      });
    } else {
      camera.config({
        isRotate: false,
      });
    }
  };

  const setMouseMode = (newMouseMode) => {
    mouseMode = limit(MOUSE_MODES, MOUSE_MODE_PANZOOM)(newMouseMode);

    camera.config({
      defaultMouseDownMoveAction:
        mouseMode === MOUSE_MODE_ROTATE ? 'rotate' : 'pan',
    });
  };

  const setShowReticle = (newShowReticle) => {
    if (newShowReticle === null) return;

    showReticle = newShowReticle;
  };

  const setReticleColor = (newReticleColor) => {
    if (!newReticleColor) return;

    reticleColor = toRgba(newReticleColor, true);

    reticleHLine.setStyle({ color: reticleColor });
    reticleVLine.setStyle({ color: reticleColor });
  };

  const setXScale = (newXScale) => {
    if (!newXScale) return;

    xScale = newXScale;
    xDomainStart = newXScale.domain()[0];
    xDomainSize = newXScale ? newXScale.domain()[1] - newXScale.domain()[0] : 0;
    xScale.range([0, currentWidth]);
    updateScales();
  };

  const setYScale = (newYScale) => {
    if (!newYScale) return;

    yScale = newYScale;
    yDomainStart = yScale.domain()[0];
    yDomainSize = yScale ? yScale.domain()[1] - yScale.domain()[0] : 0;
    yScale.range([currentHeight, 0]);
    updateScales();
  };

  const setDeselectOnDblClick = (newDeselectOnDblClick) => {
    deselectOnDblClick = !!newDeselectOnDblClick;
  };

  const setDeselectOnEscape = (newDeselectOnEscape) => {
    deselectOnEscape = !!newDeselectOnEscape;
  };

  const setShowPointConnections = (newShowPointConnections) => {
    showPointConnections = !!newShowPointConnections;
    if (showPointConnections) {
      if (hasPointConnections(searchIndex.points[0])) {
        setPointConnections(searchIndex.points).then(() => {
          pubSub.publish('pointConnectionsDraw');
          draw = true;
        });
      }
    } else {
      setPointConnections();
    }
  };

  const setPointConnectionColors = (setter, getInheritance) => (newColors) => {
    if (newColors === 'inherit') {
      setter([...getInheritance()]);
    } else {
      const tmpColors = isMultipleColors(newColors) ? newColors : [newColors];
      setter(tmpColors.map((color) => toRgba(color, true)));
    }
    updatePointConnectionStyle();
  };

  const setPointConnectionColor = setPointConnectionColors(
    (newColors) => {
      pointConnectionColor = newColors;
    },
    () => pointColor
  );

  const setPointConnectionColorActive = setPointConnectionColors(
    (newColors) => {
      pointConnectionColorActive = newColors;
    },
    () => pointColorActive
  );

  const setPointConnectionColorHover = setPointConnectionColors(
    (newColors) => {
      pointConnectionColorHover = newColors;
    },
    () => pointColorHover
  );

  const setPointConnectionOpacity = (newOpacity) => {
    if (isConditionalArray(newOpacity, isPositiveNumber, { minLength: 1 }))
      pointConnectionOpacity = [...newOpacity];

    if (isStrictlyPositiveNumber(+newOpacity))
      pointConnectionOpacity = [+newOpacity];

    pointConnectionColor = pointConnectionColor.map((color) => {
      color[3] = !Number.isNaN(+pointConnectionOpacity[0])
        ? +pointConnectionOpacity[0]
        : color[3];
      return color;
    });

    updatePointConnectionStyle();
  };

  const setPointConnectionOpacityActive = (newOpacity) => {
    if (!Number.isNaN(+newOpacity) && +newOpacity)
      pointConnectionOpacityActive = +newOpacity;
  };

  const setPointConnectionSize = (newPointConnectionSize) => {
    if (
      isConditionalArray(newPointConnectionSize, isPositiveNumber, {
        minLength: 1,
      })
    )
      pointConnectionSize = [...newPointConnectionSize];

    if (isStrictlyPositiveNumber(+newPointConnectionSize))
      pointConnectionSize = [+newPointConnectionSize];

    updatePointConnectionStyle();
  };

  const setPointConnectionSizeActive = (newPointConnectionSizeActive) => {
    if (
      !Number.isNaN(+newPointConnectionSizeActive) &&
      +newPointConnectionSizeActive
    )
      pointConnectionSizeActive = Math.max(0, newPointConnectionSizeActive);
  };

  const setPointConnectionMaxIntPointsPerSegment = (
    newPointConnectionMaxIntPointsPerSegment
  ) => {
    pointConnectionMaxIntPointsPerSegment = Math.max(
      0,
      newPointConnectionMaxIntPointsPerSegment
    );
  };

  const setPointConnectionTolerance = (newPointConnectionTolerance) => {
    pointConnectionTolerance = Math.max(0, newPointConnectionTolerance);
  };

  const setPointSizeMouseDetection = (newPointSizeMouseDetection) => {
    pointSizeMouseDetection = newPointSizeMouseDetection;
    computePointSizeMouseDetection();
  };

  const setOpacityByDensityFill = (newOpacityByDensityFill) => {
    opacityByDensityFill = +newOpacityByDensityFill;
  };

  const setOpacityInactiveMax = (newOpacityInactiveMax) => {
    opacityInactiveMax = +newOpacityInactiveMax;
  };

  const setOpacityInactiveScale = (newOpacityInactiveScale) => {
    opacityInactiveScale = +newOpacityInactiveScale;
  };

  const setGamma = (newGamma) => {
    renderer.gamma = newGamma;
  };

  /** @type {<Key extends keyof import('./types').Properties>(property: Key) => import('./types').Properties[Key] } */
  const get = (property) => {
    checkDeprecations({ property: true });

    if (property === 'aspectRatio') return dataAspectRatio;
    if (property === 'background') return backgroundColor;
    if (property === 'backgroundColor') return backgroundColor;
    if (property === 'backgroundImage') return backgroundImage;
    if (property === 'camera') return camera;
    if (property === 'cameraTarget') return camera.target;
    if (property === 'cameraDistance') return camera.distance[0];
    if (property === 'cameraRotation') return camera.rotation;
    if (property === 'cameraView') return camera.view;
    if (property === 'canvas') return canvas;
    if (property === 'colorBy') return colorBy;
    if (property === 'sizeBy') return sizeBy;
    if (property === 'deselectOnDblClick') return deselectOnDblClick;
    if (property === 'deselectOnEscape') return deselectOnEscape;
    if (property === 'height') return height;
    if (property === 'lassoColor') return lassoColor;
    if (property === 'lassoLineWidth') return lassoLineWidth;
    if (property === 'lassoMinDelay') return lassoMinDelay;
    if (property === 'lassoMinDist') return lassoMinDist;
    if (property === 'lassoClearEvent') return lassoClearEvent;
    if (property === 'lassoInitiator') return lassoInitiator;
    if (property === 'lassoInitiatorElement') return lassoManager.initiator;
    if (property === 'lassoInitiatorParentElement')
      return lassoInitiatorParentElement;
    if (property === 'keyMap') return { ...keyMap };
    if (property === 'mouseMode') return mouseMode;
    if (property === 'opacity')
      return opacity.length === 1 ? opacity[0] : opacity;
    if (property === 'opacityBy') return opacityBy;
    if (property === 'opacityByDensityFill') return opacityByDensityFill;
    if (property === 'opacityByDensityDebounceTime')
      return opacityByDensityDebounceTime;
    if (property === 'opacityInactiveMax') return opacityInactiveMax;
    if (property === 'opacityInactiveScale') return opacityInactiveScale;
    if (property === 'points') return searchIndex.points;
    if (property === 'pointsInView') return getPointsInView();
    if (property === 'pointColor')
      return pointColor.length === 1 ? pointColor[0] : pointColor;
    if (property === 'pointColorActive')
      return pointColorActive.length === 1
        ? pointColorActive[0]
        : pointColorActive;
    if (property === 'pointColorHover')
      return pointColorHover.length === 1
        ? pointColorHover[0]
        : pointColorHover;
    if (property === 'pointOutlineWidth') return pointOutlineWidth;
    if (property === 'pointSize')
      return pointSize.length === 1 ? pointSize[0] : pointSize;
    if (property === 'pointSizeSelected') return pointSizeSelected;
    if (property === 'pointSizeMouseDetection') return pointSizeMouseDetection;
    if (property === 'showPointConnections') return showPointConnections;
    if (property === 'pointConnectionColor')
      return pointConnectionColor.length === 1
        ? pointConnectionColor[0]
        : pointConnectionColor;
    if (property === 'pointConnectionColorActive')
      return pointConnectionColorActive.length === 1
        ? pointConnectionColorActive[0]
        : pointConnectionColorActive;
    if (property === 'pointConnectionColorHover')
      return pointConnectionColorHover.length === 1
        ? pointConnectionColorHover[0]
        : pointConnectionColorHover;
    if (property === 'pointConnectionColorBy') return pointConnectionColorBy;
    if (property === 'pointConnectionOpacity')
      return pointConnectionOpacity.length === 1
        ? pointConnectionOpacity[0]
        : pointConnectionOpacity;
    if (property === 'pointConnectionOpacityBy')
      return pointConnectionOpacityBy;
    if (property === 'pointConnectionOpacityActive')
      return pointConnectionOpacityActive;
    if (property === 'pointConnectionSize')
      return pointConnectionSize.length === 1
        ? pointConnectionSize[0]
        : pointConnectionSize;
    if (property === 'pointConnectionSizeActive')
      return pointConnectionSizeActive;
    if (property === 'pointConnectionSizeBy') return pointConnectionSizeBy;
    if (property === 'pointConnectionMaxIntPointsPerSegment')
      return pointConnectionMaxIntPointsPerSegment;
    if (property === 'pointConnectionTolerance')
      return pointConnectionTolerance;
    if (property === 'reticleColor') return reticleColor;
    if (property === 'regl') return renderer.regl;
    if (property === 'showReticle') return showReticle;
    if (property === 'version') return version;
    if (property === 'width') return width;
    if (property === 'xScale') return xScale;
    if (property === 'yScale') return yScale;
    if (property === 'performanceMode') return performanceMode;
    if (property === 'gamma') return renderer.gamma;
    if (property === 'renderer') return renderer;

    return undefined;
  };

  /** @type {(properties: Partial<import('./types').Settable>) => void} */
  const set = (properties = {}) => {
    checkDeprecations(properties);

    if (
      properties.backgroundColor !== undefined ||
      properties.background !== undefined
    ) {
      setBackgroundColor(properties.backgroundColor || properties.background);
    }

    if (properties.backgroundImage !== undefined) {
      setBackgroundImage(properties.backgroundImage);
    }

    if (properties.cameraTarget !== undefined) {
      setCameraTarget(properties.cameraTarget);
    }

    if (properties.cameraDistance !== undefined) {
      setCameraDistance(properties.cameraDistance);
    }

    if (properties.cameraRotation !== undefined) {
      setCameraRotation(properties.cameraRotation);
    }

    if (properties.cameraView !== undefined) {
      setCameraView(properties.cameraView);
    }

    if (properties.colorBy !== undefined) {
      setColorBy(properties.colorBy);
    }

    if (properties.pointColor !== undefined) {
      setPointColor(properties.pointColor);
    }

    if (properties.pointColorActive !== undefined) {
      setPointColorActive(properties.pointColorActive);
    }

    if (properties.pointColorHover !== undefined) {
      setPointColorHover(properties.pointColorHover);
    }

    if (properties.pointSize !== undefined) {
      setPointSize(properties.pointSize);
    }

    if (properties.pointSizeSelected !== undefined) {
      setPointSizeSelected(properties.pointSizeSelected);
    }

    if (properties.pointSizeMouseDetection !== undefined) {
      setPointSizeMouseDetection(properties.pointSizeMouseDetection);
    }

    if (properties.sizeBy !== undefined) {
      setSizeBy(properties.sizeBy);
    }

    if (properties.opacity !== undefined) {
      setOpacity(properties.opacity);
    }

    if (properties.showPointConnections !== undefined) {
      setShowPointConnections(properties.showPointConnections);
    }

    if (properties.pointConnectionColor !== undefined) {
      setPointConnectionColor(properties.pointConnectionColor);
    }

    if (properties.pointConnectionColorActive !== undefined) {
      setPointConnectionColorActive(properties.pointConnectionColorActive);
    }

    if (properties.pointConnectionColorHover !== undefined) {
      setPointConnectionColorHover(properties.pointConnectionColorHover);
    }

    if (properties.pointConnectionColorBy !== undefined) {
      setPointConnectionColorBy(properties.pointConnectionColorBy);
    }

    if (properties.pointConnectionOpacityBy !== undefined) {
      setPointConnectionOpacityBy(properties.pointConnectionOpacityBy);
    }

    if (properties.pointConnectionOpacity !== undefined) {
      setPointConnectionOpacity(properties.pointConnectionOpacity);
    }

    if (properties.pointConnectionOpacityActive !== undefined) {
      setPointConnectionOpacityActive(properties.pointConnectionOpacityActive);
    }

    if (properties.pointConnectionSize !== undefined) {
      setPointConnectionSize(properties.pointConnectionSize);
    }

    if (properties.pointConnectionSizeActive !== undefined) {
      setPointConnectionSizeActive(properties.pointConnectionSizeActive);
    }

    if (properties.pointConnectionSizeBy !== undefined) {
      setPointConnectionSizeBy(properties.pointConnectionSizeBy);
    }

    if (properties.pointConnectionMaxIntPointsPerSegment !== undefined) {
      setPointConnectionMaxIntPointsPerSegment(
        properties.pointConnectionMaxIntPointsPerSegment
      );
    }

    if (properties.pointConnectionTolerance !== undefined) {
      setPointConnectionTolerance(properties.pointConnectionTolerance);
    }

    if (properties.opacityBy !== undefined) {
      setOpacityBy(properties.opacityBy);
    }

    if (properties.lassoColor !== undefined) {
      setLassoColor(properties.lassoColor);
    }

    if (properties.lassoLineWidth !== undefined) {
      setLassoLineWidth(properties.lassoLineWidth);
    }

    if (properties.lassoMinDelay !== undefined) {
      setLassoMinDelay(properties.lassoMinDelay);
    }

    if (properties.lassoMinDist !== undefined) {
      setLassoMinDist(properties.lassoMinDist);
    }

    if (properties.lassoClearEvent !== undefined) {
      setLassoClearEvent(properties.lassoClearEvent);
    }

    if (properties.lassoInitiator !== undefined) {
      setLassoInitiator(properties.lassoInitiator);
    }

    if (properties.lassoInitiatorParentElement !== undefined) {
      setLassoInitiatorParentElement(properties.lassoInitiatorParentElement);
    }

    if (properties.keyMap !== undefined) {
      setKeyMap(properties.keyMap);
    }

    if (properties.mouseMode !== undefined) {
      setMouseMode(properties.mouseMode);
    }

    if (properties.showReticle !== undefined) {
      setShowReticle(properties.showReticle);
    }

    if (properties.reticleColor !== undefined) {
      setReticleColor(properties.reticleColor);
    }

    if (properties.pointOutlineWidth !== undefined) {
      setPointOutlineWidth(properties.pointOutlineWidth);
    }

    if (properties.height !== undefined) {
      setHeight(properties.height);
    }

    if (properties.width !== undefined) {
      setWidth(properties.width);
    }

    if (properties.aspectRatio !== undefined) {
      setDataAspectRatio(properties.aspectRatio);
    }

    if (properties.xScale !== undefined) {
      setXScale(properties.xScale);
    }

    if (properties.yScale !== undefined) {
      setYScale(properties.yScale);
    }

    if (properties.deselectOnDblClick !== undefined) {
      setDeselectOnDblClick(properties.deselectOnDblClick);
    }

    if (properties.deselectOnEscape !== undefined) {
      setDeselectOnEscape(properties.deselectOnEscape);
    }

    if (properties.opacityByDensityFill !== undefined) {
      setOpacityByDensityFill(properties.opacityByDensityFill);
    }

    if (properties.opacityInactiveMax !== undefined) {
      setOpacityInactiveMax(properties.opacityInactiveMax);
    }

    if (properties.opacityInactiveScale !== undefined) {
      setOpacityInactiveScale(properties.opacityInactiveScale);
    }

    if (properties.gamma !== undefined) {
      setGamma(properties.gamma);
    }

    // setWidth and setHeight can be async when width or height are set to
    // 'auto'. And since draw() would have anyway been async we can just make
    // all calls async.
    return new Promise((resolve) => {
      window.requestAnimationFrame(() => {
        if (!canvas) return; // Instance was destroyed in between
        updateViewAspectRatio();
        camera.refresh();
        renderer.refresh();
        draw = true;
        resolve();
      });
    });
  };

  /**
   * @param {number[]} cameraView
   * @param {import('./types').ScatterplotMethodOptions['preventEvent']} options
   */
  const view = (cameraView, { preventEvent = false } = {}) => {
    setCameraView(cameraView);
    draw = true;
    preventEventView = preventEvent;
  };

  /**
   * @param {number | number[]} point
   * @param {import('./types').ScatterplotMethodOptions['hover']} options
   */
  const hover = (
    point,
    { showReticleOnce = false, preventEvent = false } = {}
  ) => {
    let needsRedraw = false;

    if (point >= 0 && point < numPoints) {
      needsRedraw = true;
      const oldHoveredPoint = hoveredPoint;
      const newHoveredPoint = point !== hoveredPoint;
      if (
        +oldHoveredPoint >= 0 &&
        newHoveredPoint &&
        !selectionSet.has(oldHoveredPoint)
      ) {
        setPointConnectionColorState([oldHoveredPoint], 0);
      }
      hoveredPoint = point;
      hoveredPointIndexBuffer.subdata(indexToStateTexCoord(point));
      if (!selectionSet.has(point)) setPointConnectionColorState([point], 2);
      if (newHoveredPoint && !preventEvent)
        pubSub.publish('pointover', hoveredPoint);
    } else {
      needsRedraw = +hoveredPoint >= 0;
      if (needsRedraw) {
        if (!selectionSet.has(hoveredPoint)) {
          setPointConnectionColorState([hoveredPoint], 0);
        }
        if (!preventEvent) {
          pubSub.publish('pointout', hoveredPoint);
        }
      }
      hoveredPoint = undefined;
    }

    if (needsRedraw) {
      draw = true;
      drawReticleOnce = showReticleOnce;
    }
  };

  const initCamera = () => {
    if (!camera)
      camera = dom2dCamera(canvas, { isPanInverted: [false, true] });

    if (initialProperties.cameraView) {
      camera.setView(clone(initialProperties.cameraView));
    } else if (
      initialProperties.cameraTarget ||
      initialProperties.cameraDistance ||
      initialProperties.cameraRotation
    ) {
      camera.lookAt(
        [...(initialProperties.cameraTarget || DEFAULT_TARGET)],
        initialProperties.cameraDistance || DEFAULT_DISTANCE,
        initialProperties.cameraRotation || DEFAULT_ROTATION
      );
    } else {
      camera.setView(clone(DEFAULT_VIEW));
    }

    topRightNdc = getScatterGlPos(1, 1);
    bottomLeftNdc = getScatterGlPos(-1, -1);
  };

  /**
   * @param {import('./types').ScatterplotMethodOptions['preventEvent']} options
   */
  const reset = ({ preventEvent = false } = {}) => {
    initCamera();
    updateScales();

    if (preventEvent) return;

    pubSub.publish('view', {
      view: camera.view,
      camera,
      xScale,
      yScale,
    });
  };

  const keyUpHandler = ({ key }) => {
    switch (key) {
      case 'Escape':
        if (deselectOnEscape) deselect();
        break;
      // Nothing
    }
  };

  const mouseEnterCanvasHandler = () => {
    isMouseInCanvas = true;
  };

  const mouseLeaveCanvasHandler = () => {
    hover();
    isMouseInCanvas = false;
    draw = true;
  };

  const wheelHandler = () => {
    draw = true;
  };

  /** @type {() => void} */
  const clear = () => {
    setPoints([]);
    pointConnections.clear();
  };

  const resizeHandler = () => {
    camera.refresh();
    const autoWidth = width === AUTO;
    const autoHeight = height === AUTO;
    if (autoWidth || autoHeight) {
      const { width: newWidth, height: newHeight } =
        canvas.getBoundingClientRect();

      if (autoWidth) setCurrentWidth(newWidth);
      if (autoHeight) setCurrentHeight(newHeight);

      updateViewAspectRatio();
      draw = true;
    }
  };

  /** @type {() => ImageData} */
  const exportFn = () =>
    canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);

  const init = () => {
    updateViewAspectRatio();
    initCamera();
    updateScales();

    lasso = createLine(renderer.regl, {
      color: lassoColor,
      width: lassoLineWidth,
      is2d: true,
    });
    pointConnections = createLine(renderer.regl, {
      color: pointConnectionColor,
      colorHover: pointConnectionColorHover,
      colorActive: pointConnectionColorActive,
      opacity:
        pointConnectionOpacity === null ? null : pointConnectionOpacity[0],
      width: pointConnectionSize[0],
      widthActive: pointConnectionSizeActive,
      is2d: true,
    });
    reticleHLine = createLine(renderer.regl, {
      color: reticleColor,
      width: 1,
      is2d: true,
    });
    reticleVLine = createLine(renderer.regl, {
      color: reticleColor,
      width: 1,
      is2d: true,
    });
    computePointSizeMouseDetection();

    // Event listeners
    canvas.addEventListener('wheel', wheelHandler);

    // Buffers
    normalPointsIndexBuffer = renderer.regl.buffer();
    selectedPointsIndexBuffer = renderer.regl.buffer();
    hoveredPointIndexBuffer = renderer.regl.buffer({
      usage: 'dynamic',
      type: 'float',
      length: FLOAT_BYTES * 2, // This buffer is fixed to exactly 1 point consisting of 2 coordinates
    });

    colorTex = createColorTexture();
    encodingTex = createEncodingTexture();

    // Set dimensions
    const whenSet = set({
      backgroundImage,
      width,
      height,
      keyMap,
    });
    updateLassoInitiatorStyle();

    // Setup event handler
    window.addEventListener('keyup', keyUpHandler, false);
    window.addEventListener('blur', blurHandler, false);
    window.addEventListener('mouseup', mouseUpHandler, false);
    window.addEventListener('mousemove', mouseMoveHandler, false);
    canvas.addEventListener('mousedown', mouseDownHandler, false);
    canvas.addEventListener('mouseenter', mouseEnterCanvasHandler, false);
    canvas.addEventListener('mouseleave', mouseLeaveCanvasHandler, false);
    canvas.addEventListener('click', mouseClickHandler, false);
    canvas.addEventListener('dblclick', mouseDblClickHandler, false);

    if ('ResizeObserver' in window) {
      canvasObserver = new ResizeObserver(resizeHandler);
      canvasObserver.observe(canvas);
    } else {
      window.addEventListener('resize', resizeHandler);
      window.addEventListener('orientationchange', resizeHandler);
    }

    whenSet.then(() => {
      pubSub.publish('init');
    });
  };

  const cancelFrameListener = renderer.onFrame(() => {
    // Update camera: this needs to happen on every
    isViewChanged = camera.tick();

    if (!isInit || !(draw || isTransitioning)) return;

    if (isTransitioning && !tween(transitionDuration, transitionEasing))
      endTransition();

    if (isViewChanged) {
      topRightNdc = getScatterGlPos(1, 1);
      bottomLeftNdc = getScatterGlPos(-1, -1);
      if (opacityBy === 'density') getNumPointsInViewDb();
    }

    renderer.render((widthRatio, heightRatio) => {
      updateProjectionMatrix(widthRatio, heightRatio);

      // eslint-disable-next-line no-underscore-dangle
      if (backgroundImage && backgroundImage._reglType) {
        drawBackgroundImage();
      }

      if (lassoPointsCurr.length > 2) drawPolygon2d();

      // The draw order of the following calls is important!
      if (!isTransitioning) {
        pointConnections.draw({
          projection: getProjection(),
          model: getModel(),
          view: getView(),
        });
      }

      drawPointBodies();
      if (!mouseDown && (showReticle || drawReticleOnce)) drawReticle();
      if (hoveredPoint >= 0) drawHoveredPoint();
      if (selection.length) drawSelectedPoints();

      lasso.draw({
        projection: getProjection(),
        model: getModel(),
        view: getView(),
      });
    }, canvas);

    // Publish camera change
    if (isViewChanged) {
      updateScales();

      if (preventEventView) {
        preventEventView = false;
      } else {
        pubSub.publish('view', {
          view: camera.view,
          camera,
          xScale,
          yScale,
        });
      }
    }

    draw = false;
    drawReticleOnce = false;

    pubSub.publish('draw');
  });

  const redraw = () => {
    draw = true;
  };

  const destroy = () => {
    cancelFrameListener();
    window.removeEventListener('keyup', keyUpHandler, false);
    window.removeEventListener('blur', blurHandler, false);
    window.removeEventListener('mouseup', mouseUpHandler, false);
    window.removeEventListener('mousemove', mouseMoveHandler, false);
    canvas.removeEventListener('mousedown', mouseDownHandler, false);
    canvas.removeEventListener('mouseenter', mouseEnterCanvasHandler, false);
    canvas.removeEventListener('mouseleave', mouseLeaveCanvasHandler, false);
    canvas.removeEventListener('click', mouseClickHandler, false);
    canvas.removeEventListener('dblclick', mouseDblClickHandler, false);
    if (canvasObserver) {
      canvasObserver.disconnect();
    } else {
      window.removeEventListener('resize', resizeHandler);
      window.removeEventListener('orientationchange', resizeHandler);
    }
    canvas = undefined;
    camera.dispose();
    camera = undefined;
    lasso.destroy();
    pointConnections.destroy();
    reticleHLine.destroy();
    reticleVLine.destroy();
    pubSub.publish('destroy');
    pubSub.clear();
    if (!initialProperties.renderer) {
      // Since the user did not pass in an externally created renderer we can
      // assume that the renderer is only used by this scatter plot instance.
      // Therefore it's save to destroy it when this scatter plot instance is
      // destroyed.
      renderer.destroy();
    }
  };

  init();

  return {
    clear: withDraw(clear),
    createTextureFromUrl: (/** @type {string} */ url) =>
      createTextureFromUrl(renderer.regl, url),
    deselect,
    destroy,
    draw: publicDraw,
    get,
    hover,
    redraw,
    refresh: renderer.refresh,
    reset: withDraw(reset),
    select,
    set,
    export: exportFn,
    subscribe: pubSub.subscribe,
    unsubscribe: pubSub.unsubscribe,
    view,
  };
};

export default createScatterplot;
export { createRegl, createRenderer, createTextureFromUrl };
