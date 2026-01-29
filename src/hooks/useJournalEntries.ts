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

  const updateEntry = (id: string, content: string) => {
    setEntries(prev => prev.map(e => 
      e.id === id ? { ...e, content, timestamp: Date.now() } : e
    ));
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
    updateEntry,
    deleteEntry,
    getRecentEntries,
  };
}

export default useJournalEntries;
