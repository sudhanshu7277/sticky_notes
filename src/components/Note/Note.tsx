import React, { useState, useRef, useEffect } from 'react';
import { NoteData } from '../../types';
import styles from './Note.module.css';

const COLORS = ['#fef08a', '#fecaca', '#bbf7d0', '#bae6fd', '#e9d5ff'];

interface Props {
  note: NoteData;
  onUpdate: (id: string, updates: Partial<NoteData>) => void;
  onFocus: (id: string) => void;
  onDeleteRequest: (id: string, x: number, y: number) => void;
  setGlobalDragging: (state: boolean) => void;
}

export const Note: React.FC<Props> = ({ note, onUpdate, onFocus, onDeleteRequest, setGlobalDragging }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === 'TEXTAREA' || (e.target as HTMLElement).tagName === 'BUTTON') return;
    
    onFocus(note.id);
    setIsDragging(true);
    setGlobalDragging(true);
    offset.current = { x: e.clientX - note.x, y: e.clientY - note.y };
    e.preventDefault(); 
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        onUpdate(note.id, { x: e.clientX - offset.current.x, y: e.clientY - offset.current.y });
      } else if (isResizing) {
        onUpdate(note.id, { 
          width: Math.max(200, e.clientX - note.x), 
          height: Math.max(200, e.clientY - note.y) 
        });
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (isDragging) onDeleteRequest(note.id, e.clientX, e.clientY);
      setIsDragging(false);
      setIsResizing(false);
      setGlobalDragging(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, note.id, note.x, note.y, onUpdate, onDeleteRequest, setGlobalDragging]);

  return (
    <div 
      className={`${styles.note} ${isDragging ? styles.dragging : ''}`}
      onMouseDown={handleMouseDown}
      style={{ 
        transform: `translate3d(${note.x}px, ${note.y}px, 0)`, 
        width: note.width, height: note.height, 
        zIndex: note.zIndex, backgroundColor: note.color 
      }}
    >
      <div className={styles.header}>
        <div className={styles.colorPicker}>
          {COLORS.map(c => (
            <button 
              key={c} 
              className={styles.dot} 
              style={{ backgroundColor: c, border: note.color === c ? '2px solid rgba(0,0,0,0.1)' : 'none' }} 
              onClick={() => onUpdate(note.id, { color: c })}
            />
          ))}
        </div>
      </div>
      <textarea 
        className={styles.textarea} 
        value={note.text} 
        placeholder="Write something..."
        onChange={(e) => onUpdate(note.id, { text: e.target.value })}
        onMouseDown={(e) => e.stopPropagation()} 
      />
      <div className={styles.resizer} onMouseDown={(e) => { e.stopPropagation(); setIsResizing(true); }} />
    </div>
  );
};