'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Modal } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { mockUsers } from '@/lib/data';
import type { User, UserRole } from '@/lib/types';
import { formatRelativeTime, getInitials } from '@/lib/utils';
import { Users, Plus, Shield, User as UserIcon, Ban, Key, CheckCircle, Filter, Mail, X, AlertTriangle } from 'lucide-react';

const roleOptions = [
  { value: 'all', label: '全部角色' },
  { value: 'admin', label: '管理员' },
  { value: 'operator', label: '操作员' },
  { value: 'viewer', label: '观察者' },
];

const roleLabels: Record<UserRole, string> = { admin: '管理员', operator: '操作员', viewer: '观察者' };
const roleColors: Record<UserRole, string> = { admin: 'error', operator: 'warning', viewer: 'info' };

export default function UsersPage() {
  const [users, setUsers] = useState(mockUsers);
  const [roleFilter, setRoleFilter] = useState('all');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState<string | null>(null);
  const [showPermModal, setShowPermModal] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('operator');
  const [inviteDone, setInviteDone] = useState(false);

  const filtered = users.filter((u) => roleFilter === 'all' || u.role === roleFilter);

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    setInviteDone(true);
    setTimeout(() => {
      setInviteDone(false);
      setShowInviteModal(false);
      setInviteEmail('');
    }, 1500);
  };

  const handleToggleDisable = (id: string) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: u.status === 'active' ? 'disabled' as const : 'active' as const } : u)));
  };

  const selectedUser = showProfileModal ? users.find((u) => u.id === showProfileModal) : null;
  const permUser = showPermModal ? users.find((u) => u.id === showPermModal) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">用户管理</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{users.length} 个用户 · {users.filter((u) => u.status === 'active').length} 个活跃 · {users.filter((u) => u.status === 'disabled').length} 个已禁用</p>
        </div>
        <Button onClick={() => setShowInviteModal(true)}>
          <Plus className="h-4 w-4" />邀请用户
        </Button>
      </div>

      <Card className="p-4">
        <Select options={roleOptions} value={roleFilter} onChange={setRoleFilter} className="w-36" />
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((user) => (
          <Card key={user.id} className="transition-colors hover:border-blue-200 dark:hover:border-blue-700">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                {getInitials(user.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{user.name}</h3>
                  <Badge variant={roleColors[user.role] as 'error' | 'warning' | 'info'} size="sm">
                    {roleLabels[user.role]}
                  </Badge>
                  {user.status === 'disabled' && (
                    <Badge variant="error" size="sm">已禁用</Badge>
                  )}
                </div>
                <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">{user.email}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Key className="h-3 w-3" />
                    {user.apiKeys} 个 API 密钥
                  </span>
                  <span className="flex items-center gap-1">
                    {user.mfaEnabled ? <CheckCircle className="h-3 w-3 text-emerald-500" /> : <Ban className="h-3 w-3 text-zinc-300" />}
                    {user.mfaEnabled ? 'MFA 已启用' : 'MFA 未启用'}
                  </span>
                  <span>上次登录: {formatRelativeTime(user.lastLoginAt)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex shrink-0 gap-1">
                <Button variant="ghost" size="sm" onClick={() => setShowPermModal(user.id)} title="权限管理">
                  <Shield className="h-4 w-4 text-zinc-500" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowProfileModal(user.id)} title="查看资料">
                  <UserIcon className="h-4 w-4 text-zinc-500" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleToggleDisable(user.id)} title={user.status === 'active' ? '禁用用户' : '启用用户'}>
                  {user.status === 'active' ? <Ban className="h-4 w-4 text-amber-500" /> : <CheckCircle className="h-4 w-4 text-emerald-500" />}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
          <Users className="h-12 w-12 mb-4" />
          <p>没有匹配的用户</p>
        </div>
      )}

      {/* Invite Modal */}
      <Modal open={showInviteModal} onClose={() => setShowInviteModal(false)} title="邀请新用户">
        <div className="space-y-4">
          {inviteDone && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20">
              ✓ 邀请已发送至 {inviteEmail}
            </div>
          )}
          <Input label="邮箱地址 *" id="email" type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="user@company.com" />
          <Select label="角色" options={[{ value: 'operator', label: '操作员' }, { value: 'viewer', label: '观察者' }, { value: 'admin', label: '管理员' }]} value={inviteRole} onChange={setInviteRole} />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowInviteModal(false)}>取消</Button>
            <Button onClick={handleInvite} disabled={!inviteEmail.trim() || inviteDone}>
              {inviteDone ? '发送中...' : <><Mail className="h-4 w-4" />发送邀请</>}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Profile Modal */}
      <Modal open={!!showProfileModal} onClose={() => setShowProfileModal(null)} title="用户资料">
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                {getInitials(selectedUser.name)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{selectedUser.name}</h3>
                <p className="text-sm text-zinc-500">{selectedUser.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                <p className="text-xs text-zinc-500">角色</p>
                <p className="font-medium text-zinc-900 dark:text-zinc-100">{roleLabels[selectedUser.role]}</p>
              </div>
              <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                <p className="text-xs text-zinc-500">状态</p>
                <p className="font-medium">{selectedUser.status === 'active' ? '🟢 正常' : '🔴 已禁用'}</p>
              </div>
              <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                <p className="text-xs text-zinc-500">API 密钥</p>
                <p className="font-medium text-zinc-900 dark:text-zinc-100">{selectedUser.apiKeys} 个</p>
              </div>
              <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                <p className="text-xs text-zinc-500">MFA</p>
                <p className="font-medium">{selectedUser.mfaEnabled ? '✅ 已启用' : '❌ 未启用'}</p>
              </div>
              <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                <p className="text-xs text-zinc-500">上次登录</p>
                <p className="font-medium text-zinc-900 dark:text-zinc-100">{formatRelativeTime(selectedUser.lastLoginAt)}</p>
              </div>
              <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                <p className="text-xs text-zinc-500">创建时间</p>
                <p className="font-medium text-zinc-900 dark:text-zinc-100">{selectedUser.createdAt}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Permissions Modal */}
      <Modal open={!!showPermModal} onClose={() => setShowPermModal(null)} title="权限管理">
        {permUser && (
          <div className="space-y-4">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              管理 <strong className="text-zinc-900 dark:text-zinc-100">{permUser.name}</strong> 的权限
            </p>
            <div className="space-y-3">
              {([
                { role: 'admin' as UserRole, label: '管理员', desc: '完全访问权限，包括系统设置和用户管理' },
                { role: 'operator' as UserRole, label: '操作员', desc: '仓库管理和同步操作，无法修改系统设置' },
                { role: 'viewer' as UserRole, label: '观察者', desc: '只读权限，只能查看状态和记录' },
              ]).map(({ role, label, desc }) => (
                <label key={role} className={`flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-colors ${permUser.role === role ? 'border-blue-300 bg-blue-50 dark:border-blue-600 dark:bg-blue-900/20' : 'border-zinc-200 hover:bg-zinc-50 dark:border-zinc-600 dark:hover:bg-zinc-700/50'}`}>
                  <input type="radio" name="role" value={role} checked={permUser.role === role} onChange={() => {
                    setUsers((prev) => prev.map((u) => (u.id === permUser.id ? { ...u, role } : u)));
                  }} className="mt-1" />
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{label}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}