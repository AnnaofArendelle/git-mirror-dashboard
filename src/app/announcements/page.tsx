'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { useAnnouncements } from '@/lib/store';
import { formatRelativeTime, formatDate } from '@/lib/utils';
import { Megaphone, Plus, Pin, Edit3, Archive, Trash2, Search, FileText, Send } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const statusOptions = [
  { value: 'all', label: '全部状态' },
  { value: 'published', label: '已发布' },
  { value: 'draft', label: '草稿' },
  { value: 'archived', label: '归档' },
];

const priorityOptions = [
  { value: 'all', label: '全部优先级' },
  { value: 'high', label: '高优先级' },
  { value: 'normal', label: '普通' },
  { value: 'low', label: '低优先级' },
];

export default function AnnouncementsPage() {
  const router = useRouter();
  const { announcements, dispatch } = useAnnouncements();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [showPublishModal, setShowPublishModal] = useState<string | null>(null);

  const filtered = announcements.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.content.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchPriority = priorityFilter === 'all' || a.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  const handleDelete = (id: string) => {
    dispatch({ type: 'DELETE', payload: id });
    setShowDeleteModal(null);
  };

  const handlePublish = (id: string) => {
    dispatch({ type: 'PUBLISH', payload: id });
    setShowPublishModal(null);
  };

  const handleArchive = (id: string) => {
    dispatch({ type: 'ARCHIVE', payload: id });
  };

  const handleTogglePin = (id: string) => {
    dispatch({ type: 'TOGGLE_PIN', payload: id });
  };

  const sorted = [...filtered].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const priorityColors: Record<string, 'error' | 'warning' | 'info' | 'default'> = {
    high: 'error',
    normal: 'default',
    low: 'info',
  };
  const priorityLabels: Record<string, string> = { high: '高', normal: '普通', low: '低' };
  const statusLabels: Record<string, string> = { published: '已发布', draft: '草稿', archived: '归档' };
  const statusVariants: Record<string, 'success' | 'warning' | 'outline'> = {
    published: 'success',
    draft: 'warning',
    archived: 'outline',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">公告管理</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            共 {announcements.length} 条公告 · {announcements.filter((a) => a.status === 'published').length} 条已发布 · {announcements.filter((a) => a.status === 'draft').length} 条草稿
          </p>
        </div>
        <Link href="/announcements/new">
          <Button>
            <Plus className="h-4 w-4" />发布公告
          </Button>
        </Link>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="搜索公告标题或内容..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>
          <Select options={statusOptions} value={statusFilter} onChange={setStatusFilter} className="w-28" />
          <Select options={priorityOptions} value={priorityFilter} onChange={setPriorityFilter} className="w-32" />
        </div>
      </Card>

      <div className="space-y-3">
        {sorted.map((ann) => (
          <Card key={ann.id} className={`transition-colors hover:border-blue-200 dark:hover:border-blue-700 ${ann.pinned ? 'border-amber-200 dark:border-amber-700' : ''}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {ann.pinned && <Pin className="h-4 w-4 text-amber-500" />}
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{ann.title}</h3>
                  <Badge variant={priorityColors[ann.priority]} size="sm">{priorityLabels[ann.priority]}</Badge>
                  <Badge variant={statusVariants[ann.status]} size="sm">{statusLabels[ann.status]}</Badge>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">{ann.content.replace(/[#*`\[\]]/g, '').slice(0, 200)}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                  <span>✍️ {ann.author}</span>
                  <span>📅 {formatDate(ann.createdAt)}</span>
                  {ann.publishedAt && <span>📢 {formatRelativeTime(ann.publishedAt)}</span>}
                  <span>👁️ {ann.readCount} 次阅读</span>
                  {ann.tags.map((tag) => (
                    <Badge key={tag} variant="outline" size="sm">{tag}</Badge>
                  ))}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                {ann.status === 'draft' && (
                  <Button variant="ghost" size="sm" onClick={() => setShowPublishModal(ann.id)} title="发布">
                    <Send className="h-4 w-4 text-emerald-500" />
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => handleTogglePin(ann.id)} title={ann.pinned ? '取消置顶' : '置顶'}>
                  <Pin className={`h-4 w-4 ${ann.pinned ? 'text-amber-500' : 'text-zinc-400'}`} />
                </Button>
                <Link href={`/announcements/${ann.id}/edit`}>
                  <Button variant="ghost" size="sm" title="编辑">
                    <Edit3 className="h-4 w-4 text-zinc-500" />
                  </Button>
                </Link>
                {ann.status === 'published' && (
                  <Button variant="ghost" size="sm" onClick={() => handleArchive(ann.id)} title="归档">
                    <Archive className="h-4 w-4 text-zinc-500" />
                  </Button>
                )}
                <Button variant="ghost" size="sm" title="删除" onClick={() => setShowDeleteModal(ann.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {sorted.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
          <FileText className="h-12 w-12 mb-4" />
          <p>没有匹配的公告</p>
        </div>
      )}

      {/* Publish Confirm Modal */}
      <Modal open={!!showPublishModal} onClose={() => setShowPublishModal(null)} title="确认发布公告">
        <div className="space-y-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">发布后将对所有用户可见，确认现在发布吗？</p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowPublishModal(null)}>取消</Button>
            <Button onClick={() => showPublishModal && handlePublish(showPublishModal)}>
              <Send className="h-4 w-4" />确认发布
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal open={!!showDeleteModal} onClose={() => setShowDeleteModal(null)} title="确认删除公告">
        <div className="space-y-4">
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
            <p className="text-sm text-red-700 dark:text-red-300">此操作将永久删除该公告，不可恢复。</p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowDeleteModal(null)}>取消</Button>
            <Button variant="danger" onClick={() => showDeleteModal && handleDelete(showDeleteModal)}>
              <Trash2 className="h-4 w-4" />确认删除
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}