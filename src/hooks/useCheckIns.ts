import { useLocalStorage } from './useLocalStorage';

export interface CheckIn {
  id: string;
  mood: 1 | 2 | 3 | 4 | 5; // 1 = calm, 5 = very anxious
  note?: string;
  timestamp: number;
}

export function useCheckIns() {
  const [checkIns, setCheckIns] = useLocalStorage<CheckIn[]>('anxiety-ease-checkins', []);

  const addCheckIn = (mood: CheckIn['mood'], note?: string) => {
    const newCheckIn: CheckIn = {
      id: Date.now().toString(),
      mood,
      note,
      timestamp: Date.now(),
    };
    setCheckIns(prev => [newCheckIn, ...prev]);
  };

  const getRecentCheckIns = (days: number = 7) => {
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    return checkIns.filter(c => c.timestamp > cutoff);
  };

  const getWeeklySummary = () => {
    const recent = getRecentCheckIns(7);
    if (recent.length === 0) return null;
    
    const avgMood = recent.reduce((sum, c) => sum + c.mood, 0) / recent.length;
    return {
      totalCheckIns: recent.length,
      averageMood: avgMood,
      moodTrend: avgMood <= 2 ? 'calm' : avgMood <= 3.5 ? 'moderate' : 'elevated',
    };
  };

  return {
    checkIns,
    addCheckIn,
    getRecentCheckIns,
    getWeeklySummary,
  };
}

export default useCheckIns;
