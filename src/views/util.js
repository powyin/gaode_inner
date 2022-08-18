function isInPolygon(point, points) {
    console.log(point)
    console.log(points.length)
    let px = point[0];
    let py = point[1];
    var n = points.length / 2;

    let backUp = [];
    for (let i = 0; i < n; i++) {
        backUp.push({ x: points[2 * i], y: points[2 * i + 1] });
    }

    var nCross = 0;
    for (let i = 0; i < n; i++) {
        var p1 = backUp[i];
        var p2 = backUp[(i + 1) % n];
        if (p1.y == p2.y)
            continue;
        if (py < Math.min(p1.y, p2.y))
            continue;
        if (py >= Math.max(p1.y, p2.y))
            continue;
        var x = (py - p1.y) * (p2.x - p1.x) / (p2.y - p1.y) + p1.x;
        if (x > px)
            nCross++;
    }
    return (nCross % 2 == 1);
}


function PointInPoly(pt, poly) {
    let backUp = { x: pt[0], y: pt[1] }
    pt = backUp;
    backUp = [];
    var n = points.length / 2;
    for (let i = 0; i < n; i++) {
        backUp.push({ x: points[2 * i], y: points[2 * i + 1] });
    }
    poly = backUp;

    for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
        ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
            && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
            && (c = !c);
    return c;
}



export default {
    isInPolygon
}