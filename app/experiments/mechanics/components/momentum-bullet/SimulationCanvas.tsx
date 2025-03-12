import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, Dimensions } from 'react-native';
import Svg, {
  Rect,
  Circle,
  Line,
  Path,
  Text as SvgText,
  G,
} from 'react-native-svg';
import {
  type Projectile,
  type TargetBox,
} from '../../utils/momentum-bullet/physics';
import { useLanguage } from '../../../../../components/LanguageContext';

interface SimulationCanvasProps {
  width: number;
  height: number;
  projectiles: Projectile[];
  targetBox: TargetBox;
  isRunning: boolean;
  collisionData?: {
    hasCollided: boolean;
    impulse: number;
    collisionCount: number;
  };
}

const SimulationCanvas = ({
  width,
  height,
  projectiles,
  targetBox,
  isRunning,
  collisionData,
}: SimulationCanvasProps) => {
  const { t } = useLanguage();
  const [canvasSize, setCanvasSize] = useState({ width, height });

  // Fiziksel değerleri hesaplama
  const calculatePhysicalValues = () => {
    if (!projectiles.length) return null;

    // En son eklenen mermiyi al
    const lastProjectile = projectiles[projectiles.length - 1];

    // Hız büyüklüğü
    const velocity = Math.sqrt(
      lastProjectile.velocity.x ** 2 + lastProjectile.velocity.y ** 2
    );

    // Kütle
    const mass = lastProjectile.mass;

    // Momentum (p = mv)
    const momentum = mass * velocity;

    // Kinetik enerji (KE = 1/2 * m * v^2)
    const kineticEnergy = 0.5 * mass * velocity ** 2;

    // Etki eden kuvvet (F = ma veya F = Δp/Δt)
    // Çarpışma durumunda impuls değerini kullan
    const force = collisionData?.hasCollided
      ? collisionData.impulse * 100 // impuls değerini kuvvete çevir
      : mass * velocity * 10; // Yaklaşık bir değer

    return {
      velocity: velocity.toFixed(2),
      momentum: momentum.toFixed(2),
      kineticEnergy: kineticEnergy.toFixed(2),
      force: force.toFixed(2),
    };
  };

  // Fiziksel değerleri gösteren panel
  const renderPhysicsPanel = () => {
    const values = calculatePhysicalValues();
    if (!values) return null;

    return (
      <G x="20" y="20">
        <Rect
          x="0"
          y="0"
          width="200"
          height="120"
          fill="rgba(255, 255, 255, 0.9)"
          stroke="#3b82f6"
          strokeWidth="1"
          rx="5"
          ry="5"
        />
        <SvgText x="10" y="25" fill="#1e40af" fontSize="12" fontWeight="bold">
          {t('Fiziksel Değerler:', 'Physical Values:')}
        </SvgText>
        <SvgText x="10" y="45" fill="#374151" fontSize="11">
          {t('Etki Eden Kuvvet:', 'Applied Force:')} {values.force} N
        </SvgText>
        <SvgText x="10" y="65" fill="#374151" fontSize="11">
          {t('Momentum:', 'Momentum:')} {values.momentum} kg⋅m/s
        </SvgText>
        <SvgText x="10" y="85" fill="#374151" fontSize="11">
          {t('Kinetik Enerji:', 'Kinetic Energy:')} {values.kineticEnergy} J
        </SvgText>
        <SvgText x="10" y="105" fill="#374151" fontSize="11">
          {t('Hız:', 'Velocity:')} {values.velocity} m/s
        </SvgText>
      </G>
    );
  };

  // Yeniden boyutlandırma işlemi için
  useEffect(() => {
    setCanvasSize({ width, height });
  }, [width, height]);

  // Koordinat eksenleri ve ızgara çizimini yapma
  const renderGrid = () => {
    const gridSize = 40;
    const gridLines = [];

    // Dikey çizgiler
    for (let x = 0; x <= canvasSize.width; x += gridSize) {
      gridLines.push(
        <Line
          key={`v-${x}`}
          x1={x}
          y1={0}
          x2={x}
          y2={canvasSize.height}
          stroke="rgba(0, 0, 0, 0.05)"
          strokeWidth={1}
        />
      );
    }

    // Yatay çizgiler
    for (let y = 0; y <= canvasSize.height; y += gridSize) {
      gridLines.push(
        <Line
          key={`h-${y}`}
          x1={0}
          y1={y}
          x2={canvasSize.width}
          y2={y}
          stroke="rgba(0, 0, 0, 0.05)"
          strokeWidth={1}
        />
      );
    }

    return gridLines;
  };

  // Koordinat sistemi
  const renderCoordinates = () => {
    const elements = [];
    const centerX = canvasSize.width / 2;
    const centerY = canvasSize.height / 2;

    // X ekseni
    elements.push(
      <Line
        key="x-axis"
        x1={0}
        y1={centerY}
        x2={canvasSize.width}
        y2={centerY}
        stroke="rgba(0, 0, 0, 0.3)"
        strokeWidth={1}
      />
    );

    // Y ekseni
    elements.push(
      <Line
        key="y-axis"
        x1={centerX}
        y1={0}
        x2={centerX}
        y2={canvasSize.height}
        stroke="rgba(0, 0, 0, 0.3)"
        strokeWidth={1}
      />
    );

    // X ekseni etiketleri
    const xStep = 50;
    for (let x = 0; x <= canvasSize.width; x += xStep) {
      const label = Math.round(x - canvasSize.width / 2);
      elements.push(
        <SvgText
          key={`x-label-${x}`}
          x={x}
          y={centerY + 15}
          fill="rgba(0, 0, 0, 0.5)"
          fontSize={10}
          textAnchor="middle"
        >
          {label}
        </SvgText>
      );

      // İşaret çizgileri
      elements.push(
        <Line
          key={`x-tick-${x}`}
          x1={x}
          y1={centerY - 3}
          x2={x}
          y2={centerY + 3}
          stroke="rgba(0, 0, 0, 0.3)"
          strokeWidth={1}
        />
      );
    }

    // Y ekseni etiketleri
    const yStep = 50;
    for (let y = 0; y <= canvasSize.height; y += yStep) {
      const label = Math.round(canvasSize.height / 2 - y);
      elements.push(
        <SvgText
          key={`y-label-${y}`}
          x={centerX - 10}
          y={y + 4}
          fill="rgba(0, 0, 0, 0.5)"
          fontSize={10}
          textAnchor="end"
        >
          {label}
        </SvgText>
      );

      // İşaret çizgileri
      elements.push(
        <Line
          key={`y-tick-${y}`}
          x1={centerX - 3}
          y1={y}
          x2={centerX + 3}
          y2={y}
          stroke="rgba(0, 0, 0, 0.3)"
          strokeWidth={1}
        />
      );
    }

    // Orijin etiketi
    elements.push(
      <SvgText
        key="origin-label"
        x={centerX - 10}
        y={centerY + 15}
        fill="rgba(0, 0, 0, 0.5)"
        fontSize={10}
        textAnchor="end"
      >
        0
      </SvgText>
    );

    return elements;
  };

  // Hedef kutuyu çizme
  const renderTargetBox = () => {
    if (!targetBox || !targetBox.position) return null;

    const {
      position,
      width: boxWidth,
      height: boxHeight,
      color,
      mass,
    } = targetBox;
    const elements = [];

    // Gölge
    elements.push(
      <Rect
        key="box-shadow"
        x={position.x + 3}
        y={position.y + 3}
        width={boxWidth}
        height={boxHeight}
        fill="rgba(0, 0, 0, 0.1)"
      />
    );

    // Kutu (arka plan dolgusu)
    elements.push(
      <Rect
        key="box-bg"
        x={position.x}
        y={position.y}
        width={boxWidth}
        height={boxHeight}
        fill={color}
      />
    );

    // Kutu kenarları
    elements.push(
      <Rect
        key="box-border"
        x={position.x}
        y={position.y}
        width={boxWidth}
        height={boxHeight}
        stroke="rgba(0, 0, 0, 0.3)"
        strokeWidth={1}
        fill="none"
      />
    );

    // Delinmiş kutu gösterimi
    if (targetBox.perforated) {
      elements.push(
        <Rect
          key="box-perforated"
          x={position.x}
          y={position.y}
          width={boxWidth}
          height={boxHeight}
          stroke="rgba(255, 0, 0, 0.6)"
          strokeWidth={1}
          strokeDasharray="5,3"
          fill="none"
        />
      );
    }

    // Merkezdeki artı işareti
    const centerX = position.x + boxWidth / 2;
    const centerY = position.y + boxHeight / 2;

    elements.push(
      <Line
        key="center-h"
        x1={centerX - 10}
        y1={centerY}
        x2={centerX + 10}
        y2={centerY}
        stroke="rgba(255, 255, 255, 0.5)"
        strokeWidth={1}
      />
    );

    elements.push(
      <Line
        key="center-v"
        x1={centerX}
        y1={centerY - 10}
        x2={centerX}
        y2={centerY + 10}
        stroke="rgba(255, 255, 255, 0.5)"
        strokeWidth={1}
      />
    );

    // Kütle etiketi
    elements.push(
      <SvgText
        key="mass-label"
        x={centerX}
        y={centerY + 5}
        fill="rgba(255, 255, 255, 0.9)"
        fontSize={12}
        textAnchor="middle"
      >
        {`M=${mass.toFixed(1)} kg`}
      </SvgText>
    );

    // Malzeme sertliği (varsa)
    if (targetBox.hardness !== undefined) {
      elements.push(
        <SvgText
          key="hardness-label"
          x={centerX}
          y={centerY + 20}
          fill="rgba(255, 255, 255, 0.7)"
          fontSize={10}
          textAnchor="middle"
        >
          {`${t('Sertlik', 'Hardness')}: ${targetBox.hardness.toFixed(1)}`}
        </SvgText>
      );
    }

    // Sabit/hareketli durumu
    elements.push(
      <SvgText
        key="fixed-label"
        x={centerX}
        y={centerY - 10}
        fill="rgba(255, 255, 255, 0.7)"
        fontSize={10}
        textAnchor="middle"
      >
        {targetBox.isFixed ? t('Sabit', 'Fixed') : t('Hareketli', 'Mobile')}
      </SvgText>
    );

    return elements;
  };

  // Mermileri çizme
  const renderProjectiles = () => {
    return projectiles.map((projectile, index) => {
      // Saplandığı için görünmeyen mermi
      if (projectile.stuckInside) return null;

      // Normal mermi çizimi
      const { position, radius, color, mass } = projectile;

      return (
        <G key={`projectile-${index}`}>
          {/* Gölge */}
          <Circle
            cx={position.x}
            cy={position.y + 2}
            r={radius}
            fill="rgba(0, 0, 0, 0.1)"
          />

          {/* Mermi */}
          <Circle cx={position.x} cy={position.y} r={radius} fill={color} />

          {/* Parlak nokta (highlight) */}
          <Circle
            cx={position.x - radius * 0.3}
            cy={position.y - radius * 0.3}
            r={radius * 0.2}
            fill="rgba(255, 255, 255, 0.4)"
          />

          {/* Merkezde artı işareti */}
          <Line
            x1={position.x - radius * 0.5}
            y1={position.y}
            x2={position.x + radius * 0.5}
            y2={position.y}
            stroke="rgba(0, 0, 0, 0.3)"
            strokeWidth={1}
          />
          <Line
            x1={position.x}
            y1={position.y - radius * 0.5}
            x2={position.x}
            y2={position.y + radius * 0.5}
            stroke="rgba(0, 0, 0, 0.3)"
            strokeWidth={1}
          />

          {/* Kütle etiketi */}
          <SvgText
            x={position.x}
            y={position.y - radius - 5}
            fill="rgba(0, 0, 0, 0.7)"
            fontSize={10}
            textAnchor="middle"
          >
            {`m=${mass.toFixed(1)} kg`}
          </SvgText>
        </G>
      );
    });
  };

  // Saplanmış mermileri çizme
  const renderStuckProjectiles = () => {
    return projectiles.map((projectile, index) => {
      if (!projectile.stuckInside || !projectile.entryPoint) return null;

      const { radius, color, entryPoint } = projectile;

      return (
        <G key={`stuck-projectile-${index}`}>
          {/* Gömülü mermi çizimi */}
          <Circle
            cx={entryPoint.x}
            cy={entryPoint.y}
            r={radius * 0.8}
            fill={color}
          />

          {/* Çatlak efekti */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (Math.PI * 2 * i) / 8;
            const length = radius * 0.8 + Math.random() * radius * 1.5;

            return (
              <Line
                key={`crack-${i}`}
                x1={entryPoint.x}
                y1={entryPoint.y}
                x2={entryPoint.x + Math.cos(angle) * length}
                y2={entryPoint.y + Math.sin(angle) * length}
                stroke="rgba(0, 0, 0, 0.7)"
                strokeWidth={1}
              />
            );
          })}

          {/* "Saplandı" yazısı */}
          <SvgText
            x={entryPoint.x}
            y={entryPoint.y - radius - 5}
            fill="rgba(255, 0, 0, 0.9)"
            fontSize={10}
            textAnchor="middle"
          >
            {t('Saplandı', 'Stuck')}
          </SvgText>
        </G>
      );
    });
  };

  // Penetrasyon efektlerini çizme
  const renderPenetrationEffects = () => {
    return projectiles.map((projectile, index) => {
      if (
        !projectile.penetration ||
        projectile.penetration <= 0 ||
        !projectile.entryPoint
      )
        return null;

      // Merminin kutu içinde olup olmadığını kontrol et
      const isInside =
        projectile.position.x >= targetBox.position.x &&
        projectile.position.x <= targetBox.position.x + targetBox.width &&
        projectile.position.y >= targetBox.position.y &&
        projectile.position.y <= targetBox.position.y + targetBox.height;

      if (!isInside) return null;

      const entryPoint = projectile.entryPoint;

      return (
        <G key={`penetration-${index}`}>
          {/* Giriş deliği */}
          <Circle
            cx={entryPoint.x}
            cy={entryPoint.y}
            r={projectile.radius * 0.8}
            fill="rgba(0, 0, 0, 0.7)"
          />

          {/* Kutu tamamen delindiyse çıkış deliği */}
          {targetBox.perforated && (
            <>
              {/* Giriş ve çıkış noktaları arasındaki çizgi */}
              <Line
                x1={entryPoint.x}
                y1={entryPoint.y}
                x2={projectile.position.x}
                y2={projectile.position.y}
                stroke="rgba(255, 0, 0, 0.5)"
                strokeWidth={2}
              />

              {/* "DELİNDİ" yazısı */}
              <SvgText
                x={(entryPoint.x + projectile.position.x) / 2}
                y={(entryPoint.y + projectile.position.y) / 2 - 15}
                fill="rgba(255, 0, 0, 0.9)"
                fontSize={12}
                textAnchor="middle"
              >
                {t('DELİNDİ', 'PERFORATED')}
              </SvgText>
            </>
          )}

          {/* Kutu içindeki yörünge */}
          <Line
            x1={entryPoint.x}
            y1={entryPoint.y}
            x2={projectile.position.x}
            y2={projectile.position.y}
            stroke="rgba(255, 0, 0, 0.4)"
            strokeWidth={2}
          />

          {/* Penetrasyon değeri */}
          {projectile.penetration > 0.1 && (
            <SvgText
              x={projectile.position.x}
              y={projectile.position.y - projectile.radius - 15}
              fill="white"
              fontSize={10}
              textAnchor="middle"
            >
              {`${t('Sapla', 'Pen')}: ${projectile.penetration.toFixed(1)}`}
            </SvgText>
          )}
        </G>
      );
    });
  };

  // Hız vektörlerini çizme
  const renderVelocityVectors = () => {
    if (!isRunning) return null;

    const vectors = projectiles.map((projectile, index) => {
      if (projectile.stuckInside) return null;

      const { position, velocity } = projectile;
      const scale = 0.1; // Hız vektörü ölçeği

      if (Math.abs(velocity.x) < 0.1 && Math.abs(velocity.y) < 0.1) return null;

      // Hızın büyüklüğünü hesapla
      const speed = Math.sqrt(
        velocity.x * velocity.x + velocity.y * velocity.y
      );
      const angle = Math.atan2(velocity.y, velocity.x);
      const arrowLength = 8;

      return (
        <G key={`velocity-${index}`}>
          {/* Ana çizgi */}
          <Line
            x1={position.x}
            y1={position.y}
            x2={position.x + velocity.x * scale}
            y2={position.y + velocity.y * scale}
            stroke="rgba(255, 50, 50, 0.7)"
            strokeWidth={2}
          />

          {/* Ok ucu */}
          <Line
            x1={position.x + velocity.x * scale}
            y1={position.y + velocity.y * scale}
            x2={
              position.x +
              velocity.x * scale -
              arrowLength * Math.cos(angle - Math.PI / 6)
            }
            y2={
              position.y +
              velocity.y * scale -
              arrowLength * Math.sin(angle - Math.PI / 6)
            }
            stroke="rgba(255, 50, 50, 0.7)"
            strokeWidth={2}
          />
          <Line
            x1={position.x + velocity.x * scale}
            y1={position.y + velocity.y * scale}
            x2={
              position.x +
              velocity.x * scale -
              arrowLength * Math.cos(angle + Math.PI / 6)
            }
            y2={
              position.y +
              velocity.y * scale -
              arrowLength * Math.sin(angle + Math.PI / 6)
            }
            stroke="rgba(255, 50, 50, 0.7)"
            strokeWidth={2}
          />

          {/* Hız etiketi */}
          <SvgText
            x={position.x + velocity.x * scale * 0.5}
            y={position.y + velocity.y * scale * 0.5 - 5}
            fill="rgba(255, 50, 50, 0.9)"
            fontSize={10}
            textAnchor="middle"
          >
            {`v=${speed.toFixed(1)} m/s`}
          </SvgText>
        </G>
      );
    });

    // Kutunun hız vektörü
    if (
      targetBox &&
      !targetBox.isFixed &&
      (targetBox.velocity.x !== 0 || targetBox.velocity.y !== 0)
    ) {
      const centerX = targetBox.position.x + targetBox.width / 2;
      const centerY = targetBox.position.y + targetBox.height / 2;
      const { velocity } = targetBox;
      const scale = 0.1;

      if (Math.abs(velocity.x) < 0.1 && Math.abs(velocity.y) < 0.1)
        return vectors;

      const speed = Math.sqrt(
        velocity.x * velocity.x + velocity.y * velocity.y
      );
      const angle = Math.atan2(velocity.y, velocity.x);
      const arrowLength = 8;

      vectors.push(
        <G key="box-velocity">
          {/* Ana çizgi */}
          <Line
            x1={centerX}
            y1={centerY}
            x2={centerX + velocity.x * scale}
            y2={centerY + velocity.y * scale}
            stroke="rgba(50, 50, 255, 0.7)"
            strokeWidth={2}
          />

          {/* Ok ucu */}
          <Line
            x1={centerX + velocity.x * scale}
            y1={centerY + velocity.y * scale}
            x2={
              centerX +
              velocity.x * scale -
              arrowLength * Math.cos(angle - Math.PI / 6)
            }
            y2={
              centerY +
              velocity.y * scale -
              arrowLength * Math.sin(angle - Math.PI / 6)
            }
            stroke="rgba(50, 50, 255, 0.7)"
            strokeWidth={2}
          />
          <Line
            x1={centerX + velocity.x * scale}
            y1={centerY + velocity.y * scale}
            x2={
              centerX +
              velocity.x * scale -
              arrowLength * Math.cos(angle + Math.PI / 6)
            }
            y2={
              centerY +
              velocity.y * scale -
              arrowLength * Math.sin(angle + Math.PI / 6)
            }
            stroke="rgba(50, 50, 255, 0.7)"
            strokeWidth={2}
          />

          {/* Hız etiketi */}
          <SvgText
            x={centerX + velocity.x * scale * 0.5}
            y={centerY + velocity.y * scale * 0.5 - 5}
            fill="rgba(50, 50, 255, 0.9)"
            fontSize={10}
            textAnchor="middle"
          >
            {`v=${speed.toFixed(1)} m/s`}
          </SvgText>
        </G>
      );
    }

    return vectors;
  };

  return (
    <View
      style={[
        styles.container,
        { width: canvasSize.width, height: canvasSize.height },
      ]}
    >
      <Svg width={canvasSize.width} height={canvasSize.height}>
        {/* Izgara ve koordinat sistemi */}
        {renderGrid()}
        {renderCoordinates()}

        {/* Kenar */}
        <Rect
          x={0}
          y={0}
          width={canvasSize.width}
          height={canvasSize.height}
          stroke="rgba(0, 0, 0, 0.1)"
          strokeWidth={1}
          fill="none"
        />

        {/* Hedef kutu */}
        {renderTargetBox()}

        {/* Mermiler */}
        {renderProjectiles()}

        {/* Saplanmış mermiler */}
        {renderStuckProjectiles()}

        {/* Penetrasyon etkileri */}
        {renderPenetrationEffects()}

        {/* Hız vektörleri */}
        {renderVelocityVectors()}

        {/* Fiziksel değerleri gösteren panel */}
        {renderPhysicsPanel()}
      </Svg>

      {/* Boş durum mesajı */}
      {projectiles.length === 0 && (
        <View style={styles.emptyStateOverlay}>
          <Text style={styles.emptyStateText}>
            {t(
              'Simülasyonu başlatmak için mermi ekleyin',
              'Add projectiles to start the simulation'
            )}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 8,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
    }),
  },
  emptyStateOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    backdropFilter: 'blur(4px)',
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default SimulationCanvas;
