'use client';

import { useState } from 'react';
import { Bell, X, CheckCheck, AlertTriangle, Info, Megaphone, ChevronRight, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getUnacknowledgedAlerts, getPinnedAnnouncements, mockAlerts } from '@/lib/data';
import { useAnnouncements } from '@/lib/store';
import { formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';
import type { Alert } from '@/lib/types';

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
}

type TabType = 'all' | 'alert' | 'announcement' | 'system';

export function NotificationPanel({ open, onClose }: NotificationPanelProps) {
  const [tab, setTab] = useState<TabType>('all');
  const { announcements } = useAnnouncements();
  const [localAlerts, setLocalAlerts] = useState(mockAlerts);

  if (!open) return null;

  const tabs: { key: TabType; label: string }[] = [
    { key: 'all', label: '全部' },
    { key: 'alert', label: '告警' },
    { key: 'announcement', label: '公告' },
    { key: 'system', label: '系统' },
  ];

  const filtered = tab === 'all' ? localAlerts : localAlerts.filter((a) => a.category === tab);
  const unreadCount = localAlerts.filter((a) => !a.acknowledged).length;
  const pinnedAnnouncements = announcements.filter((a) => a.pinned && a.status === 'published');

  const handleAcknowledge = (id: string) => {
    setLocalAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)));
  };

  const handleAcknowledgeAll = () => {
    setLocalAlerts((prev) => prev.map((a) => ({ ...a, acknowledged: true })));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'alert': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'announcement': return <Megaphone className="h-4 w-4 text-blue-500" />;
      case 'system': return <Info className="h-4 w-4 text-zinc-500" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'alert': return '告警';
      case 'announcement': return '公告';
      case 'system': return '系统';
      default: return '';
    }
  };

  const getTypeColors = (type: string) => {
    switch (type) {
      case 'error': return 'border-l-red-500 bg-red-50/50 dark:bg-red-950/20';
      case 'warning': return 'border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20';
      case 'info': return 'border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20';
      case 'success': return 'border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20';
      default: return 'border-l-zinc-300';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Panel */}
      <div className="absolute right-0 top-12 z-50 w-96 rounded-xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-700">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-zinc-600 dark:text-zinc-300" />
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">通知中心</h3>
            {unreadCount > 0 && (
              <Badge variant="error" size="sm">{unreadCount} 条未读</Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleAcknowledgeAll}
              className="rounded-lg p-1.5 text-xs text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-700"
              title="全部标为已读"
            >
              <CheckCheck className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Pinned Announcements */}
        {pinnedAnnouncements.length > 0 && tab === 'all' && (
          <div className="border-b border-amber-200 bg-amber-50/50 p-3 dark:border-amber-800 dark:bg-amber-950/20">
            <div className="flex items-center gap-1.5 mb-2">
              <Megaphone className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              <span className="text-xs font-medium text-amber-700 dark:text-amber-300">置顶公告</span>
            </div>
            {pinnedAnnouncements.map((ann) => (
              <Link
                key={ann.id}
                href="/announcements"
                className="block rounded-lg p-2 transition-colors hover:bg-amber-100/50 dark:hover:bg-amber-900/30"
                onClick={onClose}
              >
                <p className="text-sm font-medium text-amber-900 dark:text-amber-200">{ann.title}</p>
                <p className="mt-0.5 text-xs text-amber-600 dark:text-amber-400">{ann.publishedAt ? formatRelativeTime(ann.publishedAt) : ''}</p>
              </Link>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-zinc-200 px-2 dark:border-zinc-700">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                tab === t.key
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="max-h-96 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-zinc-400">
              <Bell className="h-8 w-8 mb-2" />
              <p className="text-sm">暂无通知</p>
            </div>
          ) : (
            filtered.map((alert) => (
              <div
                key={alert.id}
                className={`border-l-2 p-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-700/50 ${
                  getTypeColors(alert.type)
                } ${alert.acknowledged ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getCategoryIcon(alert.category)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{alert.title}</p>
                      <Badge variant="outline" size="sm">{getCategoryLabel(alert.category)}</Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">{alert.message}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <span className="text-xs text-zinc-400">{formatRelativeTime(alert.createdAt)}</span>
                      {!alert.acknowledged && (
                        <button
                          onClick={() => handleAcknowledge(alert.id)}
                          className="text-xs text-blue-600 hover:underline dark:text-blue-400"
                        >
                          标为已读
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-zinc-200 p-3 dark:border-zinc-700">
          <Link
            href="/announcements"
            onClick={onClose}
            className="flex items-center justify-center gap-1 rounded-lg py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-700"
          >
            查看全部公告
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </>
  );
}