import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import TaskItem from '../../src/components/MainDashboard/TaskItem';
import tasksApi from '../../src/api/tasksApi';
import { DragDropContext } from 'react-beautiful-dnd';

jest.mock('../../src/api/tasksApi'); // Mock tasksApi

describe('TaskItem', () => {
  const mockTask = {
    id: 1,
    description: 'Test Task',
    subtasks: [{ id: 2, description: 'Subtask 1' }],
  };
  const mockProps = {
    task: mockTask,
    index: 0,
    onDelete: jest.fn(),
    onAddSubtask: jest.fn(),
    onAddSubSubtask: jest.fn(),
    category: 'Running',
    refreshTasks: jest.fn(),
  };

  it('renders TaskItem with description', () => {
    render(
      <DragDropContext onDragEnd={() => {}}>
        <TaskItem {...mockProps} />
      </DragDropContext>
    );
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('calls onAddSubtask when Plus icon is clicked', () => {
    render(
      <DragDropContext onDragEnd={() => {}}>
        <TaskItem {...mockProps} />
      </DragDropContext>
    );
    fireEvent.click(screen.getByRole('button', { name: /plus/i }));
    expect(mockProps.onAddSubtask).toHaveBeenCalledWith(mockTask);
  });

  it('triggers delete confirmation and calls onDelete', () => {
    render(
      <DragDropContext onDragEnd={() => {}}>
        <TaskItem {...mockProps} />
      </DragDropContext>
    );
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(mockProps.onDelete).toHaveBeenCalledWith(mockTask.id, mockProps.category, 'task');
  });

  it('edits task description and calls saveEdit', async () => {
    tasksApi.UpdateItem.mockResolvedValue({});
    render(
      <DragDropContext onDragEnd={() => {}}>
        <TaskItem {...mockProps} />
      </DragDropContext>
    );

    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Updated Task' } });
    fireEvent.blur(screen.getByRole('textbox'));

    expect(tasksApi.UpdateItem).toHaveBeenCalledWith(mockTask.id, 'task', 'Updated Task');
    expect(mockProps.refreshTasks).toHaveBeenCalled();
  });
});
