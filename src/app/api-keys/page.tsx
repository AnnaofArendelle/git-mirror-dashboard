'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Modal } from '@/components/ui/card';
import {
  Key,
  Plus,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  Check,
  Clock,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  X,
} from 'lucide-react';
import { formatRelativeTime, formatDate } from '@/lib/utils';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  prefix: string;
  role: 'admin' | 'operator' | 'viewer';
  status: 'active' | 'expired' | 'revoked';
  lastUsedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  createdBy: string;
}

const mockApiKeys: ApiKey[] = [
  { id: 'k1', name: 'CI/CD Pipeline', key: 'gmk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', prefix: 'gmk_xxxx', role: 'operator', status: 'active', lastUsedAt: '2026-07-16T14:30:00Z', expiresAt: '2027-07-16T00:00:00Z', createdAt: '2026-01-15T08:00:00Z', createdBy: '张三' },
  { id: 'k2', name: 'Monitoring System', key: 'gmk_yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy', prefix: 'gmk_yyyy', role: 'viewer', status: 'active', lastUsedAt: '2026-07-15T09:00:00Z', expiresAt: '2027-01-15T00:00:00Z', createdAt: '2026-02-20T10:00:00Z', createdBy: '张三' },
  { id: 'k3', name: 'Automation Script', key: 'gmk_zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz', prefix: 'gmk_zzzz', role: 'admin', status: 'active', lastUsedAt: '2026-07-10T16:00:00Z', expiresAt: null, createdAt: '2026-03-10T09:00:00Z', createdBy: '李四' },
  { id: 'k4', name: 'Deprecated Webhook', key: 'gmk_aaaa_bbbb_cccc_dddd_eeee_ffff', prefix: 'gmk_aaaa', role: 'operator', status: 'revoked', lastUsedAt: '2026-05-01T12:00:00Z', expiresAt: null, createdAt: '2025-06-01T08:00:00Z', createdBy: '王五' },
  { id: 'k5', name: 'Legacy Backup Tool', key: 'gmk_1111_2222_3333_4444_5555_6666', prefix: 'gmk_1111', role: 'viewer', status: 'expired', lastUsedAt: '2026-04-15T10:00:00Z', expiresAt: '2026-04-01T00:00:00Z', createdAt: '2025-04-01T08:00:00Z', createdBy: '系统' },
];

const roleOptions = [
  { value: 'all', label: '全部权限' },
  { value: 'admin', label: '管理员' },
  { value: 'operator', label: '操作员' },
  { value: 'viewer', label: '观察者' },
];

const statusOptions = [
  { value: 'all', label: '全部状态' },
  { value: 'active', label: '启用' },
  { value: 'expired', label: '已过期' },
  { value: 'revoked', label: '已撤销' },
];

const roleLabels: Record<string, string> = { admin: '管理员', operator: '操作员', viewer: '观察者' };

