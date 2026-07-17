'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, GitBranch, Users, RefreshCw, FileText, X, ArrowRight } from 'lucide-react';
import { mockRepos, mockUsers, mockSyncJobs } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { formatRelativeTime, formatBytes, formatNumber } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface SearchResult {
  type: 'repo' | 'user' | 'sync-job';
  id: string;
  title: string;
  subtitle: string;
  href: string;
  icon: React.ReactNode;
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const results: SearchResult[] = [];

  if (query.trim()) {
    const q = query.toLowerCase();

    // Search repos
    mockRepos
      .filter((r) => r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.language.toLowerCase().includes(q))
      .slice(0, 5)
      .forEach((r) => {
        results.push({
          type: 'repo',
          id: `repo-${r.id}`,
          title: r.name,
          subtitle: `${r.description} · ${formatBytes(r.sizeInBytes)} · ⭐ ${formatNumber(r.starCount)}`,
          href: `/repos/${r.id}`,
          icon: <GitBranch className="h-4 w-4 text-blue-500" />,
        });
      });

    // Search users
    mockUsers
      .filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
      .slice(0, 3)
      .forEach((u) => {
        results.push({
          type: 'user',
          id: `user-${u.id}`,
          title: u.name,
          subtitle: `${u.email} · ${u.role === 'admin' ? '管理员' : u.role === 'operator' ? '操作员' : '观察者'}`,
          href: `/users`,
          icon: <Users className="h-4 w-4 text-emerald-500" />,
        });
      });

    // Search sync jobs
    mockSyncJobs
      .filter((j) => j.repoName.toLowerCase().includes(q))
      .slice(0, 3)
      .forEach((j) => {
        results.push({
          type: 'sync-job',
          id: `sync-${j.id}`,
          title: j.repoName,
          subtitle: `${j.status === 'success' ? '✅ 成功' : j.status === 'failed' ? '❌ 失败' : j.status === 'running' ? '🔄 运行中' : '⏳ 等待中'} · ${j.startedAt ? formatRelativeTime(j.startedAt) : '--'}`,
          href: `/sync-jobs`,
          icon: <RefreshCw className="h-4 w-4 text-amber-500" />,
        });
      });
  }

  const navigate = useCallback((href: string) => {
    setOpen(false);
    router.push(href);
  }, [router]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      navigate(results[selectedIndex].href);
    }
  };

  return (
    <>
      {/* Search trigger button in header */}
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm text-zinc-400 transition-colors hover:border-zinc-300 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-500 dark:hover:border-zinc-500"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="flex-1 text-left">搜索仓库、用户或任务...</span>
        <kbd className="hidden rounded border border-zinc-300 bg-white px-1.5 py-0.5 text-[10px] font-medium text-zinc-400 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-500 sm:inline-block">
          ⌘K
        </kbd>
      </button>

      {/* Search modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative z-10 w-full max-w-xl rounded-xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-800">
            {/* Input */}
            <div className="flex items-center gap-3 border-b border-zinc-200 px-4 dark:border-zinc-700">
              <Search className="h-5 w-5 shrink-0 text-zinc-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                onKeyDown={handleKeyDown}
                placeholder="搜索仓库、用户或任务..."
                className="flex-1 bg-transparent py-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none dark:text-zinc-100"
              />
              <button onClick={() => setOpen(false)} className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Results */}
            {query.trim() && (
              <div className="max-h-80 overflow-y-auto p-2">
                {results.length === 0 ? (
                  <div className="flex flex-col items-center py-10 text-zinc-400">
                    <FileText className="h-8 w-8 mb-2" />
                    <p className="text-sm">未找到 "{query}" 相关结果</p>
                  </div>
                ) : (
                  <div>
                    {['repo', 'user', 'sync-job'].map((type) => {
                      const group = results.filter((r) => r.type === type);
                      if (group.length === 0) return null;
                      const labels: Record<string, string> = { repo: '仓库', user: '用户', 'sync-job': '同步任务' };
                      return (
                        <div key={type}>
                          <p className="px-3 py-2 text-xs font-medium text-zinc-400 dark:text-zinc-500">
                            {labels[type]}
                          </p>
                          {group.map((r, i) => {
                            const globalIndex = results.indexOf(r);
                            return (
                              <button
                                key={r.id}
                                onClick={() => navigate(r.href)}
                                onMouseEnter={() => setSelectedIndex(globalIndex)}
                                className={cn(
                                  'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
                                  selectedIndex === globalIndex
                                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                                    : 'text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-700/50',
                                )}
                              >
                                {r.icon}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{r.title}</p>
                                  <p className="text-xs text-zinc-400 truncate">{r.subtitle}</p>
                                </div>
                                <ArrowRight className="h-4 w-4 shrink-0 text-zinc-300 dark:text-zinc-600" />
                              </button>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Empty state */}
            {!query.trim() && (
              <div className="flex flex-col items-center py-10 text-zinc-400">
                <Search className="h-10 w-10 mb-3" />
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">输入关键词开始搜索</p>
                <p className="text-xs mt-1">支持搜索仓库名称、用户、同步任务</p>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center gap-4 border-t border-zinc-200 px-4 py-3 text-xs text-zinc-400 dark:border-zinc-700">
              <span className="flex items-center gap-1"><kbd className="rounded border border-zinc-300 bg-zinc-50 px-1 py-0.5 font-mono dark:border-zinc-600 dark:bg-zinc-700">↑↓</kbd> 导航</span>
              <span className="flex items-center gap-1"><kbd className="rounded border border-zinc-300 bg-zinc-50 px-1 py-0.5 font-mono dark:border-zinc-600 dark:bg-zinc-700">↵</kbd> 选择</span>
              <span className="flex items-center gap-1"><kbd className="rounded border border-zinc-300 bg-zinc-50 px-1 py-0.5 font-mono dark:border-zinc-600 dark:bg-zinc-700">Esc</kbd> 关闭</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
