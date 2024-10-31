import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddTaskForm from '../../src/components/MainDashboard/AddTaskForm';

describe('AddTaskForm', () => {
  const mockCategories = ['Running', 'Nutrition'];
  const mockOnAddTask = jest.fn();

  it('renders form elements correctly for adding a task', () => {
    render(<AddTaskForm categories={mockCategories} onAddTask={mockOnAddTask} formType="task" />);

    expect(screen.getByPlaceholderText('Task name')).toBeInTheDocument();
    expect(screen.getByText('Add Subtask')).toBeInTheDocument();
    expect(screen.getByText('Add New Task')).toBeInTheDocument();
  });

  it('adds a new task when form is submitted', () => {
    render(<AddTaskForm categories={mockCategories} onAddTask={mockOnAddTask} formType="task" />);

    fireEvent.change(screen.getByPlaceholderText('Task name'), { target: { value: 'New Task' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Running' } });
    fireEvent.click(screen.getByRole('button', { name: /add task/i }));

    expect(mockOnAddTask).toHaveBeenCalledWith({
      description: 'New Task',
      subtasks: [{ id: 1, name: '' }],
      subSubtasks: [],
      category: 'Running',
    });
  });

  it('adds and removes subtasks', () => {
    render(<AddTaskForm categories={mockCategories} onAddTask={mockOnAddTask} formType="task" />);

    fireEvent.click(screen.getByText('Add Subtask'));
    expect(screen.getAllByPlaceholderText(/Subtask/i)).toHaveLength(2); // Two subtasks now

    fireEvent.click(screen.getAllByRole('button', { name: /×/i })[0]); // Remove first subtask
    expect(screen.getAllByPlaceholderText(/Subtask/i)).toHaveLength(1); // Back to one subtask
  });

  it('displays validation error if form data is incomplete', () => {
    render(<AddTaskForm categories={mockCategories} onAddTask={mockOnAddTask} formType="task" />);

    fireEvent.click(screen.getByRole('button', { name: /add task/i }));
    expect(mockOnAddTask).not.toHaveBeenCalled(); // Should not submit if form is incomplete
  });
});
