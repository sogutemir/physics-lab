import { Platform } from 'react-native';
import { MobileTransverseWave } from './MobileTransverseWave';
import { WebTransverseWave } from './WebTransverseWave';

// Platform'a göre uygun bileşeni export et
export const TransverseWave =
  Platform.OS === 'web' ? WebTransverseWave : MobileTransverseWave;
