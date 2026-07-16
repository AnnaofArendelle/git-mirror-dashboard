'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { StatusBadge, HealthBadge } from '@/components/ui/status-badge';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/card';
import { mockRepos } from '@/lib/data';
import { formatBytes, formatRelativeTime, formatNumber, getProtocolIcon } from '@/lib/utils';
import { GitBranch, Search, Plus, Filter, ArrowUpDown, Globe, Lock, FileText, ChevronDown, ChevronUp, X } from 'lucide-react';
import Link from 'next/link';

const statusOptions = [
  { value: 'all', label: '全部状态' },
  { value: 'active', label: '正常' },
  { value: 'syncing', label: '同步中' },
  { value: 'error', label: '异常' },
  { value: 'paused', label: '已暂停' },
];

const langOptions = [
  { value: 'all', label: '全部语言' },
  { value: 'TypeScript', label: 'TypeScript' },
  { value: 'Rust', label: 'Rust' },
  { value: 'Python', label: 'Python' },
  { value: 'Go', label: 'Go' },
  { value: 'C', label: 'C' },
  { value: 'C++', label: 'C++' },
  { value: 'Nix', label: 'Nix' },
  { value: 'Markdown', label: 'Markdown' },
];

const visibilityOptions = [
  { value: 'all', label: '全部可见性' },
  { value: 'public', label: '公开' },
  { value: 'internal', label: '内部' },
  { value: 'private', label: '私有' },
];

const sortOptions = [
  { value: 'name', label: '按名称' },
  { value: 'health', label: '按健康度' },
  { value: 'stars', label: '按 Star 数' },
  { value: 'size', label: '按大小' },
  { value: 'updated', label: '按更新时间' },
];

export default function ReposPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [langFilter, setLangFilter] = useState('all');
  const [visibilityFilter, setVisibilityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRepoUrl, setNewRepoUrl] = useState('');
  const [newRepoName, setNewRepoName] = useState('');

  let filtered = mockRepos.filter((r) => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchLang = langFilter === 'all' || r.language === langFilter;
    const matchVisibility = visibilityFilter === 'all' || r.visibility === visibilityFilter;
    return matchSearch && matchStatus && matchLang && matchVisibility;
  });

  filtered = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'health': return b.healthScore - a.healthScore;
      case 'stars': return b.starCount - a.starCount;
      case 'size': return b.sizeInBytes - a.sizeInBytes;
      case 'updated': return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      default: return a.name.localeCompare(b.name);
    }
  });

  const totalStorage = mockRepos.reduce((s, r) => s + r.sizeInBytes, 0);
  const hasActiveFilters = statusFilter !== 'all' || langFilter !== 'all' || visibilityFilter !== 'all';

  const clearFilters = () => {
    setStatusFilter('all');
    setLangFilter('all');
    setVisibilityFilter('all');
    setSortBy('name');
    setSearch('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">镜像仓库</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">共 {mockRepos.length} 个仓库，已用 {formatBytes(totalStorage)}</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4" />添加仓库
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="搜索仓库名称或描述..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>
          <Select options={statusOptions} value={statusFilter} onChange={setStatusFilter} className="w-28" />
          <Select options={langOptions} value={langFilter} onChange={setLangFilter} className="w-32" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMoreFilters(!showMoreFilters)}
          >
            <Filter className="h-4 w-4" />
            更多筛选
            {showMoreFilters ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" className="text-red-500" onClick={clearFilters}>
              <X className="h-3 w-3" />清除筛选
            </Button>
          )}
        </div>

        {/* Expanded Filters */}
        {showMoreFilters && (
          <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-700">
            <Select options={visibilityOptions} value={visibilityFilter} onChange={setVisibilityFilter} label="可见性" />
            <Select options={sortOptions} value={sortBy} onChange={setSortBy} label="排序方式" />
            <div className="text-xs text-zinc-400 ml-auto">
              {filtered.length} 个结果
            </div>
          </div>
        )}
      </Card>

      {/* Repo List */}
      <div className="space-y-3">
        {filtered.map((repo) => (
          <Link key={repo.id} href={`/repos/${repo.id}`}>
            <Card className="transition-colors hover:border-blue-200 dark:hover:border-blue-700">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-700">
                  <GitBranch className="h-6 w-6 text-zinc-600 dark:text-zinc-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{repo.name}</h3>
                    <StatusBadge status={repo.status} />
                    <HealthBadge score={repo.healthScore} />
                    {repo.visibility === 'private' && <Lock className="h-3.5 w-3.5 text-amber-500" />}
                    {repo.visibility === 'public' && <Globe className="h-3.5 w-3.5 text-emerald-500" />}
                  </div>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 line-clamp-1">{repo.description}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-zinc-400 dark:text-zinc-500">
                    <span>{getProtocolIcon(repo.protocol)} {repo.protocol.toUpperCase()}</span>
                    <span>⭐ {formatNumber(repo.starCount)}</span>
                    <span>🍴 {formatNumber(repo.forkCount)}</span>
                    <span>📦 {formatBytes(repo.sizeInBytes)}</span>
                    <span>🔄 {repo.syncInterval}分钟同步</span>
                    <span>上次同步: {formatRelativeTime(repo.lastSyncAt)}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <Badge variant="outline" size="sm">{repo.language}</Badge>
                    {repo.tags.map((tag) => (
                      <Badge key={tag} variant="default" size="sm">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
          <FileText className="h-12 w-12 mb-4" />
          <p>没有匹配的仓库</p>
          {hasActiveFilters && (
            <Button variant="ghost" className="mt-2" onClick={clearFilters}>清除筛选条件</Button>
          )}
        </div>
      )}

      {/* Add Repo Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="添加镜像仓库">
        <div className="space-y-4">
          <Input label="镜像名称" id="name" type="text" value={newRepoName} onChange={(e) => setNewRepoName(e.target.value)} placeholder="例: my-repo" />
          <Input label="上游仓库地址" id="url" type="text" value={newRepoUrl} onChange={(e) => setNewRepoUrl(e.target.value)} placeholder="https://github.com/user/repo.git" />
          <Select label="协议" options={[{ value: 'https', label: 'HTTPS' }, { value: 'ssh', label: 'SSH' }, { value: 'git', label: 'Git' }]} value="https" onChange={() => {}} />
          <Select label="同步间隔" options={[{ value: '60', label: '每 60 分钟' }, { value: '120', label: '每 120 分钟' }, { value: '360', label: '每 6 小时' }, { value: '1440', label: '每 24 小时' }]} value="120" onChange={() => {}} />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>取消</Button>
            <Button onClick={() => setShowAddModal(false)} disabled={!newRepoName || !newRepoUrl}>
              <Plus className="h-4 w-4" />确认添加
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}