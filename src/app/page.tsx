'use client';

import { useState } from 'react';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardHeader, CardTitle, CardContent, Modal } from '@/components/ui/card';
import { StatusBadge, HealthBadge } from '@/components/ui/status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockSystemStats, mockRepos, mockSyncChartData, getRecentSyncJobs, getRecentActivities, getUnacknowledgedAlerts } from '@/lib/data';
import { formatBytes, formatDuration, formatRelativeTime, formatNumber, getActivityIcon, getSeverityIcon } from '@/lib/utils';
import { GitBranch, Activity, HardDrive, RefreshCw, Users, TrendingUp, AlertTriangle, ArrowUpRight, ArrowRight, FileText, Clock, BarChart3, Download, X, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend } from 'recharts';

export default function DashboardPage() {
  const [stats, setStats] = useState(mockSystemStats);
  const [refreshing, setRefreshing] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showAlertDetail, setShowAlertDetail] = useState(false);
  const [showAllAlerts, setShowAllAlerts] = useState(false);

  const recentJobs = getRecentSyncJobs(5);
  const activities = getRecentActivities(6);
  const alerts = getUnacknowledgedAlerts();
  const topRepos = [...mockRepos].sort((a, b) => b.healthScore - a.healthScore).slice(0, 5);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">仪表盘</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">欢迎回来，以下是镜像站的整体运行状态</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setShowReportModal(true)}>
            <BarChart3 className="h-4 w-4" />
            运行报告
          </Button>
          <Button size="sm" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? '刷新中...' : '刷新数据'}
          </Button>
        </div>
      </div>

      {/* Alert Banner */}
      {alerts.length > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
              {alerts.length} 条未处理告警
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400">
              {alerts.map((a) => a.title).join('、')}
            </p>
          </div>
          <Button variant="ghost" size="sm" className="text-amber-700 dark:text-amber-300" onClick={() => setShowAlertDetail(true)}>
            查看详情
          </Button>
          <Button variant="ghost" size="sm" className="text-amber-700 dark:text-amber-300" onClick={() => setShowAllAlerts(true)}>
            全部标记
          </Button>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="镜像仓库"
          value={formatNumber(stats.totalRepos)}
          icon={GitBranch}
          description={`${stats.activeRepos} 个正常 · ${stats.erroredRepos} 个异常`}
          trend={{ value: 12, positive: true }}
        />
        <StatCard
          title="总存储空间"
          value={formatBytes(stats.totalStorage)}
          icon={HardDrive}
          description="已用容量"
          trend={{ value: 8, positive: false }}
        />
        <StatCard
          title="今日同步"
          value={formatNumber(stats.syncJobsToday)}
          icon={RefreshCw}
          description={`成功率 ${stats.successRate}%`}
          trend={{ value: 5, positive: true }}
        />
        <StatCard
          title="运行时间"
          value={`${stats.uptime}%`}
          icon={TrendingUp}
          description="过去 30 天"
          trend={{ value: 0.02, positive: false }}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="本月带宽"
          value={formatBytes(stats.bandwidthThisMonth)}
          icon={Activity}
          description="已使用流量"
        />
        <StatCard
          title="今日带宽"
          value={formatBytes(stats.bandwidthToday)}
          icon={Activity}
          description="今日已使用"
        />
        <StatCard
          title="活跃用户"
          value={formatNumber(stats.activeUsers)}
          icon={Users}
          description="当前在线"
        />
        <StatCard
          title="平均同步时长"
          value={formatDuration(stats.avgSyncDuration)}
          icon={Clock}
          description="最近 7 天"
          trend={{ value: 3, positive: true }}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sync Chart */}
        <Card>
          <CardHeader>
            <CardTitle>同步趋势</CardTitle>
            <Badge>最近 7 天</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockSyncChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.871 0.006 286.286)" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="oklch(0.551 0.027 286.286)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="oklch(0.551 0.027 286.286)" />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: '1px solid oklch(0.871 0.006 286.286)', background: 'white' }}
                  />
                  <Legend />
                  <Bar dataKey="success" name="成功" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="failed" name="失败" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Bandwidth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>带宽使用趋势</CardTitle>
            <Badge>GB/天</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockSyncChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.871 0.006 286.286)" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="oklch(0.551 0.027 286.286)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="oklch(0.551 0.027 286.286)" />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid oklch(0.871 0.006 286.286)', background: 'white' }} />
                  <Area type="monotone" dataKey="size" name="带宽 (GB)" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Top Repos */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>仓库健康度排行</CardTitle>
            <Link href="/repos" className="text-xs text-blue-600 hover:underline dark:text-blue-400">
              查看全部
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {topRepos.map((repo, i) => (
              <Link
                key={repo.id}
                href={`/repos/${repo.id}`}
                className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-700/50"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">{repo.name}</p>
                  <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{repo.description}</p>
                </div>
                <HealthBadge score={repo.healthScore} />
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Recent Sync Jobs */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>最近同步任务</CardTitle>
            <Link href="/sync-jobs" className="text-xs text-blue-600 hover:underline dark:text-blue-400">
              查看全部
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentJobs.map((job) => (
              <div key={job.id} className="flex items-center gap-3 rounded-lg p-2">
                <StatusBadge status={job.status} />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">{job.repoName}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {job.duration ? `${formatDuration(job.duration)} · ` : ''}
                    {job.newCommits > 0 && `${job.newCommits} 个新提交 · `}
                    {formatRelativeTime(job.startedAt)}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>最近动态</CardTitle>
            <Link href="/activity" className="text-xs text-blue-600 hover:underline dark:text-blue-400">
              查看全部
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 rounded-lg p-2">
                <span className="mt-0.5 text-base">{getActivityIcon(activity.type)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-700 dark:text-zinc-300">{activity.message}</p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">{formatRelativeTime(activity.timestamp)}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Alert Detail Modal */}
      <Modal open={!!showAlertDetail} onClose={() => setShowAlertDetail(false)} title="告警详情">
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className={`rounded-lg border-l-4 p-4 ${alert.type === 'error' ? 'border-l-red-500 bg-red-50 dark:bg-red-950/20' : alert.type === 'warning' ? 'border-l-amber-500 bg-amber-50 dark:bg-amber-950/20' : 'border-l-blue-500 bg-blue-50 dark:bg-blue-950/20'}`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{alert.title}</p>
                  <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">{alert.message}</p>
                  {alert.repoName && <p className="mt-1 text-xs text-zinc-500">相关仓库: {alert.repoName}</p>}
                </div>
                <Badge variant={alert.type === 'error' ? 'error' : alert.type === 'warning' ? 'warning' : 'info'} size="sm">
                  {alert.type === 'error' ? '错误' : alert.type === 'warning' ? '警告' : '信息'}
                </Badge>
              </div>
              <p className="mt-2 text-xs text-zinc-400">{formatRelativeTime(alert.createdAt)}</p>
            </div>
          ))}
        </div>
      </Modal>

      {/* All Alerts Acknowledged Toast */}
      <Modal open={!!showAllAlerts} onClose={() => setShowAllAlerts(false)} title="全部标记为已读">
        <div className="space-y-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">将把所有 {alerts.length} 条未处理告警标记为已读。</p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowAllAlerts(false)}>取消</Button>
            <Button onClick={() => setShowAllAlerts(false)}><CheckCircle className="h-4 w-4" />确认标记</Button>
          </div>
        </div>
      </Modal>

      {/* Report Modal */}
      <Modal open={showReportModal} onClose={() => setShowReportModal(false)} title="运行报告">
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
              <p className="text-xs text-blue-600 dark:text-blue-400">总同步次数</p>
              <p className="text-xl font-bold text-blue-700 dark:text-blue-300">{formatNumber(stats.totalSyncJobs)}</p>
            </div>
            <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-900/20">
              <p className="text-xs text-emerald-600 dark:text-emerald-400">今日成功</p>
              <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">{stats.syncJobsToday}</p>
            </div>
            <div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
              <p className="text-xs text-green-600 dark:text-green-400">成功率</p>
              <p className="text-xl font-bold text-green-700 dark:text-green-300">{stats.successRate}%</p>
            </div>
            <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
              <p className="text-xs text-amber-600 dark:text-amber-400">平均时长</p>
              <p className="text-xl font-bold text-amber-700 dark:text-amber-300">{formatDuration(stats.avgSyncDuration)}</p>
            </div>
          </div>

          {/* Stats Table */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
              <span className="text-zinc-500">总存储空间</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">{formatBytes(stats.totalStorage)}</span>
            </div>
            <div className="flex justify-between rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
              <span className="text-zinc-500">本月带宽</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">{formatBytes(stats.bandwidthThisMonth)}</span>
            </div>
            <div className="flex justify-between rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
              <span className="text-zinc-500">系统运行时间</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">{stats.uptime}%</span>
            </div>
            <div className="flex justify-between rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
              <span className="text-zinc-500">活跃用户</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">{stats.activeUsers} 人</span>
            </div>
          </div>

          {/* Download */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => window.print()}>
              <Download className="h-4 w-4" />导出 PDF
            </Button>
            <Button variant="outline" className="flex-1">
              <FileText className="h-4 w-4" />导出 CSV
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}