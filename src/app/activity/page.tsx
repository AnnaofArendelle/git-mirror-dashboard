'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Modal } from '@/components/ui/card';
import { mockActivities } from '@/lib/data';
import { formatRelativeTime, getActivityIcon, getSeverityIcon } from '@/lib/utils';
import { Activity as ActivityIcon, Filter, Download, X, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';

const typeOptions = [
  { value: 'all', label: '全部类型' },
  { value: 'sync', label: '同步' },
  { value: 'error', label: '错误' },
  { value: 'user', label: '用户操作' },
  { value: 'config', label: '配置变更' },
  { value: 'system', label: '系统' },
];

const severityOptions = [
  { value: 'all', label: '全部级别' },
  { value: 'error', label: '🔴 错误' },
  { value: 'warning', label: '🟡 警告' },
  { value: 'info', label: '🔵 信息' },
  { value: 'success', label: '🟢 成功' },
];

export default function ActivityPage() {
  const [typeFilter, setTypeFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [showDetail, setShowDetail] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const filtered = mockActivities.filter((a) => {
    const matchType = typeFilter === 'all' || a.type === typeFilter;
    const matchSeverity = severityFilter === 'all' || a.severity === severityFilter;
    return matchType && matchSeverity;
  });

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const selectedActivity = showDetail ? mockActivities.find((a) => a.id === showDetail) : null;

  const hasFilters = typeFilter !== 'all' || severityFilter !== 'all';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">活动日志</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">查看系统所有操作和事件记录</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />导出
          </Button>
          <Button size="sm" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? '刷新中...' : '刷新'}
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Select options={typeOptions} value={typeFilter} onChange={setTypeFilter} className="w-36" />
          <Select options={severityOptions} value={severityFilter} onChange={setSeverityFilter} className="w-36" />
          {hasFilters && (
            <button
              onClick={() => { setTypeFilter('all'); setSeverityFilter('all'); }}
              className="flex items-center gap-1 text-xs text-blue-600 hover:underline dark:text-blue-400"
            >
              <X className="h-3 w-3" />清除筛选
            </button>
          )}
          <span className="ml-auto text-xs text-zinc-400">{filtered.length} 条记录</span>
        </div>
      </Card>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-px bg-zinc-200 dark:bg-zinc-700" />
        <div className="space-y-4">
          {filtered.map((activity) => {
            const sevColors: Record<string, string> = {
              error: 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20',
              warning: 'border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-900/20',
              info: 'border-blue-200 bg-white dark:border-blue-800 dark:bg-zinc-800/50',
              success: 'border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-900/20',
            };
            return (
              <button
                key={activity.id}
                onClick={() => setShowDetail(activity.id)}
                className={`relative ml-12 w-full text-left rounded-lg border p-4 transition-colors hover:shadow-sm ${sevColors[activity.severity]}`}
              >
                <div className="absolute -left-8 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg shadow-sm dark:bg-zinc-800 ring-1 ring-zinc-200 dark:ring-zinc-600">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">{activity.message}</p>
                    <div className="mt-1.5 flex items-center gap-3 text-xs text-zinc-400">
                      <span>{getSeverityIcon(activity.severity)} {activity.severity === 'error' ? '错误' : activity.severity === 'warning' ? '警告' : activity.severity === 'success' ? '成功' : '信息'}</span>
                      <span>📌 {activity.type === 'sync' ? '同步' : activity.type === 'error' ? '错误' : activity.type === 'user' ? '用户操作' : activity.type === 'config' ? '配置变更' : '系统'}</span>
                      {activity.repoName && <span>📦 {activity.repoName}</span>}
                      {activity.userName && <span>👤 {activity.userName}</span>}
                    </div>
                  </div>
                  <time className="shrink-0 text-xs text-zinc-400">{formatRelativeTime(activity.timestamp)}</time>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
          <ActivityIcon className="h-12 w-12 mb-4" />
          <p>没有匹配的活动记录</p>
        </div>
      )}

      {/* Detail Modal */}
      <Modal open={!!showDetail} onClose={() => setShowDetail(null)} title="活动详情">
        {selectedActivity && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">{getActivityIcon(selectedActivity.type)}</span>
              <Badge variant={selectedActivity.severity === 'error' ? 'error' : selectedActivity.severity === 'warning' ? 'warning' : selectedActivity.severity === 'success' ? 'success' : 'info'}>
                {selectedActivity.severity === 'error' ? '错误' : selectedActivity.severity === 'warning' ? '警告' : selectedActivity.severity === 'success' ? '成功' : '信息'}
              </Badge>
              <Badge variant="outline">
                {selectedActivity.type === 'sync' ? '同步' : selectedActivity.type === 'error' ? '错误' : selectedActivity.type === 'user' ? '用户操作' : '系统'}
              </Badge>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-zinc-700 dark:text-zinc-300">{selectedActivity.message}</p>
              {selectedActivity.repoName && (
                <div className="flex gap-2">
                  <span className="text-zinc-500">相关仓库：</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">{selectedActivity.repoName}</span>
                </div>
              )}
              {selectedActivity.userName && (
                <div className="flex gap-2">
                  <span className="text-zinc-500">操作人：</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">{selectedActivity.userName}</span>
                </div>
              )}
              <div className="flex gap-2">
                <span className="text-zinc-500">时间：</span>
                <span className="text-zinc-900 dark:text-zinc-100">{formatRelativeTime(selectedActivity.timestamp)}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}