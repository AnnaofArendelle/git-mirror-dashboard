'use client';

import { useState, useEffect, use } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useAnnouncements, useAnnouncement } from '@/lib/store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Send, Save, Eye, X } from 'lucide-react';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';

const priorityOptions = [
  { value: 'normal', label: '普通' },
  { value: 'high', label: '高优先级' },
  { value: 'low', label: '低优先级' },
];

export default function EditAnnouncementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { dispatch } = useAnnouncements();
  const existing = useAnnouncement(id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState('normal');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Load existing data
  useEffect(() => {
    if (existing) {
      setTitle(existing.title);
      setContent(existing.content);
      setPriority(existing.priority);
      setTags(existing.tags);
    }
  }, [existing]);

  if (!existing) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <p className="text-xl text-zinc-500">公告未找到</p>
        <Link href="/announcements" className="mt-4">
          <Button variant="outline"><ChevronLeft className="h-4 w-4" />返回公告列表</Button>
        </Link>
      </div>
    );
  }

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSave = (newStatus: 'published' | 'draft') => {
    if (!title.trim()) return;
    setSaving(true);
    const now = new Date().toISOString();
    dispatch({
      type: 'UPDATE',
      payload: {
        ...existing,
        title: title.trim(),
        content: content.trim(),
        priority: priority as 'high' | 'normal' | 'low',
        tags,
        status: newStatus,
        updatedAt: now,
        publishedAt: newStatus === 'published' ? (existing.publishedAt || now) : existing.publishedAt,
      },
    });
    setSuccess(true);
    setTimeout(() => router.push('/announcements'), 800);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
        <Link href="/announcements" className="hover:text-zinc-700 dark:hover:text-zinc-300">公告管理</Link>
        <span>/</span>
        <span className="text-zinc-900 dark:text-zinc-100">编辑公告</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/announcements">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="h-4 w-4" />返回
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">编辑公告</h1>
          <span className="text-xs text-zinc-400">ID: {id}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => handleSave('draft')} disabled={!title.trim() || saving}>
            <Save className="h-4 w-4" />保存草稿
          </Button>
          <Button onClick={() => handleSave('published')} disabled={!title.trim() || !content.trim() || saving}>
            {saving ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                保存中...
              </span>
            ) : (
              <><Send className="h-4 w-4" />{existing.status === 'draft' ? '发布' : '更新'}</>
            )}
          </Button>
        </div>
      </div>

      {success && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">
          ✓ 保存成功！正在跳转...
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>公告内容</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Input
            label="公告标题 *"
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="输入公告标题..."
          />

          <Select
            label="优先级"
            options={priorityOptions}
            value={priority}
            onChange={setPriority}
          />

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">标签</label>
            <div className="mt-1 flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="输入标签后回车"
                className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
              />
              <Button variant="secondary" size="sm" onClick={addTag}>添加</Button>
            </div>
            {tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-red-500">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">公告内容 *</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={16}
              placeholder="输入公告内容..."
              className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 font-mono"
            />
          </div>

          {content && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Eye className="h-4 w-4 text-zinc-400" />
                <span className="text-sm font-medium text-zinc-500">预览</span>
              </div>
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-600 dark:bg-zinc-800/50">
                <MarkdownRenderer content={content} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}