import React, { useCallback, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet } from 'react-native';
import { FreeFallProps } from './types';
import { useFreeFall } from './useFreeFall';
import { FreeFallControls } from './FreeFallControls';

const CANVAS_PADDING = 30;
const GRAVITY = 9.81;
const MAX_X = 1500;
const MAX_Y = 800;

export const WebFreeFall = forwardRef<any, FreeFallProps>(({
  width = window.innerWidth,
  height = window.innerHeight,
  onStateChange,
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const timeRef = useRef<number>(0);
  
  const canvasWidth = Math.min(width * 0.95, 800);
  const canvasHeight = Math.min(height * 0.6, 500);
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
    ctx.font = '11px Arial';
    for (let x = 0; x <= MAX_X; x += 250) {
      const canvasX = toCanvasX(x);
      ctx.beginPath();
      ctx.moveTo(canvasX, canvasHeight - CANVAS_PADDING - 5);
      ctx.lineTo(canvasX, canvasHeight - CANVAS_PADDING + 5);
      ctx.stroke();
      ctx.fillText(x.toString() + ' m', canvasX, canvasHeight - CANVAS_PADDING + 18);
    }

    // Y ekseni işaretleri
    ctx.textAlign = 'right';
    for (let y = 0; y <= MAX_Y; y += 100) {
      const canvasY = toCanvasY(y);
      ctx.beginPath();
      ctx.moveTo(CANVAS_PADDING - 5, canvasY);
      ctx.lineTo(CANVAS_PADDING + 5, canvasY);
      ctx.stroke();
      ctx.fillText(y.toString() + ' m', CANVAS_PADDING - 10, canvasY + 4);
    }

    // Eksen etiketleri
    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('x (m)', canvasWidth / 2, canvasHeight - 5);
    
    ctx.save();
    ctx.translate(15, canvasHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('y (m)', 0, 0);
    ctx.restore();
  }, [canvasWidth, canvasHeight, toCanvasX, toCanvasY]);

  const drawTrajectory = useCallback((ctx: CanvasRenderingContext2D) => {
    if (state.trajectory.length <= 1) return;

    ctx.strokeStyle = 'rgba(41, 128, 185, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    const firstPoint = state.trajectory[0];
    ctx.moveTo(toCanvasX(firstPoint.x), toCanvasY(firstPoint.y));
    
    for (let i = 1; i < state.trajectory.length; i++) {
      const point = state.trajectory[i];
      ctx.lineTo(toCanvasX(point.x), toCanvasY(point.y));
    }
    
    ctx.stroke();
  }, [state.trajectory, toCanvasX, toCanvasY]);

  const drawProjectile = useCallback((ctx: CanvasRenderingContext2D) => {
    const { position } = state;
    const { x, y } = position;
    const canvasX = toCanvasX(x);
    const canvasY = toCanvasY(y);
    
    // Gölge
    ctx.beginPath();
    ctx.ellipse(toCanvasX(x), toCanvasY(0), 10, 4, 0, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fill();
    
    // Cisim
    ctx.beginPath();
    ctx.arc(canvasX, canvasY, 10, 0, 2 * Math.PI);
    const gradient = ctx.createRadialGradient(canvasX, canvasY, 0, canvasX, canvasY, 10);
    gradient.addColorStop(0, '#e74c3c');
    gradient.addColorStop(1, '#c0392b');
    ctx.fillStyle = gradient;
    ctx.fill();
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Hız vektörü
    if (state.isRunning) {
      const angle = state.angle * Math.PI / 180;
      const vx = Math.cos(angle);
      const vy = Math.sin(angle);
      const vLength = 30 * (state.velocity / 300); // Hız büyüklüğüne göre ölçeklendirme
      
      ctx.beginPath();
      ctx.moveTo(canvasX, canvasY);
      ctx.lineTo(canvasX + vx * vLength, canvasY - vy * vLength);
      ctx.strokeStyle = '#2ecc71';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Ok ucu
      const arrowSize = 6;
      const arrowAngle = Math.atan2(-vy, vx);
      ctx.beginPath();
      ctx.moveTo(canvasX + vx * vLength, canvasY - vy * vLength);
      ctx.lineTo(
        canvasX + vx * vLength - arrowSize * Math.cos(arrowAngle - Math.PI / 6),
        canvasY - vy * vLength + arrowSize * Math.sin(arrowAngle - Math.PI / 6)
      );
      ctx.lineTo(
        canvasX + vx * vLength - arrowSize * Math.cos(arrowAngle + Math.PI / 6),
        canvasY - vy * vLength + arrowSize * Math.sin(arrowAngle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fillStyle = '#2ecc71';
      ctx.fill();
    }
  }, [state.position, state.isRunning, state.velocity, state.angle, toCanvasX, toCanvasY]);

  const drawInfo = useCallback((ctx: CanvasRenderingContext2D) => {
    const { position, time, velocity } = state;
    const { x, y } = position;
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillRect(canvasWidth - 200, 20, 180, 100);
    ctx.strokeStyle = '#bdc3c7';
    ctx.lineWidth = 1;
    ctx.strokeRect(canvasWidth - 200, 20, 180, 100);
    
    ctx.font = '14px Arial';
    ctx.fillStyle = '#2c3e50';
    ctx.textAlign = 'left';
    
    ctx.fillText(`t = ${time.toFixed(2)} s`, canvasWidth - 190, 45);
    ctx.fillText(`x = ${x.toFixed(1)} m`, canvasWidth - 190, 70);
    ctx.fillText(`y = ${y.toFixed(1)} m`, canvasWidth - 190, 95);
    ctx.fillText(`v = ${velocity.toFixed(1)} m/s`, canvasWidth - 190, 120);
  }, [state, canvasWidth]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    // Canvas'ı temizle
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Arka plan gradyanı
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#f5f7fa');
    gradient.addColorStop(1, '#e4e7eb');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Zemin çizgisi
    ctx.fillStyle = '#34495e';
    ctx.fillRect(CANVAS_PADDING, canvasHeight - CANVAS_PADDING, canvasWidth - 2 * CANVAS_PADDING, 2);

    drawAxis(ctx);
    drawTrajectory(ctx);
    drawProjectile(ctx);
    drawInfo(ctx);
  }, [drawAxis, drawTrajectory, drawProjectile, drawInfo, canvasHeight, canvasWidth]);

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
    <View style={styles.container}>
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
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
  content: {
    padding: 20,
  },
  canvasContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#dfe6e9',
  },
  canvas: {
    width: '100%',
    height: '100%',
  },
}); 