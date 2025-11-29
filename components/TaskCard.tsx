import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Task, Priority } from '../types';
import { Calendar, Tag, AlertCircle } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  index: number;
  onClick: (task: Task) => void;
}

const PriorityColors = {
  [Priority.LOW]: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  [Priority.MEDIUM]: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  [Priority.HIGH]: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  [Priority.CRITICAL]: 'bg-red-500/20 text-red-300 border-red-500/30',
};

const TaskCard: React.FC<TaskCardProps> = ({ task, index, onClick }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick(task)}
          className={`
            group relative p-4 mb-3 rounded-lg border 
            bg-surface transition-all duration-200
            hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5
            ${snapshot.isDragging ? 'shadow-2xl ring-2 ring-primary rotate-2 z-50' : 'border-surfaceHighlight'}
          `}
          style={provided.draggableProps.style}
        >
          <div className="flex justify-between items-start mb-2">
            <span className={`text-xs font-medium px-2 py-0.5 rounded border ${PriorityColors[task.priority]}`}>
              {task.priority}
            </span>
            {task.storyPoints && (
              <span className="text-xs font-mono bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded-full">
                {task.storyPoints}
              </span>
            )}
          </div>

          <h4 className="text-sm font-semibold text-slate-100 mb-1 leading-snug group-hover:text-primary transition-colors">
            {task.title}
          </h4>
          
          <p className="text-xs text-slate-400 line-clamp-2 mb-3">
            {task.description || "No description provided."}
          </p>

          <div className="flex items-center justify-between mt-auto">
            <div className="flex gap-1 overflow-hidden">
              {task.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded">
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center text-slate-500">
               {task.acceptanceCriteria && task.acceptanceCriteria.length > 0 && (
                 <AlertCircle size={14} className="ml-2 text-emerald-500/70" />
               )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
