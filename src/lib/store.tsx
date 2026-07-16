'use client';

import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { Announcement } from './types';
import { mockAnnouncements } from './data';

// Actions
type AnnouncementAction =
  | { type: 'ADD'; payload: Announcement }
  | { type: 'UPDATE'; payload: Announcement }
  | { type: 'DELETE'; payload: string }
  | { type: 'TOGGLE_PIN'; payload: string }
  | { type: 'ARCHIVE'; payload: string }
  | { type: 'PUBLISH'; payload: string };

function announcementReducer(state: Announcement[], action: AnnouncementAction): Announcement[] {
  switch (action.type) {
    case 'ADD':
      return [action.payload, ...state];
    case 'UPDATE':
      return state.map((a) => (a.id === action.payload.id ? action.payload : a));
    case 'DELETE':
      return state.filter((a) => a.id !== action.payload);
    case 'TOGGLE_PIN':
      return state.map((a) => (a.id === action.payload ? { ...a, pinned: !a.pinned } : a));
    case 'ARCHIVE':
      return state.map((a) => (a.id === action.payload ? { ...a, status: 'archived' as const } : a));
    case 'PUBLISH':
      return state.map((a) =>
        a.id === action.payload
          ? { ...a, status: 'published' as const, publishedAt: new Date().toISOString() }
          : a,
      );
    default:
      return state;
  }
}

const AnnouncementContext = createContext<{
  announcements: Announcement[];
  dispatch: React.Dispatch<AnnouncementAction>;
} | null>(null);

export function AnnouncementProvider({ children }: { children: ReactNode }) {
  const [announcements, dispatch] = useReducer(announcementReducer, mockAnnouncements);

  return (
    <AnnouncementContext.Provider value={{ announcements, dispatch }}>
      {children}
    </AnnouncementContext.Provider>
  );
}

export function useAnnouncements() {
  const ctx = useContext(AnnouncementContext);
  if (!ctx) throw new Error('useAnnouncements must be used within AnnouncementProvider');
  return ctx;
}

export function useAnnouncement(id: string) {
  const { announcements } = useAnnouncements();
  return announcements.find((a) => a.id === id);
}

export { announcementReducer };
export type { AnnouncementAction };