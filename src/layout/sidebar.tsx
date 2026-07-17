'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  GitBranch,
  Activity,
  RefreshCw,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  GitFork,
  Bell,
  Megaphone,
  Key,
  HelpCircle,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { useAnnouncements } from '@/lib/store';
import { getUnacknowledgedAlerts } from '@/lib/data';

const navItems = [
  { href: '/', label: '仪表盘', icon: LayoutDashboard },
  { href: '/repos', label: '镜像仓库', icon: GitBranch },
  { href: '/sync-jobs', label: '同步任务', icon: RefreshCw },
  { href: '/activity', label: '活动日志', icon: Activity },
  { href: '/users', label: '用户管理', icon: Users },
  { href: '/settings', label: '系统设置', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { announcements } = useAnnouncements();
  const [unreadAlerts] = useState(getUnacknowledgedAlerts);
  const draftAnnouncements = announcements.filter((a) => a.status === 'draft');

  return (
    <aside className={cn(
      'flex flex-col border-r border-zinc-200 bg-white transition-all duration-200 dark:border-zinc-700 dark:bg-zinc-900',
      collapsed ? 'w-16' : 'w-60',
    )}>
      {/* Logo */}
      <div className={cn('flex h-16 items-center border-b border-zinc-200 px-4 dark:border-zinc-700', collapsed ? 'justify-center' : 'gap-3')}>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
          <GitFork className="h-4 w-4 text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">GitMirror</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">镜像管理平台</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100',
                collapsed && 'justify-center px-2',
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && item.href === '/' && <Badge size="sm">{12}</Badge>}
            </Link>
          );
        })}

        {/* Separator */}
        {!collapsed && <div className="my-2 border-t border-zinc-200 dark:border-zinc-700" />}

        {/* API Keys Link */}
        <Link
          href="/api-keys"
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
            pathname === '/api-keys'
              ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
              : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100',
            collapsed && 'justify-center px-2',
          )}
        >
          <Key className="h-5 w-5 shrink-0" />
          {!collapsed && <span>API 密钥</span>}
        </Link>

        {/* Announcements Link */}
        <Link
          href="/announcements"
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
            pathname === '/announcements'
              ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
              : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100',
            collapsed && 'justify-center px-2',
          )}
        >
          <Megaphone className="h-5 w-5 shrink-0" />
          {!collapsed && <span>公告管理</span>}
          {!collapsed && draftAnnouncements.length > 0 && (
            <Badge variant="warning" size="sm">{draftAnnouncements.length} 草稿</Badge>
          )}
        </Link>

        {/* Help Link */}
        <Link
          href="/help"
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
            pathname === '/help'
              ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
              : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100',
            collapsed && 'justify-center px-2',
          )}
        >
          <HelpCircle className="h-5 w-5 shrink-0" />
          {!collapsed && <span>帮助文档</span>}
        </Link>
      </nav>

      {/* System Status */}
      {!collapsed && (
        <div className="border-t border-zinc-200 p-4 dark:border-zinc-700">
          <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 dark:bg-emerald-900/20">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">系统运行正常</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-zinc-400">
            <Bell className="h-3 w-3" />
            <span>{unreadAlerts.length} 条未读通知</span>
          </div>
        </div>
      )}

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex h-10 items-center justify-center border-t border-zinc-200 text-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </aside>
  );
}