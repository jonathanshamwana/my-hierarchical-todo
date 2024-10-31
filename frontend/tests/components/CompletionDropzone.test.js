import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CompletedDropzone from '../../src/components/MainDashboard/CompletedDropzone';
import { DragDropContext } from 'react-beautiful-dnd';

describe('CompletedDropzone', () => {
  it('renders the completed dropzone', () => {
    render(
      <DragDropContext onDragEnd={() => {}}>
        <CompletedDropzone />
      </DragDropContext>
    );

    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Drag here to complete tasks')).toBeInTheDocument();
  });

  it('changes background color when dragging over', () => {
    render(
      <DragDropContext onDragEnd={() => {}}>
        <CompletedDropzone />
      </DragDropContext>
    );

    const dropzone = screen.getByText('Completed').parentElement;
    fireEvent.dragEnter(dropzone);
    expect(dropzone).toHaveStyle('background-color: #93b0a5');
  });
});
