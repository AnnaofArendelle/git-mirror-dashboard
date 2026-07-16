'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { StatusBadge } from '@/components/ui/status-badge';
import { Modal } from '@/components/ui/card';
import { mockSyncJobs } from '@/lib/data';
import type { SyncJob } from '@/lib/types';
import { formatBytes, formatDuration, formatRelativeTime } from '@/lib/utils';
import { RefreshCw, Filter, RotateCcw, XCircle, CheckCircle, AlertTriangle, ChevronDown, ChevronUp, X } from 'lucide-react';

const statusOptions = [
  { value: 'all', label: '全部状态' },
  { value: 'running', label: '运行中' },
  { value: 'success', label: '成功' },
  { value: 'failed', label: '失败' },
  { value: 'pending', label: '等待中' },
  { value: 'cancelled', label: '已取消' },
];

const triggerOptions = [
  { value: 'all', label: '全部方式' },
  { value: 'scheduled', label: '定时' },
  { value: 'manual', label: '手动' },
  { value: 'webhook', label: 'Webhook' },
  { value: 'retry', label: '重试' },
];

export default function SyncJobsPage() {
  const [jobs, setJobs] = useState(mockSyncJobs);
  const [statusFilter, setStatusFilter] = useState('all');
  const [triggerFilter, setTriggerFilter] = useState('all');
  const [showLogModal, setShowLogModal] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const filtered = jobs.filter((j) => {
    const matchStatus = statusFilter === 'all' || j.status === statusFilter;
    const matchTrigger = triggerFilter === 'all' || j.trigger === triggerFilter;
    return matchStatus && matchTrigger;
  });

  const runningCount = jobs.filter((j) => j.status === 'running').length;
  const failedCount = jobs.filter((j) => j.status === 'failed').length;

  const handleRetry = (id: string) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === id ? { ...j, status: 'running' as const, startedAt: new Date().toISOString(), retryCount: j.retryCount + 1 } : j,
      ),
    );
    // Simulate completion after 2s
    setTimeout(() => {
      setJobs((prev) =>
        prev.map((j) =>
          j.id === id && j.status === 'running'
            ? { ...j, status: 'success' as const, completedAt: new Date().toISOString(), duration: Math.floor(Math.random() * 180) + 30 }
            : j,
        ),
      );
    }, 2000);
  };

  const handleCancel = (id: string) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === id ? { ...j, status: 'cancelled' as const, completedAt: new Date().toISOString(), errorMessage: '已手动取消' } : j,
      ),
    );
  };

  const handleRetryAllFailed = () => {
    const failedIds = jobs.filter((j) => j.status === 'failed').map((j) => j.id);
    failedIds.forEach((id) => handleRetry(id));
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  const selectedJob = showLogModal ? jobs.find((j) => j.id === showLogModal) : null;

  const hasFilters = statusFilter !== 'all' || triggerFilter !== 'all';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">同步任务</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            共 {jobs.length} 条记录 · {runningCount} 个运行中 · {failedCount} 个失败
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRetryAllFailed} disabled={failedCount === 0}>
            <RotateCcw className="h-4 w-4" />重试失败 ({failedCount})
          </Button>
          <Button size="sm" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? '刷新中...' : '刷新'}
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Select options={statusOptions} value={statusFilter} onChange={setStatusFilter} className="w-28" />
          <Select options={triggerOptions} value={triggerFilter} onChange={setTriggerFilter} className="w-28" />
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={() => { setStatusFilter('all'); setTriggerFilter('all'); }}>
              <X className="h-3 w-3" />清除筛选
            </Button>
          )}
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700">
                <th className="p-4 text-left font-medium text-zinc-500 dark:text-zinc-400">仓库</th>
                <th className="p-4 text-left font-medium text-zinc-500 dark:text-zinc-400">状态</th>
                <th className="p-4 text-left font-medium text-zinc-500 dark:text-zinc-400">触发方式</th>
                <th className="p-4 text-right font-medium text-zinc-500 dark:text-zinc-400">耗时</th>
                <th className="p-4 text-right font-medium text-zinc-500 dark:text-zinc-400">推送引用</th>
                <th className="p-4 text-right font-medium text-zinc-500 dark:text-zinc-400">新提交</th>
                <th className="p-4 text-right font-medium text-zinc-500 dark:text-zinc-400">传输大小</th>
                <th className="p-4 text-left font-medium text-zinc-500 dark:text-zinc-400">时间</th>
                <th className="p-4 text-right font-medium text-zinc-500 dark:text-zinc-400">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((job) => (
                <tr key={job.id} className="border-b border-zinc-100 transition-colors hover:bg-zinc-50 dark:border-zinc-700/50 dark:hover:bg-zinc-800/50">
                  <td className="p-4 font-medium text-zinc-900 dark:text-zinc-100">{job.repoName}</td>
                  <td className="p-4"><StatusBadge status={job.status} /></td>
                  <td className="p-4 text-zinc-700 dark:text-zinc-300">
                    {job.trigger === 'scheduled' ? '⏰ 定时' : job.trigger === 'manual' ? '👆 手动' : job.trigger === 'webhook' ? '🔗 Webhook' : '🔄 重试'}
                  </td>
                  <td className="p-4 text-right text-zinc-700 dark:text-zinc-300">{formatDuration(job.duration)}</td>
                  <td className="p-4 text-right text-zinc-700 dark:text-zinc-300">{job.refsPushed || '-'}</td>
                  <td className="p-4 text-right text-zinc-700 dark:text-zinc-300">{job.newCommits || '-'}</td>
                  <td className="p-4 text-right text-zinc-700 dark:text-zinc-300">{job.sizeTransferred ? formatBytes(job.sizeTransferred) : '-'}</td>
                  <td className="p-4 text-zinc-500">{formatRelativeTime(job.startedAt)}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-1">
                      {job.status === 'failed' && (
                        <Button variant="ghost" size="sm" onClick={() => handleRetry(job.id)} title="重试">
                          <RotateCcw className="h-4 w-4 text-blue-500" />
                        </Button>
                      )}
                      {job.status === 'running' && (
                        <Button variant="ghost" size="sm" onClick={() => handleCancel(job.id)} title="取消">
                          <XCircle className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                      {(job.status === 'failed' || job.status === 'success') && (
                        <Button variant="ghost" size="sm" onClick={() => setShowLogModal(job.id)} title="查看日志">
                          <AlertTriangle className="h-4 w-4 text-zinc-400" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
          <RefreshCw className="h-12 w-12 mb-4" />
          <p>没有匹配的同步任务</p>
        </div>
      )}

      {/* Log Modal */}
      <Modal open={!!showLogModal} onClose={() => setShowLogModal(null)} title={`同步日志 - ${selectedJob?.repoName || ''}`}>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <StatusBadge status={selectedJob?.status || 'pending'} />
            <span className="text-xs text-zinc-400">重试次数: {selectedJob?.retryCount}</span>
          </div>
          {selectedJob?.errorMessage && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
              {selectedJob.errorMessage}
            </div>
          )}
          <div className="rounded-lg bg-zinc-900 p-4 font-mono text-xs text-green-400">
            {selectedJob?.logs.length ? (
              selectedJob.logs.map((line, i) => (
                <p key={i} className="leading-6">
                  <span className="text-zinc-500">[{String(i + 1).padStart(2, '0')}]</span> {line}
                </p>
              ))
            ) : (
              <p className="text-zinc-500">无日志输出</p>
            )}
          </div>
          <div className="flex justify-end">
            <Button variant="secondary" onClick={() => setShowLogModal(null)}>关闭</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}