export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface Point2D {
  x: number;
  y: number;
}

export interface ProjectionConstants {
  c1: number; // sin(theta)
  c2: number; // sin(phi)
  c3: number; // cos(theta)
  c4: number; // cos(phi)
  c5: number; // c3*c2
  c6: number; // c1*c2
  c7: number; // c3*c4
  c8: number; // c1*c4
}

// Projeksiyon sabitlerini hesapla
export const calculateProjectionConstants = (theta: number, phi: number): ProjectionConstants => {
  const th = (theta * Math.PI) / 180;
  const ph = (phi * Math.PI) / 180;
  
  const c1 = Math.sin(th);
  const c2 = Math.sin(ph);
  const c3 = Math.cos(th);
  const c4 = Math.cos(ph);
  
  return {
    c1,
    c2,
    c3,
    c4,
    c5: c3 * c2,
    c6: c1 * c2,
    c7: c3 * c4,
    c8: c1 * c4,
  };
};

// 3D noktayı 2D'ye projeksiyon
export const project3DTo2D = (
  point: Point3D,
  constants: ProjectionConstants,
  distance: number,
  rho: number,
  parallel = false
): Point2D => {
  const { c1, c2, c3, c4, c5, c6, c7, c8 } = constants;
  
  const xObs = -point.x * c1 + point.y * c3;
  const yObs = -point.x * c5 - point.y * c6 + point.z * c4;
  const zObs = -point.x * c7 - point.y * c8 - point.z * c2 + rho;
  
  if (parallel) {
    return {
      x: distance * xObs,
      y: distance * yObs,
    };
  }
  
  return {
    x: (distance * xObs) / zObs,
    y: (distance * yObs) / zObs,
  };
};

// Çizgi çiz
export const drawLine = (
  ctx: CanvasRenderingContext2D,
  start: Point2D,
  end: Point2D
) => {
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
};

// Daire çiz
export const drawCircle = (
  ctx: CanvasRenderingContext2D,
  center: Point2D,
  radius: number,
  fill = false
) => {
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
  if (fill) {
    ctx.fill();
  } else {
    ctx.stroke();
  }
};

// Vektör çiz (ok uçlu)
export const drawVector = (
  ctx: CanvasRenderingContext2D,
  start: Point2D,
  end: Point2D,
  headLength = 10
) => {
  const angle = Math.atan2(end.y - start.y, end.x - start.x);
  
  // Ana çizgi
  drawLine(ctx, start, end);
  
  // Ok uçları
  ctx.beginPath();
  ctx.moveTo(end.x, end.y);
  ctx.lineTo(
    end.x - headLength * Math.cos(angle - Math.PI / 6),
    end.y - headLength * Math.sin(angle - Math.PI / 6)
  );
  ctx.moveTo(end.x, end.y);
  ctx.lineTo(
    end.x - headLength * Math.cos(angle + Math.PI / 6),
    end.y - headLength * Math.sin(angle + Math.PI / 6)
  );
  ctx.stroke();
}; 