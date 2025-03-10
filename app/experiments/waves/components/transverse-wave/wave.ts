import { Point, WaveParameters } from './types';

// Dalga parametrelerini hesapla
export const calculateWaveParameters = (
  amplitude: number,
  wavelength: number,
  waveSpeed: number = 50
): WaveParameters => {
  // Dalga sayısı (k) = 2π/λ
  const waveNumber = (2 * Math.PI) / wavelength;

  // Periyot (T) = λ/v
  const period = wavelength / waveSpeed;

  return {
    amplitude,
    wavelength,
    waveSpeed,
    period,
    waveNumber,
  };
};

// Periyot grafiği çiz
export const drawPeriodGraph = (
  ctx: any,
  width: number,
  height: number,
  data: { [key: number]: Point[] },
  amplitude: number,
  period: number
) => {
  if (!ctx) return;

  const centerY = height / 2;

  // Arka planı temizle
  ctx.fillStyle = '#f8f9fa';
  ctx.fillRect(0, 0, width, height);

  // X ekseni
  ctx.strokeStyle = '#adb5bd';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, centerY);
  ctx.lineTo(width, centerY);
  ctx.stroke();

  // Zaman ekseni etiketleri
  ctx.fillStyle = '#495057';
  ctx.font = '12px Arial';
  ctx.textAlign = 'center';

  const timeScale = width / (period * 2);

  for (let t = 0; t <= period * 2; t += period / 4) {
    const x = t * timeScale;
    ctx.fillText(`${t.toFixed(1)}s`, x, centerY + 20);

    // Zaman işaretleri
    ctx.beginPath();
    ctx.moveTo(x, centerY - 5);
    ctx.lineTo(x, centerY + 5);
    ctx.stroke();
  }

  // Her nokta için zaman grafiği çiz
  Object.keys(data).forEach((pointIndex, idx) => {
    const pointData = data[Number(pointIndex)];
    const color = idx === 0 ? '#4263eb' : idx === 1 ? '#fa5252' : '#40c057';

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();

    pointData.forEach((point, i) => {
      const x = point.x * timeScale;
      const y = centerY - point.y;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();
  });
};

// Diğer çizim fonksiyonları SVG ile yapıldığı için kaldırıldı
