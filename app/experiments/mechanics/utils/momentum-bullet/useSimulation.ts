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

    if (Platform.OS === 'web') {
      // Web için alert
      alert('Mermi eklendi!');
    } else {
      // React Native için Alert
      Alert.alert('Bilgi', 'Mermi eklendi!');
    }
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
    // Reset the perforated state when clearing projectiles
    setTargetBox((prev) => ({
      ...prev,
      perforated: false,
    }));

    if (Platform.OS === 'web') {
      alert('Tüm mermiler temizlendi');
    } else {
      Alert.alert('Bilgi', 'Tüm mermiler temizlendi');
    }
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
        alert('Önce en az bir mermi ekleyin!');
      } else {
        Alert.alert('Uyarı', 'Önce en az bir mermi ekleyin!');
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

    if (Platform.OS === 'web') {
      alert('Simülasyon başlatıldı');
    } else {
      Alert.alert('Bilgi', 'Simülasyon başlatıldı');
    }
  }, [projectiles.length]);

  const pauseSimulation = useCallback(() => {
    setIsRunning(false);
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (Platform.OS === 'web') {
      alert('Simülasyon duraklatıldı');
    } else {
      Alert.alert('Bilgi', 'Simülasyon duraklatıldı');
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
    // Reset the perforated state when resetting simulation
    setTargetBox((prev) => ({
      ...prev,
      perforated: false,
    }));

    if (Platform.OS === 'web') {
      alert('Simülasyon sıfırlandı');
    } else {
      Alert.alert('Bilgi', 'Simülasyon sıfırlandı');
    }
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    const updateSimulation = (timestamp: number) => {
      const deltaTime = (timestamp - lastUpdateTimeRef.current) / 1000;
      lastUpdateTimeRef.current = timestamp;

      if (deltaTime > 0.1) {
        animationFrameRef.current = requestAnimationFrame(updateSimulation);
        return;
      }

      const scaledDelta = deltaTime * timeScale;

      setProjectiles((prevProjectiles) => {
        const updatedProjectiles = [...prevProjectiles];

        for (let i = 0; i < updatedProjectiles.length; i++) {
          const p = updatedProjectiles[i];

          // Skip stuck projectiles
          if (p.stuckInside) {
            continue;
          }

          // Skip projectiles that have stopped due to penetration
          if (
            p.penetration !== undefined &&
            p.penetration <= 0 &&
            !targetBox.perforated
          ) {
            continue;
          }

          p.position = addVectors(
            p.position,
            multiplyVector(p.velocity, scaledDelta)
          );

          handleWallCollisions(p);
        }

        for (let i = 0; i < updatedProjectiles.length; i++) {
          for (let j = i + 1; j < updatedProjectiles.length; j++) {
            const p1 = updatedProjectiles[i];
            const p2 = updatedProjectiles[j];

            // Skip stuck projectiles
            if (p1.stuckInside || p2.stuckInside) {
              continue;
            }

            // Skip projectiles with zero penetration
            if (
              (p1.penetration !== undefined &&
                p1.penetration <= 0 &&
                !targetBox.perforated) ||
              (p2.penetration !== undefined &&
                p2.penetration <= 0 &&
                !targetBox.perforated)
            ) {
              continue;
            }

            const collision = resolveCollision(p1, p2);

            if (
              collision.hasCollided &&
              collision.newVelocity1 &&
              collision.newVelocity2
            ) {
              p1.velocity = collision.newVelocity1;
              p2.velocity = collision.newVelocity2;

              const distance = Math.sqrt(
                Math.pow(p2.position.x - p1.position.x, 2) +
                  Math.pow(p2.position.y - p1.position.y, 2)
              );

              if (distance < p1.radius + p2.radius) {
                const overlap = (p1.radius + p2.radius - distance) / 2;
                const direction = {
                  x: (p2.position.x - p1.position.x) / distance,
                  y: (p2.position.y - p1.position.y) / distance,
                };

                p1.position = {
                  x: p1.position.x - direction.x * overlap,
                  y: p1.position.y - direction.y * overlap,
                };

                p2.position = {
                  x: p2.position.x + direction.x * overlap,
                  y: p2.position.y + direction.y * overlap,
                };
              }
            }
          }
        }

        return updatedProjectiles;
      });

      setTargetBox((prevTargetBox) => {
        if (!prevTargetBox) return prevTargetBox;

        const updatedBox = { ...prevTargetBox };

        if (!updatedBox.isFixed) {
          updatedBox.position = addVectors(
            updatedBox.position,
            multiplyVector(updatedBox.velocity, scaledDelta)
          );

          handleBoxWallCollisions(updatedBox);
        }

        return updatedBox;
      });

      let collisionOccurred = false;
      let maxImpulse = 0;
      let boxPerforated = targetBox.perforated;

      setProjectiles((prevProjectiles) => {
        const updatedProjectiles = [...prevProjectiles];

        for (let i = 0; i < updatedProjectiles.length; i++) {
          const projectile = updatedProjectiles[i];

          // Skip stuck projectiles
          if (projectile.stuckInside) {
            continue;
          }

          // Skip projectiles with zero penetration unless box is perforated
          if (
            projectile.penetration !== undefined &&
            projectile.penetration <= 0 &&
            !boxPerforated
          ) {
            continue;
          }

          const collision = detectProjectileBoxCollision(projectile, targetBox);

          if (collision.hasCollided) {
            if (collision.newVelocity1) {
              projectile.velocity = collision.newVelocity1;
            }

            if (collision.penetration !== undefined) {
              projectile.penetration = collision.penetration;
            }

            if (collision.boxPerforated) {
              boxPerforated = true;

              // Update the target box's perforated state
              setTargetBox((prev) => ({
                ...prev,
                perforated: true,
              }));

              if (Platform.OS === 'web') {
                alert('Hedef delindi! Mermi kutunun içinden geçti.');
              } else {
                Alert.alert(
                  'Başarı',
                  'Hedef delindi! Mermi kutunun içinden geçti.'
                );
              }
            } else if (
              collision.hasCollided &&
              !collision.boxPerforated &&
              collision.impulse &&
              collision.impulse > 0
            ) {
              // Mermi kutuyu delemedi ancak çarptı
              if (Platform.OS === 'web') {
                console.log(
                  'Mermi hedef kutuya çarptı ancak delemedi. Hız veya kütleyi artırmayı deneyin.'
                );
              }
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

        return updatedProjectiles;
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

    const handleBoxWallCollisions = (box: TargetBox) => {
      if (box.position.x < 0) {
        box.position.x = 0;
        box.velocity.x = -box.velocity.x * wallElasticity;
      } else if (box.position.x + box.width > canvasWidthRef.current) {
        box.position.x = canvasWidthRef.current - box.width;
        box.velocity.x = -box.velocity.x * wallElasticity;
      }

      if (box.position.y < 0) {
        box.position.y = 0;
        box.velocity.y = -box.velocity.y * wallElasticity;
      } else if (box.position.y + box.height > canvasHeightRef.current) {
        box.position.y = canvasHeightRef.current - box.height;
        box.velocity.y = -box.velocity.y * wallElasticity;
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
