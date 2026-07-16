import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function formatDuration(seconds: number | null): string {
  if (seconds === null) return '--';
  if (seconds < 60) return `${Math.round(seconds)}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '--';
  const d = new Date(dateStr);
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(dateStr: string | null): string {
  if (!dateStr) return '--';
  const now = Date.now();
  const d = new Date(dateStr).getTime();
  const diff = now - d;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return '刚刚';
  if (mins < 60) return `${mins}分钟前`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}小时前`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}天前`;
  return formatDate(dateStr);
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    active: 'text-emerald-500',
    syncing: 'text-blue-500',
    error: 'text-red-500',
    paused: 'text-amber-500',
    inactive: 'text-zinc-400',
    success: 'text-emerald-500',
    running: 'text-blue-500',
    failed: 'text-red-500',
    pending: 'text-amber-500',
    cancelled: 'text-zinc-400',
  };
  return map[status] || 'text-zinc-400';
}

export function getStatusBg(status: string): string {
  const map: Record<string, string> = {
    active: 'bg-emerald-500/10',
    syncing: 'bg-blue-500/10',
    error: 'bg-red-500/10',
    paused: 'bg-amber-500/10',
    inactive: 'bg-zinc-500/10',
    success: 'bg-emerald-500/10',
    running: 'bg-blue-500/10',
    failed: 'bg-red-500/10',
    pending: 'bg-amber-500/10',
    cancelled: 'bg-zinc-500/10',
  };
  return map[status] || 'bg-zinc-500/10';
}

export function getHealthColor(score: number): string {
  if (score >= 80) return 'text-emerald-500';
  if (score >= 50) return 'text-amber-500';
  return 'text-red-500';
}

export function getHealthBg(score: number): string {
  if (score >= 80) return 'bg-emerald-500/10';
  if (score >= 50) return 'bg-amber-500/10';
  return 'bg-red-500/10';
}

export function truncate(str: string, len: number): string {
  if (str.length <= len) return str;
  return str.slice(0, len) + '...';
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getProtocolIcon(protocol: string): string {
  const map: Record<string, string> = { https: '🔒', ssh: '🔑', git: '🔗' };
  return map[protocol] || '🔗';
}

export function getSeverityIcon(severity: string): string {
  const map: Record<string, string> = {
    error: '🔴',
    warning: '🟡',
    info: '🔵',
    success: '🟢',
  };
  return map[severity] || '🔵';
}

export function getActivityIcon(type: string): string {
  const map: Record<string, string> = {
    sync: '🔄',
    error: '❌',
    user: '👤',
    config: '⚙️',
    system: '🖥️',
  };
  return map[type] || '📌';
}