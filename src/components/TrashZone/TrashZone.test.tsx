import { render, screen } from '@testing-library/react';
import { TrashZone } from './TrashZone';

describe('TrashZone Component', () => {
  test('renders with default state', () => {
    render(<TrashZone isDragging={false} />);
    expect(screen.getByText('🗑️')).toBeInTheDocument();
    expect(screen.getByText(/Drop to Delete/i)).toBeInTheDocument();
  });

  test('applies active class and changes icon when dragging', () => {
    const { container } = render(<TrashZone isDragging={true} />);
    
    // Check for the fire emoji change
    expect(screen.getByText('🔥')).toBeInTheDocument();
    
    // Check if the "active" class from the CSS module is applied
    // Note: CSS modules generate unique class names, so we check for partial matches
    const trashDiv = container.firstChild as HTMLElement;
    expect(trashDiv.className).toContain('active');
  });
});