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
  CollisionMode,
} from './physics';

interface SimulationOptions {
  width: number;
  height: number;
  timeScale: number;
  wallElasticity: number;
}

// Optimizasyon için performans ayarları
const PERFORMANCE_CONFIG = {
  // Mobil cihazlar için daha düşük FPS hedefi
  targetFPS: Platform.OS === 'web' ? 60 : 30,
  // State güncellemelerini gruplandırmak için gecikme eşiği (ms)
  updateThreshold: 16, // yaklaşık 60fps için bir frame süresi
  // Mobil cihazlar için pozisyon güncellemelerini yumuşatma faktörü
  smoothingFactor: Platform.OS === 'web' ? 1.0 : 0.8,
};

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
    isFixed: false,
    hardness: 8,
    thickness: 5,
    perforated: false,
    mode: CollisionMode.BULLET,
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

  // Referans değerleri - daha az re-render için
  const animationFrameRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);
  const stateUpdateTimeRef = useRef<number>(0);
  const canvasWidthRef = useRef<number>(options.width);
  const canvasHeightRef = useRef<number>(options.height);
  const projectilesRef = useRef<Projectile[]>(projectiles);
  const targetBoxRef = useRef<TargetBox>(targetBox);
  const velocityAccumulatorRef = useRef({ x: 0, y: 0 });
  const needsRenderUpdateRef = useRef(false);

  // Ref değerlerini state ile senkronize et
  useEffect(() => {
    projectilesRef.current = projectiles;
  }, [projectiles]);

  useEffect(() => {
    targetBoxRef.current = targetBox;
  }, [targetBox]);

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
    if (projectilesRef.current.length === 0) {
      if (Platform.OS === 'web') {
        console.log('Önce en az bir mermi ekleyin!');
      }
      return;
    }
    setIsRunning(true);
    lastUpdateTimeRef.current = performance.now();
    stateUpdateTimeRef.current = performance.now();
    velocityAccumulatorRef.current = { x: 0, y: 0 };
    setCollisionData({
      hasCollided: false,
      impulse: 0,
      collisionCount: 0,
    });
  }, []);

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

  const setCollisionMode = useCallback((mode: CollisionMode) => {
    setTargetBox((prev) => ({ ...prev, mode }));
  }, []);

  // Hareket ve çarpışma mantığını içeren ana fonksiyon
  // Performans optimizasyonları burada yapılacak
  useEffect(() => {
    if (!isRunning) return;

    let lastFrameTime = performance.now();
    // Hedef frame süresi (örn: 60 FPS için 16.66ms)
    const targetFrameTime = 1000 / PERFORMANCE_CONFIG.targetFPS;

    // Hafif titremeleri engellemek için değer yuvarlamak için fonksiyon
    const roundPosition = (value: number) => {
      // Mobil cihazlarda daha fazla yuvarla (performans için)
      return Platform.OS === 'web'
        ? Math.round(value * 100) / 100
        : Math.round(value * 10) / 10;
    };

    const updateSimulation = (timestamp: number) => {
      const currentTime = performance.now();
      const deltaTime = (currentTime - lastFrameTime) / 1000;

      // FPS kontrolü - eğer çok hızlı çalışıyorsa bekle
      if (deltaTime < targetFrameTime / 1000) {
        animationFrameRef.current = requestAnimationFrame(updateSimulation);
        return;
      }

      lastFrameTime = currentTime;

      // Çok büyük zaman farkları oluşmasını engelle (tarayıcı sekme değişimi vb.)
      if (deltaTime > 0.1) {
        animationFrameRef.current = requestAnimationFrame(updateSimulation);
        return;
      }

      const scaledDelta = deltaTime * timeScale;

      // Yerel değişkenlerde hesaplama yaparak state güncellemelerini azalt
      const currentTargetBox = { ...targetBoxRef.current };
      let boxPositionUpdated = false;
      let newBoxPosition = { ...currentTargetBox.position };
      let hasCollision = false;
      let maxImpulse = 0;

      // Kutu hareketi - sabit değilse konumunu güncelle
      if (!currentTargetBox.isFixed) {
        if (
          currentTargetBox.velocity.x !== 0 ||
          currentTargetBox.velocity.y !== 0
        ) {
          // Yumuşatma faktörü uygula
          const smoothedVelocity = {
            x: currentTargetBox.velocity.x * PERFORMANCE_CONFIG.smoothingFactor,
            y: currentTargetBox.velocity.y * PERFORMANCE_CONFIG.smoothingFactor,
          };

          newBoxPosition = addVectors(
            currentTargetBox.position,
            multiplyVector(smoothedVelocity, scaledDelta)
          );

          // Duvar çarpışma kontrolü
          if (newBoxPosition.x < 0) {
            newBoxPosition.x = 0;
            currentTargetBox.velocity.x =
              -currentTargetBox.velocity.x * wallElasticity;
          } else if (
            newBoxPosition.x + currentTargetBox.width >
            canvasWidthRef.current
          ) {
            newBoxPosition.x = canvasWidthRef.current - currentTargetBox.width;
            currentTargetBox.velocity.x =
              -currentTargetBox.velocity.x * wallElasticity;
          }

          if (newBoxPosition.y < 0) {
            newBoxPosition.y = 0;
            currentTargetBox.velocity.y =
              -currentTargetBox.velocity.y * wallElasticity;
          } else if (
            newBoxPosition.y + currentTargetBox.height >
            canvasHeightRef.current
          ) {
            newBoxPosition.y =
              canvasHeightRef.current - currentTargetBox.height;
            currentTargetBox.velocity.y =
              -currentTargetBox.velocity.y * wallElasticity;
          }

          // Pozisyonları yuvarla (mobil performansı için)
          newBoxPosition.x = roundPosition(newBoxPosition.x);
          newBoxPosition.y = roundPosition(newBoxPosition.y);

          // Değişiklik olmuşsa güncelle
          if (
            newBoxPosition.x !== currentTargetBox.position.x ||
            newBoxPosition.y !== currentTargetBox.position.y
          ) {
            currentTargetBox.position = newBoxPosition;
            boxPositionUpdated = true;
            needsRenderUpdateRef.current = true;
          }
        }
      }

      // Mermilerin pozisyonlarını güncelle
      const updatedProjectiles = [...projectilesRef.current];
      let projectilesChanged = false;

      for (let i = 0; i < updatedProjectiles.length; i++) {
        const p = updatedProjectiles[i];

        // Eğer mermi kutuya saplanmışsa, kutunun hareketiyle birlikte güncelle
        if (p.stuckInside && currentTargetBox.mode === CollisionMode.BULLET) {
          if (boxPositionUpdated) {
            // Merminin kutuya göre göreceli pozisyonunu hesapla
            const offsetX = p.position.x - targetBoxRef.current.position.x;
            const offsetY = p.position.y - targetBoxRef.current.position.y;

            // Bağıl pozisyonu koruyarak yeni konumu belirle ve yuvarla
            p.position = {
              x: roundPosition(newBoxPosition.x + offsetX),
              y: roundPosition(newBoxPosition.y + offsetY),
            };

            // Merminin hızını kutunun hızına eşitle
            p.velocity = { ...currentTargetBox.velocity };
            projectilesChanged = true;
          }
          continue; // Saplanmış mermilerin fizik hesaplaması yapmıyoruz
        }

        if (
          p.penetration !== undefined &&
          p.penetration <= 0 &&
          !currentTargetBox.perforated
        ) {
          continue;
        }

        // Merminin pozisyonunu güncelle ve yuvarla
        p.position = {
          x: roundPosition(p.position.x + p.velocity.x * scaledDelta),
          y: roundPosition(p.position.y + p.velocity.y * scaledDelta),
        };

        // Duvar çarpışmaları
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

        projectilesChanged = true;
      }

      // Çarpışma kontrolü
      for (let i = 0; i < updatedProjectiles.length; i++) {
        const projectile = updatedProjectiles[i];
        if (
          projectile.stuckInside ||
          (projectile.penetration !== undefined &&
            projectile.penetration <= 0 &&
            !currentTargetBox.perforated)
        ) {
          continue;
        }

        // Çarpışma tespit et
        const collision = detectProjectileBoxCollision(
          projectile,
          currentTargetBox
        );

        if (collision.hasCollided) {
          projectilesChanged = true;
          hasCollision = true;

          if (collision.newVelocity1) {
            projectile.velocity = collision.newVelocity1;
          }

          // Mermi modunda saplanma
          if (currentTargetBox.mode === CollisionMode.BULLET) {
            projectile.stuckInside = true;
          }

          if (collision.penetration !== undefined) {
            projectile.penetration = collision.penetration;
          }

          if (collision.boxPerforated) {
            currentTargetBox.perforated = true;
            currentTargetBox.isFixed = false;
            needsRenderUpdateRef.current = true;
          }

          if (!currentTargetBox.isFixed && collision.newVelocity2) {
            currentTargetBox.velocity = collision.newVelocity2;
            needsRenderUpdateRef.current = true;
          }

          if (
            collision.impulse &&
            Math.abs(collision.impulse) > Math.abs(maxImpulse)
          ) {
            maxImpulse = collision.impulse;
          }
        }
      }

      // Toplu state güncellemeleri - optimize edilmiş render için
      const timeNow = performance.now();
      const timeSinceLastUpdate = timeNow - stateUpdateTimeRef.current;

      // Yalnızca belirli aralıklarla veya önemli değişiklikler olduğunda state'i güncelle
      if (
        timeSinceLastUpdate > PERFORMANCE_CONFIG.updateThreshold ||
        needsRenderUpdateRef.current
      ) {
        // Kutunun konumu değiştiyse state'i güncelle
        if (boxPositionUpdated || needsRenderUpdateRef.current) {
          setTargetBox(currentTargetBox);
        }

        // Mermilerin konumu değiştiyse state'i güncelle
        if (projectilesChanged) {
          setProjectiles(updatedProjectiles);
        }

        // Çarpışma verileri güncelle
        if (hasCollision) {
          setCollisionData((prev) => ({
            hasCollided: true,
            impulse: Math.abs(maxImpulse),
            collisionCount: prev.collisionCount + 1,
          }));
        }

        // Zamanı ve bayrağı sıfırla
        stateUpdateTimeRef.current = timeNow;
        needsRenderUpdateRef.current = false;
      }

      // Animasyon döngüsünü devam ettir
      animationFrameRef.current = requestAnimationFrame(updateSimulation);
    };

    // Animasyon döngüsünü başlat
    animationFrameRef.current = requestAnimationFrame(updateSimulation);

    // Cleanup fonksiyonu
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning, timeScale, wallElasticity]);

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
    setCollisionMode,
  };
}
