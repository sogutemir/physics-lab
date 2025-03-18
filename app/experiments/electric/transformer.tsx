import React, { useState } from 'react';
import { useLanguage } from '../../../components/LanguageContext';
import ExperimentLayout from '../../../components/ExperimentLayout';
import TransformerSimulation from './components/transformer/TransformerSimulation';

export default function Transformer() {
  const { t } = useLanguage();
  // Simülasyon her zaman çalışır durumda olacak
  const [isRunning] = useState(true);

  return (
    <ExperimentLayout
      title="Transformatör Deneyi"
      titleEn="Transformer Experiment"
      difficulty="Orta"
      difficultyEn="Intermediate"
      description="Bu deneyde, bir transformatörün çalışma prensiplerini ve farklı parametrelerin transformatör verimliliğine etkisini inceleyeceksiniz. Transformatörler, elektromanyetik endüksiyon prensibine dayanarak çalışan elektrik devre elemanlarıdır. Bir transformatör, iki veya daha fazla bobinin manyetik olarak birbirine bağlandığı bir sistemdir. Primer sargıya uygulanan alternatif akım, nüve içinde değişken bir manyetik alan oluşturur. Bu değişken manyetik alan, sekonder sargıda bir gerilim endükler. İdeal bir transformatörde, primer ve sekonder gerilimlerin oranı, sarım sayılarının oranına eşittir: V₂/V₁ = N₂/N₁."
      descriptionEn="In this experiment, you will explore the working principles of a transformer and the effects of different parameters on transformer efficiency. Transformers are electrical devices that work based on the principle of electromagnetic induction. A transformer consists of two or more coils magnetically coupled to each other. The alternating current applied to the primary winding creates a varying magnetic field in the core. This varying magnetic field induces a voltage in the secondary winding. In an ideal transformer, the ratio of secondary to primary voltages equals the ratio of the number of turns: V₂/V₁ = N₂/N₁."
      isRunning={isRunning}
      hideControls={true} // Başlat/durdur ve sıfırla butonlarını gizle
    >
      <TransformerSimulation isRunning={isRunning} />
    </ExperimentLayout>
  );
}
