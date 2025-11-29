import React, { useState, useEffect, useRef } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Column as ColumnType, Task } from '../types';
import TaskCard from './TaskCard';
import { MoreHorizontal, Plus, GripVertical } from 'lucide-react';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: (columnId: string) => void;
  isLayoutMode: boolean;
  onResize: (columnId: string, width: number) => void;
}

const Column: React.FC<ColumnProps> = ({ 
  column, 
  tasks, 
  onTaskClick, 
  onAddTask,
  isLayoutMode,
  onResize
}) => {
  const [width, setWidth] = useState(column.width || 320);
  const isResizingRef = useRef(false);

  // Sync with prop if it changes externally (e.g. initial load or reset)
  useEffect(() => {
    if (column.width) {
      setWidth(column.width);
    }
  }, [column.width]);

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizingRef.current = true;
    
    const startX = e.clientX;
    const startWidth = width;

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!isResizingRef.current) return;
      const delta = moveEvent.clientX - startX;
      // Enforce min width of 250px and max of 800px
      const newWidth = Math.min(Math.max(250, startWidth + delta), 800);
      setWidth(newWidth);
    };

    const onMouseUp = () => {
      isResizingRef.current = false;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      // Persist the final width
      onResize(column.id, width); // This might use the closure's stale width if not careful, but setWidth is async. 
      // Better to use a ref for current width if we needed exact precision inside this closure, 
      // but here we can just recalculate or rely on the state update being fast enough for the drag end?
      // Actually, onMouseUp runs in the same closure scope. Let's rely on the latest value calculation.
      // Re-calculating to be safe:
      // However, we can't access `moveEvent` here easily.
      // Simpler: Just save `width` state on effect or use a ref for the width value.
    };
    
    // To properly save the final value, we need access to the latest width.
    // Let's modify onMouseMove to update a ref as well, or just trigger the parent save there? 
    // Triggering parent save on every pixel is bad.
    // Let's use a ref to track the transient width.
  };
  
  // Ref-based resize implementation for robustness
  const resizeHandler = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      const startX = e.clientX;
      const startWidth = width;
      let currentWidth = startWidth;

      const onMouseMove = (moveEvent: MouseEvent) => {
          const delta = moveEvent.clientX - startX;
          currentWidth = Math.min(Math.max(250, startWidth + delta), 800);
          setWidth(currentWidth); // Update local visual state
      };

      const onMouseUp = () => {
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
          onResize(column.id, currentWidth); // Persist to parent
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div 
        className={`flex flex-col h-full mx-2 shrink-0 transition-all duration-200 relative ${isLayoutMode ? 'border border-dashed border-primary/30 rounded-xl bg-primary/5' : ''}`}
        style={{ width: `${width}px` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-1 mt-1">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 truncate">
            {column.title}
          </h2>
          <span className="text-xs font-medium text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full shrink-0">
            {tasks.length}
          </span>
        </div>
        {!isLayoutMode && (
          <div className="flex gap-1">
              <button 
                  onClick={() => onAddTask(column.id)}
                  className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
              >
                  <Plus size={16} />
              </button>
              <button className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors">
                  <MoreHorizontal size={16} />
              </button>
          </div>
        )}
      </div>

      {/* Droppable Area */}
      <div className="flex-1 bg-slate-900/50 rounded-xl border border-white/5 p-2 flex flex-col overflow-hidden">
        <Droppable droppableId={column.id}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`flex-1 overflow-y-auto custom-scrollbar transition-colors duration-200 px-1 py-1 ${
                snapshot.isDraggingOver ? 'bg-slate-800/30' : ''
              }`}
            >
              {tasks.map((task, index) => (
                <TaskCard 
                    key={task.id} 
                    task={task} 
                    index={index} 
                    onClick={onTaskClick}
                />
              ))}
              {provided.placeholder}
              
              <button 
                onClick={() => onAddTask(column.id)}
                className="w-full py-2 mt-2 flex items-center justify-center gap-2 text-slate-500 hover:text-primary hover:bg-slate-800/50 rounded-lg border border-dashed border-slate-700 hover:border-primary/50 transition-all text-sm group"
              >
                <Plus size={14} className="group-hover:scale-110 transition-transform"/>
                Create issue
              </button>
            </div>
          )}
        </Droppable>
      </div>

      {/* Resize Handle */}
      {isLayoutMode && (
          <div 
            onMouseDown={resizeHandler}
            className="absolute -right-3 top-0 bottom-0 w-4 cursor-col-resize z-20 flex items-center justify-center group hover:bg-primary/10 rounded"
            title="Drag to resize"
          >
              <div className="w-1 h-8 bg-slate-600 rounded-full group-hover:bg-primary transition-colors" />
          </div>
      )}
    </div>
  );
};

export default Column;