import { useLocalStorage } from './useLocalStorage';

export interface JournalEntry {
  id: string;
  content: string;
  timestamp: number;
}

export function useJournalEntries() {
  const [entries, setEntries] = useLocalStorage<JournalEntry[]>('anxiety-ease-journal', []);

  const saveEntry = (content: string) => {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      content,
      timestamp: Date.now(),
    };
    setEntries(prev => [newEntry, ...prev]);
    return newEntry.id;
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const getRecentEntries = (count: number = 10) => {
    return entries.slice(0, count);
  };

  return {
    entries,
    saveEntry,
    deleteEntry,
    getRecentEntries,
  };
}

export default useJournalEntries;
