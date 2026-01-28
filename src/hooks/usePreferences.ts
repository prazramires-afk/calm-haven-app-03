import { useLocalStorage } from './useLocalStorage';

export interface UserPreferences {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  darkMode: boolean;
  preferredDuration: number; // in minutes
  ambientSound: 'rain' | 'brown-noise' | 'silence';
}

const defaultPreferences: UserPreferences = {
  soundEnabled: true,
  vibrationEnabled: true,
  darkMode: true,
  preferredDuration: 3,
  ambientSound: 'silence',
};

export function usePreferences() {
  const [preferences, setPreferences] = useLocalStorage<UserPreferences>('anxiety-ease-preferences', defaultPreferences);

  const updatePreference = <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const vibrate = (pattern: number | number[] = 50) => {
    if (preferences.vibrationEnabled && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  return {
    preferences,
    updatePreference,
    vibrate,
  };
}

export default usePreferences;
