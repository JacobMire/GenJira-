import React, { useState, useEffect, useRef } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Column as ColumnType, Task } from '../types';
import TaskCard from './TaskCard';
import { MoreHorizontal, Plus, Trash2, Pencil, Check, X } from 'lucide-react';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: (columnId: string) => void;
  isLayoutMode: boolean;
  onResize: (columnId: string, width: number) => void;
  onRename: (columnId: string, title: string) => void;
  onDelete: (columnId: string) => void;
}

const Column: React.FC<ColumnProps> = ({ 
  column, 
  tasks, 
  onTaskClick, 
  onAddTask,
  isLayoutMode,
  onResize,
  onRename,
  onDelete
}) => {
  const [width, setWidth] = useState(column.width || 320);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [titleInput, setTitleInput] = useState(column.title);
  
  const isResizingRef = useRef(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync with prop if it changes externally
  useEffect(() => {
    if (column.width) {
      setWidth(column.width);
    }
  }, [column.width]);
  
  useEffect(() => {
      setTitleInput(column.title);
  }, [column.title]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
      if (isRenaming && inputRef.current) {
          inputRef.current.focus();
      }
  }, [isRenaming]);

  const handleRenameSubmit = () => {
      if (titleInput.trim()) {
          onRename(column.id, titleInput);
      } else {
          setTitleInput(column.title); // Revert if empty
      }
      setIsRenaming(false);
  };
  
  // Ref-based resize implementation
  const resizeHandler = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      const startX = e.clientX;
      const startWidth = width;
      let currentWidth = startWidth;

      const onMouseMove = (moveEvent: MouseEvent) => {
          const delta = moveEvent.clientX - startX;
          currentWidth = Math.min(Math.max(250, startWidth + delta), 800);
          setWidth(currentWidth); 
      };

      const onMouseUp = () => {
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
          onResize(column.id, currentWidth); 
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
      <div className="flex items-center justify-between mb-3 px-1 mt-1 h-8">
        {isRenaming ? (
            <div className="flex items-center gap-1 w-full">
                <input 
                    ref={inputRef}
                    type="text" 
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRenameSubmit()}
                    onBlur={handleRenameSubmit}
                    className="flex-1 bg-slate-800 text-sm font-bold text-white px-2 py-1 rounded border border-primary outline-none"
                />
            </div>
        ) : (
            <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 truncate cursor-default" title={column.title}>
                {column.title}
            </h2>
            <span className="text-xs font-medium text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full shrink-0">
                {tasks.length}
            </span>
            </div>
        )}

        {!isLayoutMode && !isRenaming && (
          <div className="flex gap-1 relative">
              <button 
                  onClick={() => onAddTask(column.id)}
                  className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
                  title="Create Task"
              >
                  <Plus size={16} />
              </button>
              
              <div ref={menuRef}>
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className={`p-1 rounded transition-colors ${isMenuOpen ? 'text-white bg-slate-700' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
                >
                    <MoreHorizontal size={16} />
                </button>

                {isMenuOpen && (
                    <div className="absolute right-0 top-8 w-40 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsRenaming(true);
                                setIsMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700 flex items-center gap-2"
                        >
                            <Pencil size={14} /> Rename
                        </button>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                if (confirm('Are you sure you want to delete this column? All tasks inside will be deleted.')) {
                                    onDelete(column.id);
                                }
                                setIsMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/30 flex items-center gap-2"
                        >
                            <Trash2 size={14} /> Delete
                        </button>
                    </div>
                )}
              </div>
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