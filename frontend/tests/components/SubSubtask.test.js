import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import SubSubtask from '../../src/components/MainDashboard/SubSubTask';
import tasksApi from '../../src/api/tasksApi';
import { DragDropContext } from 'react-beautiful-dnd';

jest.mock('../../src/api/tasksApi'); // Mock tasksApi

describe('SubSubtask', () => {
  const mockSubSubtask = {
    id: 1,
    description: 'Test SubSubtask',
  };
  const mockProps = {
    subsubtask: mockSubSubtask,
    index: 0,
    onDelete: jest.fn(),
    category: 'Running',
    refreshTasks: jest.fn(),
  };

  it('renders SubSubtask with description', () => {
    render(
      <DragDropContext onDragEnd={() => {}}>
        <SubSubtask {...mockProps} />
      </DragDropContext>
    );
    expect(screen.getByText('Test SubSubtask')).toBeInTheDocument();
  });

  it('edits sub-subtask description and calls saveEdit', async () => {
    tasksApi.UpdateItem.mockResolvedValue({});
    render(
      <DragDropContext onDragEnd={() => {}}>
        <SubSubtask {...mockProps} />
      </DragDropContext>
    );

    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Updated SubSubtask' } });
    fireEvent.blur(screen.getByRole('textbox'));

    expect(tasksApi.UpdateItem).toHaveBeenCalledWith(mockSubSubtask.id, 'subsubtask', 'Updated SubSubtask');
    expect(mockProps.refreshTasks).toHaveBeenCalled();
  });

  it('calls onDelete when delete icon is clicked', () => {
    render(
      <DragDropContext onDragEnd={() => {}}>
        <SubSubtask {...mockProps} />
      </DragDropContext>
    );
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(mockProps.onDelete).toHaveBeenCalledWith(mockSubSubtask.id, mockProps.category, 'subsubtask');
  });
});
