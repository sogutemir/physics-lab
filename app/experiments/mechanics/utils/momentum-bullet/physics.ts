// Constants
export const GRAVITY = 9.81; // m/s²

// Types
export interface Vector {
  x: number;
  y: number;
}

export interface Projectile {
  id: number;
  position: Vector;
  velocity: Vector;
  acceleration: Vector;
  mass: number;
  radius: number;
  color: string;
  elasticity: number;
  penetration?: number;
  entryPoint?: Vector;
  entryVelocity?: Vector;
  stuckInside?: boolean;
}

export interface TargetBox {
  position: Vector;
  width: number;
  height: number;
  mass: number;
  color: string;
  elasticity: number;
  velocity: Vector;
  isFixed: boolean;
  hardness?: number;
  thickness?: number;
  perforated?: boolean;
}

export interface CollisionResult {
  hasCollided: boolean;
  newVelocity1?: Vector;
  newVelocity2?: Vector;
  impulse?: number;
  collisionPoint?: Vector;
  penetration?: number;
  boxPerforated?: boolean;
}

// Vector operations
export const addVectors = (v1: Vector, v2: Vector): Vector => ({
  x: v1.x + v2.x,
  y: v1.y + v2.y,
});

export const subtractVectors = (v1: Vector, v2: Vector): Vector => ({
  x: v1.x - v2.x,
  y: v1.y - v2.y,
});

export const multiplyVector = (v: Vector, scalar: number): Vector => ({
  x: v.x * scalar,
  y: v.y * scalar,
});

export const dotProduct = (v1: Vector, v2: Vector): number =>
  v1.x * v2.x + v1.y * v2.y;

export const magnitude = (v: Vector): number =>
  Math.sqrt(v.x * v.x + v.y * v.y);

export const normalize = (v: Vector): Vector => {
  const mag = magnitude(v);
  if (mag === 0) return { x: 0, y: 0 };
  return { x: v.x / mag, y: v.y / mag };
};

// Physics calculations
export const calculateTrajectory = (
  initialPosition: Vector,
  initialVelocity: Vector,
  time: number,
  gravity = GRAVITY
): Vector => {
  return {
    x: initialPosition.x + initialVelocity.x * time,
    y:
      initialPosition.y +
      initialVelocity.y * time +
      0.5 * gravity * time * time,
  };
};

export const calculateVelocityFromAngle = (
  speed: number,
  angleInDegrees: number
): Vector => {
  const angleInRadians = (angleInDegrees * Math.PI) / 180;
  return {
    x: speed * Math.cos(angleInRadians),
    y: -speed * Math.sin(angleInRadians), // Negative because canvas y-axis is inverted
  };
};

