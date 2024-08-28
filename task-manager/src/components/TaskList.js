import React from 'react';
import Task from './Task';

function TaskList({ task }) {
  return (
    <div className="task-list">
      <Task task={task} />
    </div>
  );
}

export default TaskList;
