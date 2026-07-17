'use client';

import { Search, Bell, ChevronDown, Moon, Sun, User, Settings, LogOut, Key, HelpCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/card';
import { GlobalSearch } from '@/components/ui/global-search';
import { getUnacknowledgedAlerts } from '@/lib/data';
import { useAuth } from '@/lib/auth-context';
import { NotificationPanel } from '@/components/layout/notification-panel';
import { useRouter } from 'next/navigation';

export function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [dark, setDark] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const alerts = getUnacknowledgedAlerts();

  useEffect(() => {
    if (dark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [dark]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    }
    if (showUserMenu) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showUserMenu]);

  const handleLogout = () => {
    logout();
    setLoggedOut(true);
    setShowLogoutModal(false);
    setShowUserMenu(false);
    setTimeout(() => setLoggedOut(false), 3000);
    router.push('/login');
  };

  const roleLabel: Record<string, string> = { admin: '管理员', operator: '操作员', viewer: '观察者' };
  const userName = user?.name || '用户';
  const userRole = user?.role || 'admin';
  const userInitial = userName.charAt(0);

  return (
    <header className="relative flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-6 dark:border-zinc-700 dark:bg-zinc-900">
      {/* Left: Search */}
      <div className="w-80">
        <GlobalSearch />
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={() => setDark(!dark)}
          className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-700"
          title={dark ? '切换亮色模式' : '切换暗色模式'}
        >
          {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-700"
            title="通知中心"
          >
            <Bell className="h-5 w-5" />
            {alerts.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {alerts.length}
              </span>
            )}
          </button>
          <NotificationPanel open={showNotifications} onClose={() => setShowNotifications(false)} />
        </div>

        {/* User Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 border-l border-zinc-200 pl-3 dark:border-zinc-600"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              {userInitial}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{userName}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{roleLabel[userRole]}</p>
            </div>
            <ChevronDown className={`h-4 w-4 text-zinc-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 top-12 z-50 w-56 rounded-xl border border-zinc-200 bg-white py-2 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
              <div className="border-b border-zinc-100 px-4 py-3 dark:border-zinc-700">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{userName}</p>
                <p className="text-xs text-zinc-500">{user?.email}</p>
              </div>
              <div className="py-1">
                <button onClick={() => { router.push('/users'); setShowUserMenu(false); }} className="flex w-full items-center gap-3 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-700">
                  <User className="h-4 w-4" />个人资料
                </button>
                <button onClick={() => { router.push('/settings'); setShowUserMenu(false); }} className="flex w-full items-center gap-3 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-700">
                  <Settings className="h-4 w-4" />账户设置
                </button>
                <button onClick={() => { router.push('/api-keys'); setShowUserMenu(false); }} className="flex w-full items-center gap-3 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-700">
                  <Key className="h-4 w-4" />API 密钥
                </button>
                <button onClick={() => { router.push('/help'); setShowUserMenu(false); }} className="flex w-full items-center gap-3 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-700">
                  <HelpCircle className="h-4 w-4" />帮助文档
                </button>
              </div>
              <div className="border-t border-zinc-100 py-1 dark:border-zinc-700">
                <button onClick={() => { setShowUserMenu(false); setShowLogoutModal(true); }} className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20">
                  <LogOut className="h-4 w-4" />退出登录
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Logout Modal */}
      <Modal open={showLogoutModal} onClose={() => setShowLogoutModal(false)} title="确认退出">
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300">确认退出登录？</p>
              <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">您将需要重新登录才能访问管理后台。</p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>取消</Button>
            <Button variant="danger" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />确认退出
            </Button>
          </div>
        </div>
      </Modal>

      {/* Logged Out Toast */}
      {loggedOut && (
        <div className="fixed right-6 top-20 z-50 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 shadow-lg dark:border-emerald-800 dark:bg-emerald-900/80">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-800">
            <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
          </div>
          <div>
            <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">已安全退出</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">欢迎再次使用 GitMirror</p>
          </div>
        </div>
      )}
    </header>
  );
}