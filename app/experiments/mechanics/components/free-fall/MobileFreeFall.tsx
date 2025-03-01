import React, { useCallback, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { FreeFallProps } from './types';
import { useFreeFall } from './useFreeFall';
import { FreeFallControls } from './FreeFallControls';

const CANVAS_PADDING = 20;
const GRAVITY = 9.81;
const MAX_X = 1500;
const MAX_Y = 800;

export const MobileFreeFall = forwardRef<any, FreeFallProps>(({
  width = window.innerWidth,
  height = window.innerHeight,
  onStateChange,
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const timeRef = useRef<number>(0);
  
  const canvasWidth = width * 0.95;
  const canvasHeight = height * 0.4;
  const scaleX = (canvasWidth - 2 * CANVAS_PADDING) / MAX_X;
  const scaleY = (canvasHeight - 2 * CANVAS_PADDING) / MAX_Y;

  const toCanvasX = useCallback((x: number) => x * scaleX + CANVAS_PADDING, [scaleX]);
  const toCanvasY = useCallback((y: number) => canvasHeight - (y * scaleY + CANVAS_PADDING), [canvasHeight, scaleY]);

  const {
    state,
    setVelocity,
    setAngle,
    setFrictionCoef,
    startSimulation,
    stopSimulation,
    resetSimulation,
    updatePosition,
  } = useFreeFall(onStateChange);

  // Ref ile dışarıya metodları açıyoruz
  useImperativeHandle(ref, () => ({
    startSimulation,
    stopSimulation,
    resetSimulation
  }));

  const drawAxis = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#7f8c8d';
    ctx.lineWidth = 1;
    
    // X ekseni
    ctx.beginPath();
    ctx.moveTo(CANVAS_PADDING, canvasHeight - CANVAS_PADDING);
    ctx.lineTo(canvasWidth - CANVAS_PADDING, canvasHeight - CANVAS_PADDING);
    ctx.stroke();

    // Y ekseni
    ctx.beginPath();
    ctx.moveTo(CANVAS_PADDING, CANVAS_PADDING);
    ctx.lineTo(CANVAS_PADDING, canvasHeight - CANVAS_PADDING);
    ctx.stroke();

    // X ekseni işaretleri
    ctx.textAlign = 'center';
    ctx.fillStyle = '#7f8c8d';
    ctx.font = '9px Arial';
    for (let x = 0; x <= MAX_X; x += 300) {
      const canvasX = toCanvasX(x);
      ctx.beginPath();
      ctx.moveTo(canvasX, canvasHeight - CANVAS_PADDING - 5);
      ctx.lineTo(canvasX, canvasHeight - CANVAS_PADDING + 5);
      ctx.stroke();
      ctx.fillText(x.toString() + ' m', canvasX, canvasHeight - CANVAS_PADDING + 15);
    }

    // Y ekseni işaretleri
    ctx.textAlign = 'right';
    for (let y = 0; y <= MAX_Y; y += 200) {
      const canvasY = toCanvasY(y);
      ctx.beginPath();
      ctx.moveTo(CANVAS_PADDING - 5, canvasY);
      ctx.lineTo(CANVAS_PADDING + 5, canvasY);
      ctx.stroke();
      ctx.fillText(y.toString() + ' m', CANVAS_PADDING - 8, canvasY + 4);
    }

    // Eksen etiketleri
    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('x (m)', canvasWidth / 2, canvasHeight - 2);
    
    ctx.save();
    ctx.translate(10, canvasHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('y (m)', 0, 0);
    ctx.restore();
  }, [canvasWidth, canvasHeight, toCanvasX, toCanvasY]);

  const drawTrajectory = useCallback((ctx: CanvasRenderingContext2D) => {
    if (state.trajectory.length < 2) return;

    ctx.beginPath();
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 2;

    state.trajectory.forEach((point, index) => {
      const x = toCanvasX(point.x);
      const y = toCanvasY(point.y);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();
  }, [state.trajectory, toCanvasX, toCanvasY]);

  const drawProjectile = useCallback((ctx: CanvasRenderingContext2D) => {
    const x = toCanvasX(state.position.x);
    const y = toCanvasY(state.position.y);

    // Cisim
    ctx.beginPath();
    ctx.fillStyle = '#2ecc71';
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();

    // Hız vektörü
    const angle = state.angle * Math.PI / 180;
    const vx = state.velocity * Math.cos(angle) * 0.2 * scaleX;
    const vy = state.velocity * Math.sin(angle) * 0.2 * scaleY;
    
    ctx.beginPath();
    ctx.strokeStyle = '#e74c3c';
    ctx.moveTo(x, y);
    ctx.lineTo(x + vx, y - vy);
    ctx.stroke();

    // Ok ucu
    ctx.beginPath();
    ctx.moveTo(x + vx, y - vy);
    ctx.lineTo(x + vx - 8 * Math.cos(angle - Math.PI/6), y - vy + 8 * Math.sin(angle - Math.PI/6));
    ctx.lineTo(x + vx - 8 * Math.cos(angle + Math.PI/6), y - vy + 8 * Math.sin(angle + Math.PI/6));
    ctx.closePath();
    ctx.fill();
  }, [state.position, state.velocity, state.angle, toCanvasX, toCanvasY, scaleX, scaleY]);

  const drawInfo = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.font = 'bold 12px Arial';
    ctx.fillStyle = '#2c3e50';
    ctx.textAlign = 'left';

    const info = [
      `t = ${state.time.toFixed(2)} s`,
      `x = ${state.position.x.toFixed(1)} m`,
      `y = ${state.position.y.toFixed(1)} m`,
      `v = ${state.velocity.toFixed(1)} m/s`,
    ];

    info.forEach((text, index) => {
      ctx.fillText(text, canvasWidth - 120, 20 + index * 15);
    });
  }, [state, canvasWidth]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    // Canvas'ı temizle
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawAxis(ctx);
    drawTrajectory(ctx);
    drawProjectile(ctx);
    drawInfo(ctx);
  }, [drawAxis, drawTrajectory, drawProjectile, drawInfo]);

  const animate = useCallback(() => {
    if (state.isRunning) {
      updatePosition();
      draw();
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [state.isRunning, updatePosition, draw]);

  useEffect(() => {
    if (state.isRunning) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      draw();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [state.isRunning, animate, draw]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.canvasContainer}>
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            style={styles.canvas}
          />
        </View>

        <FreeFallControls
          state={state}
          onStart={state.isRunning ? stopSimulation : startSimulation}
          onReset={resetSimulation}
          onVelocityChange={setVelocity}
          onAngleChange={setAngle}
          onFrictionChange={setFrictionCoef}
        />
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
  content: {
    padding: 10,
  },
  canvasContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  canvas: {
    width: '100%',
    height: '100%',
  },
}); 