// Detect collision between projectile and box with penetration effects
export const detectProjectileBoxCollision = (
  projectile: Projectile,
  box: TargetBox
): CollisionResult => {
  // Safety check for box
  if (!box || !box.position) {
    return { hasCollided: false };
  }

  // Find the closest point on the box to the projectile center
  const closestX = Math.max(
    box.position.x,
    Math.min(projectile.position.x, box.position.x + box.width)
  );
  const closestY = Math.max(
    box.position.y,
    Math.min(projectile.position.y, box.position.y + box.height)
  );

  // Calculate distance from closest point to circle center
  const distanceX = projectile.position.x - closestX;
  const distanceY = projectile.position.y - closestY;
  const distanceSquared = distanceX * distanceX + distanceY * distanceY;

  // Check if distance is less than radius squared
  if (distanceSquared > projectile.radius * projectile.radius) {
    return { hasCollided: false };
  }

  // Collision detected - Calculate normal vector from box to projectile
  const collisionPoint = { x: closestX, y: closestY };
  let normal: Vector;

  // If projectile center is inside the box, use the minimum penetration vector
  const isInside =
    projectile.position.x >= box.position.x &&
    projectile.position.x <= box.position.x + box.width &&
    projectile.position.y >= box.position.y &&
    projectile.position.y <= box.position.y + box.height;

  if (isInside) {
    // If the projectile is already marked as stuck inside, just keep it there
    if (projectile.stuckInside) {
      // Merminin kutuyla birlikte hareket etmesi için aynı hızı uygula
      return {
        hasCollided: true,
        newVelocity1: box.velocity, // Mermi kutuyla aynı hızda hareket etmeli
        newVelocity2: box.velocity, // Kutu kendi hızında hareket etmeli
        collisionPoint,
        impulse: 0,
      };
    }

    // Find the minimum penetration vector
    const penetrations = [
      { x: box.position.x + box.width - projectile.position.x, y: 0 }, // right
      { x: box.position.x - projectile.position.x, y: 0 }, // left
      { x: 0, y: box.position.y + box.height - projectile.position.y }, // bottom
      { x: 0, y: box.position.y - projectile.position.y }, // top
    ];

    // Find minimum penetration distance
    let minPenetration = Infinity;
    let minIndex = 0;

    penetrations.forEach((p, i) => {
      const dist = Math.abs(p.x) + Math.abs(p.y);
      if (dist < minPenetration) {
        minPenetration = dist;
        minIndex = i;
      }
    });

    normal = normalize(penetrations[minIndex]);

    // If this is the first time the projectile enters the box, record the entry point
    if (!projectile.entryPoint) {
      // Store the entry point and velocity
      (projectile as any).entryPoint = { ...collisionPoint };
      (projectile as any).entryVelocity = { ...projectile.velocity };

      // Calculate initial penetration based on projectile speed and box hardness
      const speed = magnitude(projectile.velocity);
      const boxHardness = box.hardness || 10; // Default hardness if not specified
      const projectileMass = projectile.mass;

      // Higher speed and mass, and lower hardness means more penetration
      const penetrationFactor = box.isFixed ? 0.5 : 0.1; // Sabit kutular için penetrasyon faktörünü artırdık (0.2 -> 0.5)
      (projectile as any).penetration =
        ((speed * projectileMass) / boxHardness) * penetrationFactor;

      // For fixed boxes, check if the projectile has enough force to perforate the box
      let boxPerforated = false;

      if (box.isFixed) {
        const thickness = box.thickness || 5;
        const perforationThreshold = boxHardness * thickness * 0.2;
        const projectileForce = (speed * speed * projectileMass) / 10;

        boxPerforated = projectileForce > perforationThreshold;

        if (boxPerforated) {
          // Kutu delindiyse artık sabit olmamalı
          (box as any).perforated = true;
          (box as any).isFixed = false;

          // Momentum korunumu prensibi (p = mv)
          const totalMass = projectile.mass + box.mass;
          const finalVelocity = {
            x: (projectile.mass * projectile.velocity.x) / totalMass,
            y: (projectile.mass * projectile.velocity.y) / totalMass,
          };

          return {
            hasCollided: true,
            newVelocity1: finalVelocity, // Mermi ve kutu aynı hızda hareket edecek
            newVelocity2: finalVelocity, // v = p_total / m_total
            collisionPoint,
            impulse: projectile.mass * speed,
            penetration: (projectile as any).penetration,
            boxPerforated,
          };
        } else {
          // Kutuyu delecek gücü yoksa, içine saplanıyor
          (projectile as any).stuckInside = true; // Mermi saplandı olarak işaretle
          (box as any).isFixed = false; // Kutunun sabit olmadığını ayarla

          // Momentum korunumu prensibi (p = mv)
          const totalMass = projectile.mass + box.mass;
          const finalVelocity = {
            x: (projectile.mass * projectile.velocity.x) / totalMass,
            y: (projectile.mass * projectile.velocity.y) / totalMass,
          };

          return {
            hasCollided: true,
            newVelocity1: finalVelocity, // Mermi ve kutu aynı hızda hareket edecek
            newVelocity2: finalVelocity, // v = p_total / m_total
            collisionPoint,
            impulse: projectile.mass * speed,
            penetration: (projectile as any).penetration,
            boxPerforated: false,
          };
        }
      }

      // Reduce velocity based on penetration
      const velocityReductionFactor = box.isFixed ? 0.7 : 0.8;

      if (!box.isFixed) {
        // Mermi kutuya giriyor ve artık saplanıyor
        (projectile as any).stuckInside = true;

        // Momentum korunumu prensibi (p1 + p2 = (m1 + m2)v_son)
        const totalMass = projectile.mass + box.mass;
        const finalVelocity = {
          x:
            (projectile.mass * projectile.velocity.x +
              box.mass * box.velocity.x) /
            totalMass,
          y:
            (projectile.mass * projectile.velocity.y +
              box.mass * box.velocity.y) /
            totalMass,
        };

        return {
          hasCollided: true,
          newVelocity1: finalVelocity,
          newVelocity2: finalVelocity,
          collisionPoint,
          impulse: projectile.mass * speed,
          penetration: (projectile as any).penetration,
          boxPerforated,
        };
      }

      // Sabit kutuya girmeye çalışıyor, saplamayı işaretle
      (projectile as any).stuckInside = true;

      // Sabit kutuya çarptığında momentum aktarımı yapmalı ve kutu hareket etmeli
      (box as any).isFixed = false; // Kutu artık sabit değil

      // Momentum korunumu prensibi
      const totalMass = projectile.mass + box.mass;
      const finalVelocity = {
        x: (projectile.mass * projectile.velocity.x) / totalMass,
        y: (projectile.mass * projectile.velocity.y) / totalMass,
      };

      return {
        hasCollided: true,
        newVelocity1: finalVelocity, // Mermi ve kutu aynı hızda hareket edecek
        newVelocity2: finalVelocity, // Kutu artık hareket edebilir
        collisionPoint,
        impulse: projectile.mass * speed,
        penetration: (projectile as any).penetration,
        boxPerforated,
      };
    } else {
      // Projectile is already inside, continue reducing its penetration and velocity
      const penetrationDecrement = box.isFixed && !box.perforated ? 0.05 : 0.1;
      (projectile as any).penetration = Math.max(
        0,
        (projectile as any).penetration - penetrationDecrement
      );

      // If penetration reached zero, handle the collision result
      if ((projectile as any).penetration <= 0) {
        // For perforated boxes or non-fixed boxes, apply momentum conservation
        if (box.perforated || !box.isFixed) {
          (projectile as any).stuckInside = true;

          // Momentum korunumu prensibi
          const totalMass = projectile.mass + box.mass;
          const finalVelocity = {
            x:
              (projectile.mass * projectile.velocity.x +
                box.mass * box.velocity.x) /
              totalMass,
            y:
              (projectile.mass * projectile.velocity.y +
                box.mass * box.velocity.y) /
              totalMass,
          };

          // Hem mermiye hem kutuya aynı hızı veriyoruz
          return {
            hasCollided: true,
            newVelocity1: finalVelocity,
            newVelocity2: finalVelocity,
            collisionPoint,
            impulse: projectile.mass * magnitude(projectile.velocity),
            boxPerforated: box.perforated,
          };
        } else {
          // Sabit kutuya saplandı - kutunun isFixed özelliğini değiştirerek harekete izin ver
          (projectile as any).stuckInside = true;
          (box as any).isFixed = false; // Kutu artık sabit değil

          // Momentum korunumu prensibi
          const totalMass = projectile.mass + box.mass;
          const finalVelocity = {
            x: (projectile.mass * projectile.velocity.x) / totalMass,
            y: (projectile.mass * projectile.velocity.y) / totalMass,
          };

          return {
            hasCollided: true,
            newVelocity1: finalVelocity, // Mermi ve kutu aynı hızda hareket edecek
            newVelocity2: finalVelocity, // Kutu artık hareket edebilir
            collisionPoint,
            impulse: projectile.mass * magnitude(projectile.velocity),
            boxPerforated: false,
          };
        }
      }

      // Mermi kutuya saplanmış durumda, birlikte hareket etsinler
      (projectile as any).stuckInside = true;

      // Continue with momentum conservation while inside
      if (!box.isFixed) {
        const totalMass = projectile.mass + box.mass;
        const finalVelocity = {
          x:
            (projectile.mass * projectile.velocity.x +
              box.mass * box.velocity.x) /
            totalMass,
          y:
            (projectile.mass * projectile.velocity.y +
              box.mass * box.velocity.y) /
            totalMass,
        };

        return {
          hasCollided: true,
          newVelocity1: finalVelocity,
          newVelocity2: finalVelocity,
          collisionPoint,
          impulse: projectile.mass * magnitude(projectile.velocity) * 0.1,
          boxPerforated: false,
        };
      }

      // Sabit durumdaki kutuyu hareket ettirmek için isFixed özelliğini değiştir
      (box as any).isFixed = false;

      // Momentum hesapla
      const totalMass = projectile.mass + box.mass;
      const finalVelocity = {
        x: (projectile.mass * projectile.velocity.x) / totalMass,
        y: (projectile.mass * projectile.velocity.y) / totalMass,
      };

      return {
        hasCollided: true,
        newVelocity1: finalVelocity,
        newVelocity2: finalVelocity,
        collisionPoint,
        impulse: projectile.mass * magnitude(projectile.velocity) * 0.1,
        boxPerforated: false,
      };
    }
  } else {
    // Normal from collision point to circle center
    normal = normalize({
      x: projectile.position.x - collisionPoint.x,
      y: projectile.position.y - collisionPoint.y,
    });
  }

  // Calculate relative velocity
  const relativeVelocity = subtractVectors(projectile.velocity, box.velocity);

  // Calculate relative velocity along the normal
  const velocityAlongNormal = dotProduct(relativeVelocity, normal);

  // Check if objects are moving away from each other
  if (velocityAlongNormal > 0) {
    return { hasCollided: false };
  }

  // Calculate restitution (elasticity)
  const e = Math.min(projectile.elasticity, box.elasticity);

  // Calculate impulse scalar
  let j = -(1 + e) * velocityAlongNormal;

  // If the box is not fixed, use the masses for impulse
  if (!box.isFixed) {
    j /= 1 / projectile.mass + 1 / box.mass;
  } else {
    j /= 1 / projectile.mass;
  }

  // Apply impulse along the normal vector
  const impulse = multiplyVector(normal, j);

  // Calculate new velocities
  const newProjectileVelocity = addVectors(
    projectile.velocity,
    multiplyVector(impulse, 1 / projectile.mass)
  );

  let newBoxVelocity = box.velocity;

  // If the box is not fixed, update its velocity
  if (!box.isFixed) {
    newBoxVelocity = subtractVectors(
      box.velocity,
      multiplyVector(impulse, 1 / box.mass)
    );
  }

  return {
    hasCollided: true,
    newVelocity1: newProjectileVelocity,
    newVelocity2: newBoxVelocity,
    impulse: j,
    collisionPoint,
  };
};

