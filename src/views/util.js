function isInPolygon(point, points) {
    points = [
        103.686962, 36.089574, 103.68501, 36.089084, 103.68362, 36.088556,
        103.681764, 36.087463, 103.68126, 36.087012, 103.680461,
        36.086072, 103.678948, 36.083817, 103.687402, 36.081728,
        103.689623, 36.086765, 103.687113, 36.089349,
    ];
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
    isInPolygon,
    PointInPoly,
    mainUrl: "http://172.16.2.50:3000/aoti/navigation"
}

// http://172.16.2.50:3000/aoti/navigation