export default function ApiKeysPage() {
  const [keys, setKeys] = useState(mockApiKeys);
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState<string | null>(null);
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [showKeyDetail, setShowKeyDetail] = useState<string | null>(null);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyRole, setNewKeyRole] = useState('operator');

  const filtered = keys.filter((k) => {
    const matchRole = roleFilter === 'all' || k.role === roleFilter;
    const matchStatus = statusFilter === 'all' || k.status === statusFilter;
    return matchRole && matchStatus;
  });

  const handleCopy = (id: string, key: string) => {
    navigator.clipboard.writeText(key).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleRevoke = (id: string) => {
    setKeys((prev) => prev.map((k) => (k.id === id ? { ...k, status: 'revoked' as const } : k)));
    setShowRevokeModal(null);
  };

  const handleCreate = () => {
    if (!newKeyName.trim()) return;
    const id = 'k' + Date.now().toString(36);
    const now = new Date().toISOString();
    const fakeKey = 'gmk_' + Array.from({ length: 32 }, () => Math.random().toString(36)[2]).join('');
    setKeys((prev) => [{
      id,
      name: newKeyName.trim(),
      key: fakeKey,
      prefix: fakeKey.slice(0, 8) + '...',
      role: newKeyRole as 'admin' | 'operator' | 'viewer',
      status: 'active',
      lastUsedAt: null,
      expiresAt: new Date(Date.now() + 365 * 86400000).toISOString(),
      createdAt: now,
      createdBy: '张三',
    }, ...prev]);
    setNewKeyName('');
    setShowCreateModal(false);
    setNewlyCreatedKey(fakeKey);
    setShowNewKeyModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">API 密钥管理</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">管理用于自动化集成和第三方工具访问的 API 密钥</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4" />创建密钥
        </Button>
      </div>

      {/* Security Notice */}
      <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
        <AlertTriangle className="h-5 w-5 mt-0.5 text-blue-600 dark:text-blue-400 shrink-0" />
        <div className="text-sm text-blue-700 dark:text-blue-300">
          <p className="font-medium">安全提示</p>
          <p className="mt-1 text-xs">API 密钥拥有访问镜像服务的权限。请妥善保管，不要分享给不相关的人员。建议定期轮换密钥。</p>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Select options={statusOptions} value={statusFilter} onChange={setStatusFilter} className="w-28" label="状态" />
          <Select options={roleOptions} value={roleFilter} onChange={setRoleFilter} className="w-28" label="权限" />
        </div>
      </Card>

      <div className="space-y-3">
        {filtered.map((apiKey) => (
          <Card key={apiKey.id}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                  <Key className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{apiKey.name}</h3>
                    <Badge size="sm" variant={apiKey.status === 'active' ? 'success' : apiKey.status === 'expired' ? 'warning' : 'error'}>
                      {apiKey.status === 'active' ? '启用' : apiKey.status === 'expired' ? '已过期' : '已撤销'}
                    </Badge>
                    <Badge size="sm" variant="outline">{roleLabels[apiKey.role]}</Badge>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <code className="rounded bg-zinc-100 px-2 py-0.5 font-mono text-xs text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
                      {apiKey.prefix}
                    </code>
                    <button onClick={() => handleCopy(apiKey.id, apiKey.key)} className="rounded p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700" title="复制完整密钥">
                      {copiedId === apiKey.id ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                    <span>创建者: {apiKey.createdBy}</span>
                    <span>创建时间: {formatDate(apiKey.createdAt)}</span>
                    {apiKey.lastUsedAt && <span>最近使用: {formatRelativeTime(apiKey.lastUsedAt)}</span>}
                    {apiKey.expiresAt && <span>过期时间: {formatDate(apiKey.expiresAt)}</span>}
                    {!apiKey.expiresAt && <span>永不过期</span>}
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => setShowKeyDetail(apiKey.id)} title="查看详情">
                  <Eye className="h-4 w-4 text-zinc-500" />
                </Button>
                {apiKey.status === 'active' && (
                  <Button variant="ghost" size="sm" onClick={() => setShowRevokeModal(apiKey.id)} title="撤销密钥">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
          <Key className="h-12 w-12 mb-4" />
          <p>没有匹配的 API 密钥</p>
        </div>
      )}

      {/* Create Key Modal */}
      <Modal open={showCreateModal} onClose={() => setShowCreateModal(false)} title="创建 API 密钥">
        <div className="space-y-4">
          <Input label="密钥名称 *" id="keyName" type="text" value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)} placeholder="例: CI/CD Pipeline" />
          <Select label="权限级别" options={[{ value: 'operator', label: '操作员' }, { value: 'admin', label: '管理员' }, { value: 'viewer', label: '观察者' }]} value={newKeyRole} onChange={setNewKeyRole} />
          <div className="rounded-lg bg-amber-50 p-3 text-xs text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
            创建后将<strong>仅一次</strong>显示完整密钥，请立即复制保存。
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>取消</Button>
            <Button onClick={handleCreate} disabled={!newKeyName.trim()}>
              <Plus className="h-4 w-4" />创建密钥
            </Button>
          </div>
        </div>
      </Modal>

      {/* Show New Key Modal */}
      <Modal open={showNewKeyModal} onClose={() => setShowNewKeyModal(false)} title="密钥已创建">
        <div className="space-y-4">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">✓ 密钥创建成功</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">您的密钥（仅显示一次）</label>
            <div className="mt-1 flex gap-2">
              <input
                type="text"
                readOnly
                value={newlyCreatedKey || ''}
                className="flex-1 rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 font-mono text-sm dark:border-zinc-600 dark:bg-zinc-800"
              />
              <Button variant="secondary" size="sm" onClick={() => { navigator.clipboard.writeText(newlyCreatedKey || ''); setCopiedId('new_key'); setTimeout(() => setCopiedId(null), 2000); }}>
                {copiedId === 'new_key' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => { setShowNewKeyModal(false); setNewlyCreatedKey(null); }}>我已保存</Button>
          </div>
        </div>
      </Modal>

      {/* Key Detail Modal */}
      <Modal open={!!showKeyDetail} onClose={() => setShowKeyDetail(null)} title="密钥详情">
        {keys.find(k => k.id === showKeyDetail) && (() => {
          const detail = keys.find(k => k.id === showKeyDetail)!;
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                  <p className="text-xs text-zinc-500">名称</p>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">{detail.name}</p>
                </div>
                <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                  <p className="text-xs text-zinc-500">权限</p>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">{roleLabels[detail.role]}</p>
                </div>
                <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                  <p className="text-xs text-zinc-500">状态</p>
                  <p className="font-medium">{detail.status === 'active' ? '🟢 启用' : detail.status === 'expired' ? '🟡 已过期' : '🔴 已撤销'}</p>
                </div>
                <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                  <p className="text-xs text-zinc-500">创建者</p>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">{detail.createdBy}</p>
                </div>
                <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                  <p className="text-xs text-zinc-500">创建时间</p>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">{formatDate(detail.createdAt)}</p>
                </div>
                {detail.lastUsedAt && (
                  <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                    <p className="text-xs text-zinc-500">最近使用</p>
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">{formatRelativeTime(detail.lastUsedAt)}</p>
                  </div>
                )}
                {detail.expiresAt && (
                  <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                    <p className="text-xs text-zinc-500">过期时间</p>
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">{formatDate(detail.expiresAt)}</p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">密钥前缀</label>
                <code className="mt-1 block rounded-lg bg-zinc-100 px-3 py-2 font-mono text-sm dark:bg-zinc-700">{detail.prefix}</code>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* Revoke Modal */}
      <Modal open={!!showRevokeModal} onClose={() => setShowRevokeModal(null)} title="确认撤销密钥">
        <div className="space-y-4">
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
            <p className="text-sm text-red-700 dark:text-red-300">撤销后，使用该密钥的集成服务将立即停止工作。此操作不可撤销。</p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowRevokeModal(null)}>取消</Button>
            <Button variant="danger" onClick={() => showRevokeModal && handleRevoke(showRevokeModal)}>
              <Trash2 className="h-4 w-4" />确认撤销
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}