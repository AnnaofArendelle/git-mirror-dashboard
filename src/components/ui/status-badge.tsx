'use client';

import { cn, getStatusColor, getStatusBg, getHealthColor, getHealthBg } from '@/lib/utils';

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium', getStatusBg(status), getStatusColor(status))}>
      <span className={cn('h-1.5 w-1.5 rounded-full', getStatusColor(status).replace('text-', 'bg-'))} />
      {status === 'syncing' ? '同步中' : status === 'active' ? '正常' : status === 'error' ? '异常' : status === 'paused' ? '已暂停' : status === 'inactive' ? '未激活' : status === 'running' ? '运行中' : status === 'success' ? '成功' : status === 'failed' ? '失败' : status === 'pending' ? '等待中' : status === 'cancelled' ? '已取消' : status}
    </span>
  );
}

export function HealthBadge({ score }: { score: number }) {
  const label = score >= 80 ? '健康' : score >= 50 ? '一般' : '较差';
  return (
    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', getHealthBg(score), getHealthColor(score))}>
      {label} ({score})
    </span>
  );
}