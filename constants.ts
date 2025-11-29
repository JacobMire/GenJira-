import { BoardData, Priority } from './types';

export const INITIAL_DATA: BoardData = {
  tasks: {
    'task-1': {
      id: 'task-1',
      title: 'Integrate Gemini API',
      description: 'Connect the backend service to Google Gemini for AI task enhancement.',
      priority: Priority.HIGH,
      tags: ['AI', 'Backend'],
      storyPoints: 5,
      createdAt: Date.now(),
      acceptanceCriteria: ['API Key validation', 'Error handling', 'Response parsing']
    },
    'task-2': {
      id: 'task-2',
      title: 'Design System Update',
      description: 'Refresh the color palette to match the new dark mode aesthetics.',
      priority: Priority.MEDIUM,
      tags: ['Design', 'UI'],
      storyPoints: 3,
      createdAt: Date.now() - 100000,
    },
    'task-3': {
      id: 'task-3',
      title: 'Fix Drag Lag',
      description: 'Investigate performance drop when dragging cards with many sub-elements.',
      priority: Priority.CRITICAL,
      tags: ['Bug', 'Performance'],
      storyPoints: 8,
      createdAt: Date.now() - 200000,
    }
  },
  columns: {
    'col-1': {
      id: 'col-1',
      title: 'To Do',
      taskIds: ['task-1', 'task-2'],
      width: 320
    },
    'col-2': {
      id: 'col-2',
      title: 'In Progress',
      taskIds: ['task-3'],
      width: 320
    },
    'col-3': {
      id: 'col-3',
      title: 'Done',
      taskIds: [],
      width: 320
    }
  },
  columnOrder: ['col-1', 'col-2', 'col-3']
};

export const STORAGE_KEY = 'genjira-board-data-v1';