// Original projectile collision detection and resolution
export const detectCollision = (p1: Projectile, p2: Projectile): boolean => {
  const distance = Math.sqrt(
    Math.pow(p2.position.x - p1.position.x, 2) +
      Math.pow(p2.position.y - p1.position.y, 2)
  );
  return distance < p1.radius + p2.radius;
};

export const resolveCollision = (
  p1: Projectile,
  p2: Projectile
): CollisionResult => {
  if (!detectCollision(p1, p2)) {
    return { hasCollided: false };
  }

  // Calculate normal vector
  const normal = normalize(subtractVectors(p2.position, p1.position));

  // Calculate relative velocity
  const relativeVelocity = subtractVectors(p1.velocity, p2.velocity);

  // Calculate relative velocity along normal
  const velocityAlongNormal = dotProduct(relativeVelocity, normal);

  // No collision if objects are moving away from each other
  if (velocityAlongNormal > 0) {
    return { hasCollided: false };
  }

  // Calculate restitution (elasticity)
  const e = Math.min(p1.elasticity, p2.elasticity);

  // Calculate impulse scalar
  const impulseScalar =
    (-(1 + e) * velocityAlongNormal) / (1 / p1.mass + 1 / p2.mass);

  // Apply impulse to velocities
  const impulse = multiplyVector(normal, impulseScalar);

  const newVelocity1 = subtractVectors(
    p1.velocity,
    multiplyVector(impulse, 1 / p1.mass)
  );

  const newVelocity2 = addVectors(
    p2.velocity,
    multiplyVector(impulse, 1 / p2.mass)
  );

  return {
    hasCollided: true,
    newVelocity1,
    newVelocity2,
  };
};
