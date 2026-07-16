'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/card';
import { mockSettings } from '@/lib/data';
import { Check, Save, RotateCcw, Clipboard, Eye, EyeOff, AlertTriangle, Download } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState(mockSettings);
  const [saved, setSaved] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setSettings(mockSettings);
    setShowResetModal(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleSetting = (key: string) => {
    setSettings({ ...settings, [key]: !(settings as any)[key] });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">系统设置</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">配置镜像站的全局参数</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowResetModal(true)}>
            <RotateCcw className="h-4 w-4" />重置
          </Button>
          <Button onClick={handleSave}>
            {saved ? <><Check className="h-4 w-4" />已保存</> : <><Save className="h-4 w-4" />保存设置</>}
          </Button>
        </div>
      </div>

      {/* Save Toast */}
      {saved && (
        <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">
          <Check className="h-5 w-5" />
          <span>设置已保存成功</span>
        </div>
      )}

      {/* Sync Settings */}
      <Card>
        <CardHeader>
          <CardTitle>同步设置</CardTitle>
          <Badge>核心</Badge>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <Input label="默认同步间隔（分钟）" id="syncInterval" type="number" value={settings.defaultSyncInterval} onChange={(e) => setSettings({ ...settings, defaultSyncInterval: +e.target.value })} />
          <Input label="最大并发同步数" id="maxSync" type="number" value={settings.maxConcurrentSyncs} onChange={(e) => setSettings({ ...settings, maxConcurrentSyncs: +e.target.value })} />
          <Input label="同步超时时间（秒）" id="timeout" type="number" value={settings.syncTimeout} onChange={(e) => setSettings({ ...settings, syncTimeout: +e.target.value })} />
          <Input label="失败重试次数" id="retry" type="number" value={settings.retryAttempts} onChange={(e) => setSettings({ ...settings, retryAttempts: +e.target.value })} />
          <Input label="重试延迟（秒）" id="retryDelay" type="number" value={settings.retryDelay} onChange={(e) => setSettings({ ...settings, retryDelay: +e.target.value })} />
          <Input label="存储配额限制" id="storageLimit" type="text" value={(settings.storageLimit / 1_000_000_000_000).toFixed(1) + ' TB'} readOnly />
        </CardContent>
      </Card>

      {/* Network Settings */}
      <Card>
        <CardHeader>
          <CardTitle>网络设置</CardTitle>
          <Badge>网络</Badge>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <Input label="代理服务器" id="proxy" type="text" value={settings.proxyUrl} onChange={(e) => setSettings({ ...settings, proxyUrl: e.target.value })} placeholder="http://proxy.internal:8080" />
          <Input label="SSH 密钥路径" id="sshKey" type="text" value={settings.sshKeyPath} onChange={(e) => setSettings({ ...settings, sshKeyPath: e.target.value })} />
          <Input label="通知邮箱" id="email" type="email" value={settings.notificationEmail} onChange={(e) => setSettings({ ...settings, notificationEmail: e.target.value })} />
          <div>
            <Input label="Webhook 密钥" id="webhookSecret" type={showSecret ? 'text' : 'password'} value={settings.webhookSecret} onChange={(e) => setSettings({ ...settings, webhookSecret: e.target.value })} />
            <button
              onClick={() => setShowSecret(!showSecret)}
              className="mt-1 flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              {showSecret ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              {showSecret ? '隐藏' : '显示'}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Feature Toggle */}
      <Card>
        <CardHeader>
          <CardTitle>功能开关</CardTitle>
          <Badge>功能</Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'enableAutoSync', label: '自动同步', desc: '按计划自动执行镜像同步' },
            { key: 'enableWebhookSync', label: 'Webhook 同步', desc: '接收上游仓库的 Webhook 推送触发同步' },
            { key: 'enableNotifications', label: '通知告警', desc: '同步失败时发送邮件通知' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between rounded-lg border border-zinc-200 p-4 dark:border-zinc-600">
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{label}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{desc}</p>
              </div>
              <button
                onClick={() => toggleSetting(key)}
                className={`relative h-6 w-11 rounded-full transition-colors ${(settings as any)[key] ? 'bg-blue-600' : 'bg-zinc-300 dark:bg-zinc-600'}`}
              >
                <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${(settings as any)[key] ? 'translate-x-5' : ''}`} />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Maintenance */}
      <Card>
        <CardHeader>
          <CardTitle>维护设置</CardTitle>
          <Badge>系统</Badge>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <Input label="日志保留天数" id="logRetention" type="number" value={settings.logRetentionDays} onChange={(e) => setSettings({ ...settings, logRetentionDays: +e.target.value })} />
          <div className="flex items-end">
            <Button variant="outline" className="w-full" onClick={() => setShowLogModal(true)}>
              <Clipboard className="h-4 w-4" />查看系统日志
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reset Modal */}
      <Modal open={showResetModal} onClose={() => setShowResetModal(false)} title="确认重置设置">
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
            <p className="text-sm text-amber-700 dark:text-amber-300">所有设置将恢复为默认值，此操作不可撤销。</p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowResetModal(false)}>取消</Button>
            <Button variant="danger" onClick={handleReset}><RotateCcw className="h-4 w-4" />确认重置</Button>
          </div>
        </div>
      </Modal>

      {/* System Log Modal */}
      <Modal open={showLogModal} onClose={() => setShowLogModal(false)} title="系统日志">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="outline">最近 100 条</Badge>
            <Button variant="ghost" size="sm"><Download className="h-4 w-4" />导出</Button>
          </div>
          <div className="rounded-lg bg-zinc-900 p-4 font-mono text-xs leading-6 text-green-400 max-h-80 overflow-y-auto">
            <p>[2026-07-16 15:00:01] INFO  Sync job started - kubernetes</p>
            <p className="text-zinc-500">[2026-07-16 14:30:00] INFO  Sync completed - linux (245s)</p>
            <p className="text-zinc-500">[2026-07-16 14:15:00] INFO  Sync completed - private-docs (8s)</p>
            <p className="text-red-400">[2026-07-16 10:45:00] ERROR Sync failed - vscode (timeout)</p>
            <p className="text-zinc-500">[2026-07-16 09:00:00] INFO  Settings updated by admin</p>
            <p className="text-zinc-500">[2026-07-16 08:02:00] ERROR Auth failed - internal-api</p>
            <p className="text-zinc-500">[2026-07-16 03:00:00] INFO  Log rotation completed</p>
            <p className="text-zinc-500">[2026-07-15 17:30:00] WARN  Sync interval changed - tailwindcss</p>
            <p className="text-zinc-500">[2026-07-15 14:20:00] INFO  SSH key added by admin</p>
            <p className="text-zinc-500">[2026-07-15 03:00:00] INFO  System health check passed</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}