export type Vec2 = {
  x: number;
  y: number;
};

export type Vec3 = {
  x: number;
  y: number;
  z: number;
};

export type Triangle = [Vec3, Vec3, Vec3];

export type Segment2D = [Vec2, Vec2];

export type Segment3D = [Vec3, Vec3];

export function sub(a: Vec3, b: Vec3): Vec3 {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
    z: a.z - b.z,
  };
}

export function cross(a: Vec3, b: Vec3): Vec3 {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
}

export function lerp(a: Vec3, b: Vec3, t: number): Vec3 {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    z: a.z + (b.z - a.z) * t,
  };
}

export function easeOutCubic(progress: number): number {
  return 1 - Math.pow(1 - progress, 3);
}

export function rotateX(p: Vec3, angle: number): Vec3 {
  const c = Math.cos(angle);
  const s = Math.sin(angle);

  return {
    x: p.x,
    y: p.y * c - p.z * s,
    z: p.y * s + p.z * c,
  };
}

export function rotateY(p: Vec3, angle: number): Vec3 {
  const c = Math.cos(angle);
  const s = Math.sin(angle);

  return {
    x: p.x * c + p.z * s,
    y: p.y,
    z: -p.x * s + p.z * c,
  };
}

export function rotatePoint(p: Vec3, angleX: number, angleY: number): Vec3 {
  return rotateY(rotateX(p, angleX), angleY);
}

export function normalOfTriangle([a, b, c]: Triangle): Vec3 {
  return cross(sub(b, a), sub(c, a));
}

export function averageZ(points: Vec3[]): number {
  return points.reduce((sum, p) => sum + p.z, 0) / points.length;
}

export function barycentric2D(p: Vec2, a: Vec2, b: Vec2, c: Vec2) {
  const det =
    (b.y - c.y) * (a.x - c.x) + (c.x - b.x) * (a.y - c.y);

  const wa =
    ((b.y - c.y) * (p.x - c.x) + (c.x - b.x) * (p.y - c.y)) / det;

  const wb =
    ((c.y - a.y) * (p.x - c.x) + (a.x - c.x) * (p.y - c.y)) / det;

  const wc = 1 - wa - wb;

  return { wa, wb, wc };
}

export function segmentToPath(segment: Segment3D, scale: number): string {
  const points = segment.map((p) => ({
    x: Math.round(p.x * scale * 100) / 100,
    y: Math.round(-p.y * scale * 100) / 100,
  }));

  return `M${points[0].x},${points[0].y} L${points[1].x},${points[1].y}`;
}

export function escapeSvgAttribute(value: number | string): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function svgToCssUrl(svg: string): string {
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

const TEMPLATE_TOP: Vec2 = { x: 11.5, y: 10.9 };
const TEMPLATE_LEFT: Vec2 = { x: 1, y: 29.1 };
const TEMPLATE_RIGHT: Vec2 = { x: 22.1, y: 29.1 };

const TEMPLATE_SEGMENTS: Segment2D[] = [
  [TEMPLATE_TOP, TEMPLATE_LEFT],
  [TEMPLATE_LEFT, TEMPLATE_RIGHT],
  [TEMPLATE_RIGHT, TEMPLATE_TOP],
  [
    { x: 3.5, y: 24.8 },
    { x: 14.6, y: 24.8 },
  ],
  [
    { x: 17.1, y: 29.1 },
    { x: 11.5, y: 19.5 },
  ],
  [
    { x: 14, y: 15.2 },
    { x: 8.5, y: 24.8 },
  ],
];

function mapTemplatePointToFace(p: Vec2, face: Triangle): Vec3 {
  const { wa, wb, wc } = barycentric2D(
    p,
    TEMPLATE_TOP,
    TEMPLATE_RIGHT,
    TEMPLATE_LEFT
  );

  const [top, right, left] = face;

  return {
    x: top.x * wa + right.x * wb + left.x * wc,
    y: top.y * wa + right.y * wb + left.y * wc,
    z: top.z * wa + right.z * wb + left.z * wc,
  };
}

function createTemplateSegmentsOnFace(face: Triangle): Segment3D[] {
  return TEMPLATE_SEGMENTS.map(([start, end]) => [
    mapTemplatePointToFace(start, face),
    mapTemplatePointToFace(end, face),
  ]);
}

function createTriangleBodyFaces(): Triangle[] {
  const top: Vec3 = { x: 0, y: 0.62, z: 0.45 };
  const left: Vec3 = { x: -0.58, y: -0.38, z: 0.45 };
  const right: Vec3 = { x: 0.58, y: -0.38, z: 0.45 };
  const back: Vec3 = { x: 0, y: -0.05, z: -0.55 };

  return [
    [top, right, left],
    [top, left, back],
    [top, back, right],
    [left, right, back],
  ];
}

export function createLogoPath(angleX: number, angleY: number): string {
  const visibleSegments = createTriangleBodyFaces()
    .flatMap((face) => {
      const rotatedFace = face.map((point) =>
        rotatePoint(point, angleX, angleY)
      ) as Triangle;

      if (normalOfTriangle(rotatedFace).z >= 0) {
        return [];
      }

      return createTemplateSegmentsOnFace(face).map(
        (segment) =>
          segment.map((point) => rotatePoint(point, angleX, angleY)) as Segment3D
      );
    })
    .sort((a, b) => averageZ(a) - averageZ(b));

  return visibleSegments.map((segment) => segmentToPath(segment, 64)).join(" ");
}
