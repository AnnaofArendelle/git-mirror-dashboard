'use client';

import { use } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge, HealthBadge } from '@/components/ui/status-badge';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { getRepoById, getSyncJobsForRepo, getWebhooksForRepo } from '@/lib/data';
import { formatBytes, formatDuration, formatRelativeTime, formatDate, formatNumber, getProtocolIcon } from '@/lib/utils';
import { ChevronLeft, GitBranch, RefreshCw, Globe, Lock, Clock, Play, Trash2, ExternalLink, Settings, Activity, Webhook as WebhookIcon, Plus, X, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function RepoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const repo = getRepoById(id);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [showSyncPlanModal, setShowSyncPlanModal] = useState(false);
  const [syncInterval, setSyncInterval] = useState(repo?.syncInterval.toString() || '120');
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncDone, setSyncDone] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookEvents, setWebhookEvents] = useState(['push']);

  if (!repo) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <GitBranch className="h-16 w-16 text-zinc-300 mb-4" />
        <h2 className="text-xl font-semibold text-zinc-700 dark:text-zinc-300">仓库未找到</h2>
        <p className="mt-2 text-sm text-zinc-500">ID: {id}</p>
        <Link href="/repos" className="mt-4">
          <Button variant="outline"><ChevronLeft className="h-4 w-4" />返回仓库列表</Button>
        </Link>
      </div>
    );
  }

  const syncJobs = getSyncJobsForRepo(repo.id);
  const webhooks = getWebhooksForRepo(repo.id);

  const handleSync = () => {
    setSyncLoading(true);
    setShowSyncModal(false);
    setTimeout(() => {
      setSyncLoading(false);
      setSyncDone(true);
      setTimeout(() => setSyncDone(false), 3000);
    }, 2000);
  };

  const handleConfigSave = () => {
    setShowConfigModal(false);
  };

  const handleAddWebhook = () => {
    if (!webhookUrl.trim()) return;
    setShowWebhookModal(false);
    setWebhookUrl('');
  };

  const handleSaveSyncPlan = () => {
    setShowSyncPlanModal(false);
  };

  const handleOpenInBrowser = () => {
    window.open(repo.upstreamUrl, '_blank');
  };

  const handleViewSyncHistory = () => {
    window.location.href = '/sync-jobs';
  };

  return (
    <div className="space-y-6">
      {syncLoading && (
        <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
          <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
          <span className="text-sm text-blue-700 dark:text-blue-300">正在同步 {repo.name}...</span>
        </div>
      )}
      {syncDone && (
        <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
          <CheckCircle className="h-5 w-5 text-emerald-600" />
          <span className="text-sm text-emerald-700 dark:text-emerald-300">{repo.name} 同步完成！</span>
        </div>
      )}
      {deleted && (
        <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
          <CheckCircle className="h-5 w-5 text-emerald-600" />
          <span className="text-sm text-emerald-700 dark:text-emerald-300">仓库已删除，正在返回列表...</span>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
        <Link href="/repos" className="hover:text-zinc-700 dark:hover:text-zinc-300">仓库列表</Link>
        <span>/</span>
        <span className="text-zinc-900 dark:text-zinc-100">{repo.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
            <GitBranch className="h-7 w-7 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{repo.name}</h1>
              <StatusBadge status={repo.status} />
              <HealthBadge score={repo.healthScore} />
            </div>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{repo.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setShowSyncModal(true)} disabled={syncLoading}>
            <RefreshCw className={`h-4 w-4 ${syncLoading ? 'animate-spin' : ''}`} />立即同步
          </Button>
          <Button variant="outline" onClick={() => setShowConfigModal(true)}>
            <Settings className="h-4 w-4" />配置
          </Button>
          <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
            <Trash2 className="h-4 w-4" />删除
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>仓库信息</CardTitle></CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              {[
                ['上游地址', repo.upstreamUrl],
                ['镜像地址', repo.mirrorUrl],
                ['协议', getProtocolIcon(repo.protocol) + ' ' + repo.protocol.toUpperCase()],
                ['可见性', repo.visibility === 'public' ? '🌐 公开' : repo.visibility === 'private' ? '🔒 私有' : '🏢 内部'],
                ['语言', repo.language],
                ['许可证', repo.license],
                ['所有者', repo.owner],
                ['默认分支', repo.defaultBranch],
                ['Star', formatNumber(repo.starCount)],
                ['Fork', formatNumber(repo.forkCount)],
                ['大小', formatBytes(repo.sizeInBytes)],
                ['同步间隔', `每 ${repo.syncInterval} 分钟`],
                ['创建时间', formatDate(repo.createdAt)],
                ['更新时间', formatDate(repo.updatedAt)],
                ['上次同步', formatRelativeTime(repo.lastSyncAt)],
                ['同步耗时', formatDuration(repo.lastSyncDuration)],
              ].map(([label, value]) => (
                <div key={label} className="flex flex-col gap-0.5 rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                  <dt className="text-xs text-zinc-500 dark:text-zinc-400">{label}</dt>
                  <dd className="font-medium text-zinc-900 dark:text-zinc-100 truncate">{value}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        {/* Tags & Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>标签</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-1.5">
              {repo.tags.map((tag) => (
                <Badge key={tag} variant="default">{tag}</Badge>
              ))}
            </CardContent>
          </Card>

          {/* Webhooks */}
          <Card>
            <CardHeader>
              <CardTitle>Webhooks</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowWebhookModal(true)}>
                <Plus className="h-3.5 w-3.5" />添加
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {webhooks.length === 0 && (
                <p className="text-sm text-zinc-400">暂无 webhook 配置</p>
              )}
              {webhooks.map((wh) => (
                <div key={wh.id} className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-600">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{wh.url}</span>
                    <Badge variant={wh.enabled ? 'success' : 'default'} size="sm">{wh.enabled ? '启用' : '禁用'}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-zinc-400">事件: {wh.events.join(', ')}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>快速操作</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Button variant="secondary" className="w-full justify-start" onClick={handleOpenInBrowser}>
                <ExternalLink className="h-4 w-4" />在浏览器中打开
              </Button>
              <Button variant="secondary" className="w-full justify-start" onClick={handleViewSyncHistory}>
                <Activity className="h-4 w-4" />查看同步历史
              </Button>
              <Button variant="secondary" className="w-full justify-start" onClick={() => setShowSyncPlanModal(true)}>
                <Clock className="h-4 w-4" />修改同步计划
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sync History */}
      <Card>
        <CardHeader>
          <CardTitle>同步历史</CardTitle>
          <Link href="/sync-jobs" className="text-xs text-blue-600 hover:underline">查看全部</Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-700">
                  <th className="pb-3 text-left font-medium text-zinc-500 dark:text-zinc-400">状态</th>
                  <th className="pb-3 text-left font-medium text-zinc-500 dark:text-zinc-400">触发方式</th>
                  <th className="pb-3 text-left font-medium text-zinc-500 dark:text-zinc-400">耗时</th>
                  <th className="pb-3 text-right font-medium text-zinc-500 dark:text-zinc-400">新提交</th>
                  <th className="pb-3 text-right font-medium text-zinc-500 dark:text-zinc-400">传输大小</th>
                  <th className="pb-3 text-right font-medium text-zinc-500 dark:text-zinc-400">时间</th>
                </tr>
              </thead>
              <tbody>
                {syncJobs.map((job) => (
                  <tr key={job.id} className="border-b border-zinc-100 dark:border-zinc-700/50">
                    <td className="py-3"><StatusBadge status={job.status} /></td>
                    <td className="py-3 text-zinc-700 dark:text-zinc-300">
                      {job.trigger === 'scheduled' ? '定时' : job.trigger === 'manual' ? '手动' : job.trigger === 'webhook' ? 'Webhook' : '重试'}
                    </td>
                    <td className="py-3 text-zinc-700 dark:text-zinc-300">{formatDuration(job.duration)}</td>
                    <td className="py-3 text-right text-zinc-700 dark:text-zinc-300">{job.newCommits || '-'}</td>
                    <td className="py-3 text-right text-zinc-700 dark:text-zinc-300">{job.sizeTransferred ? formatBytes(job.sizeTransferred) : '-'}</td>
                    <td className="py-3 text-right text-zinc-500">{formatRelativeTime(job.startedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Sync Modal */}
      <Modal open={showSyncModal} onClose={() => setShowSyncModal(false)} title="确认立即同步">
        <div className="space-y-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            即将触发 <strong className="text-zinc-900 dark:text-zinc-100">{repo.name}</strong> 的镜像同步任务，将从上游仓库拉取最新代码。
          </p>
          <div className="rounded-lg bg-zinc-50 p-3 text-sm dark:bg-zinc-800/50">
            <p><strong>上游地址：</strong>{repo.upstreamUrl}</p>
            <p><strong>镜像地址：</strong>{repo.mirrorUrl}</p>
            <p><strong>同步策略：</strong>增量同步</p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowSyncModal(false)}>取消</Button>
            <Button onClick={handleSync}><RefreshCw className="h-4 w-4" />确认同步</Button>
          </div>
        </div>
      </Modal>

      {/* Config Modal */}
      <Modal open={showConfigModal} onClose={() => setShowConfigModal(false)} title="仓库配置">
        <div className="space-y-4">
          <Input label="仓库名称" id="name" type="text" defaultValue={repo.name} />
          <Input label="上游地址" id="url" type="text" defaultValue={repo.upstreamUrl} />
          <Select label="协议" options={[{ value: 'https', label: 'HTTPS' }, { value: 'ssh', label: 'SSH' }, { value: 'git', label: 'Git' }]} value={repo.protocol} onChange={() => {}} />
          <Select label="可见性" options={[{ value: 'public', label: '公开' }, { value: 'internal', label: '内部' }, { value: 'private', label: '私有' }]} value={repo.visibility} onChange={() => {}} />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowConfigModal(false)}>取消</Button>
            <Button onClick={handleConfigSave}><CheckCircle className="h-4 w-4" />保存配置</Button>
          </div>
        </div>
      </Modal>

      {/* Webhook Add Modal */}
      <Modal open={showWebhookModal} onClose={() => setShowWebhookModal(false)} title="添加 Webhook">
        <div className="space-y-4">
          <Input label="Webhook URL" id="whUrl" type="text" value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} placeholder="https://..." />
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">触发事件</label>
            <div className="mt-1 space-y-2">
              {['push', 'ping', 'tag_push', 'merge_request'].map((evt) => (
                <label key={evt} className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                  <input type="checkbox" checked={webhookEvents.includes(evt)} onChange={() => {
                    setWebhookEvents((prev) => prev.includes(evt) ? prev.filter((e) => e !== evt) : [...prev, evt]);
                  }} className="rounded border-zinc-300" />
                  {evt === 'push' ? '推送' : evt === 'ping' ? 'Ping' : evt === 'tag_push' ? '标签推送' : '合并请求'}
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowWebhookModal(false)}>取消</Button>
            <Button onClick={handleAddWebhook} disabled={!webhookUrl.trim()}>
              <Plus className="h-4 w-4" />确认添加
            </Button>
          </div>
        </div>
      </Modal>

      {/* Sync Plan Modal */}
      <Modal open={showSyncPlanModal} onClose={() => setShowSyncPlanModal(false)} title="修改同步计划">
        <div className="space-y-4">
          <Select label="同步间隔" options={[
            { value: '30', label: '每 30 分钟' },
            { value: '60', label: '每 1 小时' },
            { value: '120', label: '每 2 小时' },
            { value: '360', label: '每 6 小时' },
            { value: '720', label: '每 12 小时' },
            { value: '1440', label: '每 24 小时' },
          ]} value={syncInterval} onChange={setSyncInterval} />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowSyncPlanModal(false)}>取消</Button>
            <Button onClick={handleSaveSyncPlan}><CheckCircle className="h-4 w-4" />确认修改</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="确认删除仓库">
        <div className="space-y-4">
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
            <p className="text-sm text-red-700 dark:text-red-300">
              此操作将删除 <strong>{repo.name}</strong> 的镜像数据，包括所有缓存文件和历史记录。此操作不可撤销！
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>取消</Button>
            <Button variant="danger" onClick={() => { setShowDeleteModal(false); setDeleted(true); setTimeout(() => { window.location.href = '/repos'; }, 1500); }}>
              <Trash2 className="h-4 w-4" />确认删除
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}