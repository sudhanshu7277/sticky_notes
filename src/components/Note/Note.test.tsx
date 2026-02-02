import { render, fireEvent, screen } from '@testing-library/react';
import { Note } from './Note';
import { NoteData } from '../../types';

const mockNote: NoteData = {
  id: '1',
  x: 100,
  y: 100,
  width: 200,
  height: 200,
  text: 'Test Note',
  zIndex: 1,
  color: '#fef08a'
};

describe('Note Component', () => {
  const mockOnUpdate = jest.fn();
  const mockOnFocus = jest.fn();
  const mockOnDeleteRequest = jest.fn();
  const mockSetGlobalDragging = jest.fn();

  const defaultProps = {
    note: mockNote,
    onUpdate: mockOnUpdate,
    onFocus: mockOnFocus,
    onDeleteRequest: mockOnDeleteRequest,
    setGlobalDragging: mockSetGlobalDragging,
  };

  test('renders text correctly', () => {
    render(<Note {...defaultProps} />);
    expect(screen.getByPlaceholderText(/Write something.../i)).toHaveValue('Test Note');
  });

  test('calls onFocus when clicked', () => {
    render(<Note {...defaultProps} />);
    const noteElement = screen.getByPlaceholderText(/Write something.../i).parentElement!;
    fireEvent.mouseDown(noteElement);
    expect(mockOnFocus).toHaveBeenCalledWith('1');
  });

  test('updates text on change', () => {
    render(<Note {...defaultProps} />);
    const textarea = screen.getByPlaceholderText(/Write something.../i);
    fireEvent.change(textarea, { target: { value: 'New content' } });
    expect(mockOnUpdate).toHaveBeenCalledWith('1', { text: 'New content' });
  });

  test('simulates dragging movement', () => {
    render(<Note {...defaultProps} />);
    const noteElement = screen.getByPlaceholderText(/Write something.../i).parentElement!;

    // Start drag at (100, 100)
    fireEvent.mouseDown(noteElement, { clientX: 100, clientY: 100 });
    
    // Move mouse to (150, 150)
    fireEvent.mouseMove(window, { clientX: 150, clientY: 150 });

    // New position should be (150, 150) because offset was 0
    expect(mockOnUpdate).toHaveBeenCalledWith('1', { x: 150, y: 150 });
  });

  test('triggers delete request on mouse up', () => {
    render(<Note {...defaultProps} />);
    const noteElement = screen.getByPlaceholderText(/Write something.../i).parentElement!;

    fireEvent.mouseDown(noteElement, { clientX: 100, clientY: 100 });
    fireEvent.mouseUp(window, { clientX: 900, clientY: 900 });

    expect(mockOnDeleteRequest).toHaveBeenCalledWith('1', 900, 900);
  });
});