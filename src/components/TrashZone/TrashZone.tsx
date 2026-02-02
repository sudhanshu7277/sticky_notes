import React from 'react';
import styles from './TrashZone.module.css';

export const TrashZone: React.FC<{ isDragging: boolean }> = ({ isDragging }) => (
  <div className={`${styles.trashZone} ${isDragging ? styles.active : ''}`}>
    <span>{isDragging ? '🔥' : '🗑️'}</span>
    <p>Drop to Delete</p>
  </div>
);