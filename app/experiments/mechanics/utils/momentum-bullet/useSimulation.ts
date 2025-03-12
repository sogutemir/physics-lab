import { useState, useEffect, useRef, useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import {
  Projectile,
  TargetBox,
  detectCollision,
  resolveCollision,
  detectProjectileBoxCollision,
  addVectors,
  multiplyVector,
} from './physics';

interface SimulationOptions {
  width: number;
  height: number;
  timeScale: number;
  wallElasticity: number;
}

export function useSimulation(options: SimulationOptions) {
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [targetBox, setTargetBox] = useState<TargetBox>({
    position: { x: options.width / 2 - 50, y: options.height / 2 - 50 },
    width: 100,
    height: 100,
    mass: 10,
    color: '#6B7280',
    elasticity: 0.8,
    velocity: { x: 0, y: 0 },
    isFixed: true,
    hardness: 8,
    thickness: 5,
    perforated: false,
  });
  const [isRunning, setIsRunning] = useState(false);
  const [timeScale, setTimeScale] = useState(options.timeScale);
  const [wallElasticity, setWallElasticity] = useState(options.wallElasticity);
  const [collisionData, setCollisionData] = useState<{
    hasCollided: boolean;
    impulse: number;
    collisionCount: number;
  }>({
    hasCollided: false,
    impulse: 0,
    collisionCount: 0,
  });

  const animationFrameRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);
  const canvasWidthRef = useRef<number>(options.width);
  const canvasHeightRef = useRef<number>(options.height);

  useEffect(() => {
    canvasWidthRef.current = options.width;
    canvasHeightRef.current = options.height;

    setTargetBox((prev) => ({
      ...prev,
      position: {
        x: options.width / 2 - prev.width / 2,
        y: options.height / 2 - prev.height / 2,
      },
    }));
  }, [options.width, options.height]);

  const addProjectile = useCallback((projectile: Omit<Projectile, 'id'>) => {
    setProjectiles((prev) => [...prev, { ...projectile, id: Date.now() }]);
  }, []);

  const removeProjectile = useCallback((id: number) => {
    setProjectiles((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const clearProjectiles = useCallback(() => {
    setProjectiles([]);
    setCollisionData({
      hasCollided: false,
      impulse: 0,
      collisionCount: 0,
    });
    setTargetBox((prev) => ({
      ...prev,
      perforated: false,
    }));
  }, []);

  const updateProjectile = useCallback(
    (id: number, updates: Partial<Projectile>) => {
      setProjectiles((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
      );
    },
    []
  );

  const updateTargetBox = useCallback((updates: Partial<TargetBox>) => {
    setTargetBox((prev) => ({ ...prev, ...updates }));
  }, []);

  const startSimulation = useCallback(() => {
    if (projectiles.length === 0) {
      if (Platform.OS === 'web') {
        console.log('Önce en az bir mermi ekleyin!');
      }
      return;
    }
    setIsRunning(true);
    lastUpdateTimeRef.current = Date.now();
    setCollisionData({
      hasCollided: false,
      impulse: 0,
      collisionCount: 0,
    });
  }, [projectiles.length]);

  const pauseSimulation = useCallback(() => {
    setIsRunning(false);
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const resetSimulation = useCallback(() => {
    setIsRunning(false);
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setProjectiles((prev) =>
      prev.map((p) => ({
        ...p,
        position: { ...p.position },
        velocity: { x: 0, y: 0 },
        acceleration: { x: 0, y: 0 },
        penetration: undefined,
        entryPoint: undefined,
        entryVelocity: undefined,
        stuckInside: undefined,
      }))
    );
    setCollisionData({
      hasCollided: false,
      impulse: 0,
      collisionCount: 0,
    });
    setTargetBox((prev) => ({
      ...prev,
      perforated: false,
    }));
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    let lastFrameTime = performance.now();
    const targetFrameTime = 1000 / 60; // Hedef 60 FPS

    const updateSimulation = (timestamp: number) => {
      const currentTime = performance.now();
      const deltaTime = (currentTime - lastFrameTime) / 1000;

      // FPS kontrolü - eğer çok hızlı çalışıyorsa bekle
      if (deltaTime < targetFrameTime / 1000) {
        animationFrameRef.current = requestAnimationFrame(updateSimulation);
        return;
      }

      lastFrameTime = currentTime;

      if (deltaTime > 0.1) {
        animationFrameRef.current = requestAnimationFrame(updateSimulation);
        return;
      }

      const scaledDelta = deltaTime * timeScale;

      setProjectiles((prevProjectiles) => {
        const updatedProjectiles = [...prevProjectiles];
        let hasChanges = false;

        // Toplu güncelleme için tüm hesaplamaları yap
        for (let i = 0; i < updatedProjectiles.length; i++) {
          const p = updatedProjectiles[i];
          if (
            p.stuckInside ||
            (p.penetration !== undefined &&
              p.penetration <= 0 &&
              !targetBox.perforated)
          ) {
            continue;
          }

          p.position = addVectors(
            p.position,
            multiplyVector(p.velocity, scaledDelta)
          );
          handleWallCollisions(p);
          hasChanges = true;
        }

        // Eğer değişiklik yoksa aynı array'i döndür
        return hasChanges ? updatedProjectiles : prevProjectiles;
      });

      // Çarpışma kontrollerini ve diğer işlemleri yap
      let collisionOccurred = false;
      let maxImpulse = 0;
      let boxPerforated = targetBox.perforated;

      setProjectiles((prevProjectiles) => {
        const updatedProjectiles = [...prevProjectiles];
        let hasCollisionChanges = false;

        for (let i = 0; i < updatedProjectiles.length; i++) {
          const projectile = updatedProjectiles[i];
          if (
            projectile.stuckInside ||
            (projectile.penetration !== undefined &&
              projectile.penetration <= 0 &&
              !boxPerforated)
          ) {
            continue;
          }

          const collision = detectProjectileBoxCollision(projectile, targetBox);

          if (collision.hasCollided) {
            hasCollisionChanges = true;
            if (collision.newVelocity1) {
              projectile.velocity = collision.newVelocity1;
            }

            if (collision.penetration !== undefined) {
              projectile.penetration = collision.penetration;
            }

            if (collision.boxPerforated) {
              boxPerforated = true;
              setTargetBox((prev) => ({
                ...prev,
                perforated: true,
              }));
            }

            if (!targetBox.isFixed && collision.newVelocity2) {
              setTargetBox((prev) => ({
                ...prev,
                velocity: collision.newVelocity2!,
              }));
            }

            collisionOccurred = true;
            if (
              collision.impulse &&
              Math.abs(collision.impulse) > Math.abs(maxImpulse)
            ) {
              maxImpulse = collision.impulse;
            }
          }
        }

        return hasCollisionChanges ? updatedProjectiles : prevProjectiles;
      });

      if (collisionOccurred) {
        setCollisionData((prev) => ({
          hasCollided: true,
          impulse: Math.abs(maxImpulse),
          collisionCount: prev.collisionCount + 1,
        }));
      }

      animationFrameRef.current = requestAnimationFrame(updateSimulation);
    };

    const handleWallCollisions = (p: Projectile) => {
      if (p.position.x - p.radius < 0) {
        p.position.x = p.radius;
        p.velocity.x = -p.velocity.x * wallElasticity;
      } else if (p.position.x + p.radius > canvasWidthRef.current) {
        p.position.x = canvasWidthRef.current - p.radius;
        p.velocity.x = -p.velocity.x * wallElasticity;
      }

      if (p.position.y - p.radius < 0) {
        p.position.y = p.radius;
        p.velocity.y = -p.velocity.y * wallElasticity;
      } else if (p.position.y + p.radius > canvasHeightRef.current) {
        p.position.y = canvasHeightRef.current - p.radius;
        p.velocity.y = -p.velocity.y * wallElasticity;
      }
    };

    animationFrameRef.current = requestAnimationFrame(updateSimulation);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning, timeScale, wallElasticity, targetBox]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    projectiles,
    targetBox,
    isRunning,
    timeScale,
    wallElasticity,
    collisionData,
    setTimeScale,
    setWallElasticity,
    addProjectile,
    removeProjectile,
    updateProjectile,
    updateTargetBox,
    clearProjectiles,
    startSimulation,
    pauseSimulation,
    resetSimulation,
  };
}
