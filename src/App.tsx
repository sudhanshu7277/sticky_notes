import React, { useState, useEffect, useCallback } from 'react';
import { NoteData } from './types';
import { Note } from './components/Note/Note';
import { TrashZone } from './components/TrashZone/TrashZone';
import './App.css';

const App: React.FC = () => {
  const [notes, setNotes] = useState<NoteData[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [maxZ, setMaxZ] = useState(1);

  useEffect(() => {
    const saved = localStorage.getItem('sticky_notes');
    if (saved) {
      const parsed = JSON.parse(saved);
      setNotes(parsed);
      if (parsed.length > 0) {
        setMaxZ(Math.max(...parsed.map((n: any) => n.zIndex)) + 1);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sticky_notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    const startX = 80;
    const startY = 80;
    
    setNotes(prev => {
      const shifted = prev.map(n => {
        if (n.x < 350 && n.y < 350) {
          return { ...n, x: n.x + 150 };
        }
        return n;
      });

      const newNote: NoteData = {
        id: Date.now().toString(),
        x: startX,
        y: startY,
        width: 250,
        height: 250,
        text: '',
        zIndex: maxZ + 1,
        color: '#fef08a'
      };

      return [...shifted, newNote];
    });
    
    setMaxZ(prev => prev + 1);
  };

  const updateNote = useCallback((id: string, updates: Partial<NoteData>) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));
  }, []);

  const focusNote = useCallback((id: string) => {
    setMaxZ(prev => {
      const newZ = prev + 1;
      updateNote(id, { zIndex: newZ });
      return newZ;
    });
  }, [updateNote]);

  const handleDeleteRequest = (id: string, mouseX: number, mouseY: number) => {
    const trashSize = 150;
    const isOverTrash = 
      mouseX > window.innerWidth - trashSize && 
      mouseY > window.innerHeight - trashSize;

    if (isOverTrash) {
      setNotes(prev => prev.filter(n => n.id !== id));
    }
  };

  return (
    <div className="canvas">
      <header className="controls">
        <button className="add-btn" onClick={addNote}>
          <span className="plus-icon">+</span> New Note
        </button>
      </header>

      {notes.map(n => (
        <Note 
          key={n.id} 
          note={n} 
          onUpdate={updateNote} 
          onFocus={focusNote}
          onDeleteRequest={handleDeleteRequest}
          setGlobalDragging={setIsDragging} 
        />
      ))}

      <TrashZone isDragging={isDragging} />
    </div>
  );
};

export default App;