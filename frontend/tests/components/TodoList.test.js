import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoList from '../../src/components/MainDashboard/TodoList';
import { DragDropContext } from 'react-beautiful-dnd';

describe('TodoList', () => {
  const mockTasks = [
    { id: 1, description: 'Task 1', subtasks: [] },
    { id: 2, description: 'Task 2', subtasks: [] },
  ];
  const mockProps = {
    title: 'Running',
    tasks: mockTasks,
    onDelete: jest.fn(),
    onAddSubtask: jest.fn(),
    onAddSubSubtask: jest.fn(),
    refreshTasks: jest.fn(),
  };

  it('renders with provided tasks', () => {
    render(
      <DragDropContext onDragEnd={() => {}}>
        <TodoList {...mockProps} />
      </DragDropContext>
    );

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  it('calls onDelete when the delete button is clicked on a task', () => {
    render(
      <DragDropContext onDragEnd={() => {}}>
        <TodoList {...mockProps} />
      </DragDropContext>
    );

    fireEvent.click(screen.getAllByRole('button', { name: /delete/i })[0]);
    expect(mockProps.onDelete).toHaveBeenCalledWith(1, 'Running', 'task');
  });

  it('changes background color when dragging over', () => {
    render(
      <DragDropContext onDragEnd={() => {}}>
        <TodoList {...mockProps} />
      </DragDropContext>
    );

    const droppableElement = screen.getByText('Running').parentElement;
    fireEvent.dragEnter(droppableElement);
    expect(droppableElement).toHaveStyle('background-color: lightblue');
  });
});
