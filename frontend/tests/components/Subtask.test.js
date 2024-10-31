import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Subtask from '../../src/components/MainDashboard/Subtask';
import tasksApi from '../../src/api/tasksApi';
import { DragDropContext } from 'react-beautiful-dnd';

jest.mock('../../src/api/tasksApi'); // Mock tasksApi

describe('Subtask', () => {
  const mockSubtask = {
    id: 1,
    description: 'Test Subtask',
    subsubtasks: [],
  };
  const mockProps = {
    subtask: mockSubtask,
    index: 0,
    onAddSubSubtask: jest.fn(),
    onDelete: jest.fn(),
    category: 'Running',
    refreshTasks: jest.fn(),
  };

  it('renders Subtask with description', () => {
    render(
      <DragDropContext onDragEnd={() => {}}>
        <Subtask {...mockProps} />
      </DragDropContext>
    );
    expect(screen.getByText('Test Subtask')).toBeInTheDocument();
  });

  it('calls onAddSubSubtask when Plus icon is clicked', () => {
    render(
      <DragDropContext onDragEnd={() => {}}>
        <Subtask {...mockProps} />
      </DragDropContext>
    );
    fireEvent.click(screen.getByRole('button', { name: /plus/i }));
    expect(mockProps.onAddSubSubtask).toHaveBeenCalledWith(mockSubtask);
  });

  it('edits subtask description and calls saveEdit', async () => {
    tasksApi.UpdateItem.mockResolvedValue({});
    render(
      <DragDropContext onDragEnd={() => {}}>
        <Subtask {...mockProps} />
      </DragDropContext>
    );

    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Updated Subtask' } });
    fireEvent.blur(screen.getByRole('textbox'));

    expect(tasksApi.UpdateItem).toHaveBeenCalledWith(mockSubtask.id, 'subtask', 'Updated Subtask');
    expect(mockProps.refreshTasks).toHaveBeenCalled();
  });
});
