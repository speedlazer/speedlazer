import Bezier from "bezier-js";

export const normalizeInputPath = path =>
  path.map(point => {
    let x, y;

    if (typeof point === "function") {
      const p = point();
      x = p.x;
      y = p.y;
    } else {
      [x, y] = point;
    }

    if (-1 < x && x < 2) {
      x *= Crafty.viewport.width;
    }

    if (-1 < y && y < 2) {
      y *= Crafty.viewport.height;
    }

    return { x, y };
  });

// Solves a tridiagonal system for one of coordinates (x or y)
// of first Bezier control points.
//
// @param rhs Right hand side vector.
// @return Solution vector
const getFirstControlPoints = rhs => {
  const n = rhs.length;
  const x = []; // Solution vector.
  const tmp = [null]; // Temp workspace.

  let b = 2.0;
  x.push(rhs[0] / b);

  for (let i = 1; i < n; i++) {
    // Decomposition and forward substitution.
    tmp.push(1 / b);
    b = i < n - 1 ? 4.0 : 3.5;
    b -= tmp[i];
    x.push((rhs[i] - x[i - 1]) / b);
  }

  for (let i = 1; i < n; i++) {
    x[n - i - 1] -= tmp[n - i] * x[n - i];
  } // Backsubstitution.
  return x;
};

export const createControlPoints = points => {
  const n = points.length - 1;
  if (n < 1) {
    return [];
  }
  let firstControlPoints, secondControlPoints;
  if (n === 1) {
    // Special case: Bezier curve should be a straight line.
    firstControlPoints = [
      {
        // 3P1 = 2P0 + P3
        x: (2.0 * points[0].x + points[1].x) / 3.0,
        y: (2.0 * points[0].y + points[1].y) / 3.0
      }
    ];
    secondControlPoints = [
      {
        // P2 = 2P1 – P0
        x: 2.0 * firstControlPoints[0].x - points[0].x,
        y: 2.0 * firstControlPoints[0].y - points[0].y
      }
    ];
    return [firstControlPoints, secondControlPoints];
  }

  // Calculate first Bezier control points
  // Right hand side vector
  // Set right hand side X values
  // Set right hand side Y values

  const rhsX = [];
  const rhsY = [];
  for (let i = 1; i < n - 1; i++) {
    rhsX.push(4.0 * points[i].x + 2.0 * points[i + 1].x);
    rhsY.push(4.0 * points[i].y + 2.0 * points[i + 1].y);
  }
  rhsX.unshift(points[0].x + 2.0 * points[1].x);
  rhsY.unshift(points[0].y + 2.0 * points[1].y);

  rhsX.push((8.0 * points[n - 1].x + points[n].x) / 2.0);
  rhsY.push((8.0 * points[n - 1].y + points[n].y) / 2.0);

  // Get first control points X-values
  const x = getFirstControlPoints(rhsX);

  // Get first control points Y-values
  const y = getFirstControlPoints(rhsY);

  // Fill output arrays.
  firstControlPoints = [];
  secondControlPoints = [];
  for (let i = 0; i < n; i++) {
    // First control point
    firstControlPoints.push({ x: x[i], y: y[i] });
    // Second control point
    if (i < n - 1) {
      secondControlPoints.push({
        x: 2.0 * points[i + 1].x - x[i + 1],
        y: 2.0 * points[i + 1].y - y[i + 1]
      });
    } else {
      secondControlPoints.push({
        x: (points[n].x + x[n - 1]) / 2.0,
        y: (points[n].y + y[n - 1]) / 2.0
      });
    }
  }
  return [firstControlPoints, secondControlPoints];
};

export class BezierPath {
  constructor(points) {
    this.points = points;
    this.curves = [];

    const controlPoints = createControlPoints(points);
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const c1 = controlPoints[0][i];
      const c2 = controlPoints[1][i];

      const curve = new Bezier(p1.x, p1.y, c1.x, c1.y, c2.x, c2.y, p2.x, p2.y);
      this.curves.push({
        curve,
        length: curve.length()
      });
    }

    let length = 0;
    this.curves.forEach(c => {
      c.min = length / this.length;
      length += c.length;
      c.max = length / this.length;
    });
  }

  get length() {
    return this.curves.reduce((r, c) => r + c.length, 0);
  }

  getLUT(steps) {
    const step = Math.ceil(this.length / steps);
    return this.curves
      .map(curve => {
        const csteps = Math.ceil(curve.length / step);
        return curve.curve.getLUT(csteps);
      })
      .reduce((r, a) => r.concat(a), []);
  }

  get(t) {
    const c = this.curves.find(c => c.min <= t && c.max >= t);
    if (!c) return null;
    const localT = (t - c.min) / (c.max - c.min);
    return c.curve.get(localT);
  }

  rotationAt(t) {
    const c = this.curves.find(c => c.min <= t && c.max >= t);
    const localT = (t - c.min) / (c.max - c.min);
    const vector = c.curve.derivative(localT);
    const atan = Math.atan2(vector.y, vector.x);
    return (atan * 180) / Math.PI;
  }
}

export const getPathId = path => path.map(p => `${p.x}|${p.y}|`).join();

const pathStorage = {};

export const getBezierPath = normalizedPath => {
  const id = getPathId(normalizedPath);
  pathStorage[id] = pathStorage[id] || new BezierPath(normalizedPath);
  return pathStorage[id];
};
