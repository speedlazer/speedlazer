Game = @Game

class Game.BezierPath

  scalePoints: (points, { origin, scale }) ->
    o =
      x: (points[0].x * scale.x) - origin.x
      y: (points[0].y * scale.y) - origin.y

    for p, i in points
      x: (p.x * scale.x) - o.x
      y: (p.y * scale.y) - o.y

  buildPathFrom: (points) ->
    result = {
      distance: 0
      curves: []
    }

    # Now we need to create/collect the
    # control points for a smooth line

    # port from: http://www.codeproject.com/Articles/31859/
    # Draw-a-Smooth-Curve-through-a-Set-of-2D-Points-wit
    [firstControlPoints, secondControlPoints] = @getCurveControlPoints(points)

    for i in [0...points.length - 1]
      a = points[i]
      b = points[i + 1]
      c1 = firstControlPoints[i]
      c2 = secondControlPoints[i]

      dx = Math.abs(a.x - b.x)
      dy = Math.abs(a.y - b.y)
      curveDistance = Math.sqrt((dx ** 2) + (dy ** 2))
      curvePoints = [b, c2, c1, a]
      result.distance += curveDistance
      result.curves.push {
        distance: curveDistance
        points: curvePoints
      }
    result

  pointOnPath: (path, location) ->
    [curve, v, ci] = @getCurveAndLocation(path, location)
    p = jsBezier.pointOnCurve(curve.points, v)
    p.c = ci
    p

  angleOnPath: (path, location) ->
    p1 = @pointOnPath(path, location)
    p2 = @pointOnPath(path, Math.min(location + 0.01, 1.0))
    angle = Math.atan2(p1.y - p2.y, p1.x - p2.x)
    angle *= (180 / Math.PI)
    (angle + 180) % 360

  getCurveAndLocation: (path, location) ->
    distance = 0.0
    currentCurve = 0

    curve = path.curves[currentCurve]
    relDistance = (distance + curve.distance) / path.distance
    while location > relDistance
      currentCurve += 1
      distance += curve.distance
      curve = path.curves[currentCurve]
      relDistance = (distance + curve.distance) / path.distance

    partDistance = curve.distance / path.distance
    pastDistance = distance / path.distance
    v = ((location - pastDistance) / partDistance)
    [curve, v, currentCurve]

  getCurveControlPoints: (points) ->
    n = points.length - 1
    if n < 1
      return []
    if n is 1 # Special case: Bezier curve should be a straight line.
      firstControlPoints = [
        # 3P1 = 2P0 + P3
        x: (2.0 * points[0].x + points[1].x) / 3.0
        y: (2.0 * points[0].y + points[1].y) / 3.0
      ]
      secondControlPoints = [
        # P2 = 2P1 – P0
        x: 2.0 * firstControlPoints[0].x - points[0].x
        y: 2.0 * firstControlPoints[0].y - points[0].y
      ]
      return [firstControlPoints, secondControlPoints]

    # Calculate first Bezier control points
    # Right hand side vector
    # Set right hand side X values

    rhs = (for i in [1...n - 1]
      4.0 * points[i].x + 2.0 * points[i + 1].x
    )
    rhs.unshift(points[0].x + 2.0 * points[1].x)
    rhs.push((8.0 * points[n - 1].x + points[n].x) / 2.0)

    # Get first control points X-values
    x = @getFirstControlPoints rhs

    # Set right hand side Y values

    rhs = (for i in [1...n - 1]
      4.0 * points[i].y + 2.0 * points[i + 1].y
    )
    rhs.unshift(points[0].y + 2.0 * points[1].y)
    rhs.push((8.0 * points[n - 1].y + points[n].y) / 2.0)

    # Get first control points Y-values
    y = @getFirstControlPoints rhs

    # Fill output arrays.
    firstControlPoints = []
    secondControlPoints = []
    for i in [0 ... n]
      # First control point
      firstControlPoints.push x: x[i], y: y[i]
      # Second control point
      if i < n - 1
        secondControlPoints.push
          x: 2.0 * points[i + 1].x - x[i + 1]
          y: 2.0 * points[i + 1].y - y[i + 1]
      else
        secondControlPoints.push
          x: (points[n].x + x[n - 1]) / 2.0
          y: (points[n].y + y[n - 1]) / 2.0
    [firstControlPoints, secondControlPoints]

  # Solves a tridiagonal system for one of coordinates (x or y)
  # of first Bezier control points.
  #
  # @param rhs Right hand side vector.
  # @return Solution vector
  getFirstControlPoints: (rhs) ->
    n = rhs.length
    x = [] # Solution vector.
    tmp = [null] # Temp workspace.

    b = 2.0
    x.push(rhs[0] / b)

    for i in [1...n]
      # Decomposition and forward substitution.
      tmp.push(1 / b)
      b = if i < n - 1 then 4.0 else 3.5
      b -= tmp[i]
      x.push((rhs[i] - x[i - 1]) / b)

    for i in [1...n]
      x[n - i - 1] -= tmp[n - i] * x[n - i] # Backsubstitution.
    x

