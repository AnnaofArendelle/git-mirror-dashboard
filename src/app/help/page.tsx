'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  HelpCircle,
  Search,
  BookOpen,
  Terminal,
  Key,
  GitBranch,
  RefreshCw,
  Webhook,
  Shield,
  Users,
  Settings,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  MessageCircle,
  Mail,
  FileText,
} from 'lucide-react';
import Link from 'next/link';

interface FaqItem {
  q: string;
  a: string;
  category: string;
}

const faqs: FaqItem[] = [
  { category: '入门指南', q: '什么是 Git 镜像站？', a: 'Git 镜像站是上游 Git 仓库的本地缓存副本。通过定期同步，可以在本地网络提供更快的代码拉取速度，减少对外部网络的依赖，并提供统一的仓库管理入口。' },
  { category: '入门指南', q: '如何添加一个新的镜像仓库？', a: '进入「镜像仓库」页面，点击右上角的「添加仓库」按钮，填写仓库名称、上游仓库地址（HTTPS 或 SSH），选择协议和同步间隔后提交即可。系统会自动开始首次同步。' },
  { category: '入门指南', q: '为什么我的镜像同步失败了？', a: '常见原因包括：1）上游仓库地址不可访问；2）SSH 密钥过期或未配置；3）网络连接超时；4）存储空间不足。可以在同步任务的日志中查看具体错误信息。' },
  { category: '同步配置', q: '同步间隔可以设置多长？', a: '最小同步间隔为 30 分钟，最大为 7 天（10080 分钟）。建议根据上游仓库的更新频率合理设置，过于频繁的同步会增加服务器负载。' },
  { category: '同步配置', q: '支持哪些同步协议？', a: '支持 HTTPS、SSH 和 Git 协议。HTTPS 适用于公开仓库，SSH 适用于需要认证的仓库。建议对私有仓库使用 SSH 协议并配置部署密钥。' },
  { category: '同步配置', q: '什么是 Webhook 同步？', a: 'Webhook 同步是上游仓库在代码推送时主动通知镜像站进行同步的方式。相比定时同步，Webhook 同步延迟更低，通常在提交后几秒内完成同步。需要在代码托管平台配置相应的 Webhook URL。' },
  { category: '权限管理', q: '角色之间有什么区别？', a: '管理员拥有所有操作权限，包括系统设置和用户管理；操作员可以管理仓库和触发同步；观察者只能查看仓库状态和同步记录，不能执行修改操作。' },
  { category: '权限管理', q: '如何创建和撤销 API 密钥？', a: '在「API 密钥管理」页面可以创建新的 API 密钥。创建时需指定名称和权限级别。密钥创建后仅显示一次，请立即复制保存。如需撤销，在密钥列表中点击撤销按钮即可。' },
  { category: '权限管理', q: 'API 密钥有哪些权限级别？', a: 'API 密钥分为三个级别：管理员（所有操作权限）、操作员（仓库管理和同步操作）、观察者（只读查询操作）。请根据需要分配最小必要权限。' },
  { category: '存储管理', q: '镜像数据占用多少存储空间？', a: '存储用量取决于上游仓库的大小。您可以在仪表盘查看总存储使用情况。当存储使用率达到配额 80% 时会触发预警通知，请联系管理员申请扩容。' },
  { category: '存储管理', q: '如何清理旧的镜像数据？', a: '系统会自动管理历史数据，定期清理过期的同步记录和临时文件。如需手动清理特定仓库的数据，请联系运维团队处理。' },
  { category: '故障排除', q: '同步任务卡在「运行中」状态怎么办？', a: '可以手动取消该同步任务然后重试。如果问题持续，请检查网络连接和上游仓库的可访问性。长时间卡住通常是由于网络不稳定或上游仓库响应缓慢。' },
  { category: '故障排除', q: '收到「SSH 认证失败」错误如何处理？', a: '首先检查 SSH 密钥是否已过期或损坏。在系统设置中查看当前配置的密钥路径。如需更新，需要重新生成密钥对并将公钥添加到上游代码托管平台。' },
  { category: '故障排除', q: 'Webhook 同步不触发怎么办？', a: '请检查：1）Webhook 配置是否正确（URL 和密钥）；2）上游仓库是否已启用 Webhook；3）网络是否可达；4）Webhook 密钥是否与配置匹配。可以在 Webhook 设置页面重新测试连接。' },
];

const categories = ['全部', '入门指南', '同步配置', '权限管理', '存储管理', '故障排除'];

export default function HelpPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('全部');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const filtered = faqs.filter((faq) => {
    const matchCategory = activeCategory === '全部' || faq.category === activeCategory;
    const matchSearch = faq.q.includes(search) || faq.a.includes(search);
    return matchCategory && matchSearch;
  });

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">帮助文档</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">常见问题和使用指南</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          placeholder="搜索帮助内容..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-12 pr-4 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/api-keys">
          <Card className="h-full transition-colors hover:border-blue-200 dark:hover:border-blue-700 cursor-pointer">
            <div className="flex flex-col items-center text-center gap-2 py-4">
              <Key className="h-8 w-8 text-amber-500" />
              <h3 className="font-medium text-zinc-900 dark:text-zinc-100">API 密钥</h3>
              <p className="text-xs text-zinc-500">管理 API 访问凭证</p>
            </div>
          </Card>
        </Link>
        <Link href="/settings">
          <Card className="h-full transition-colors hover:border-blue-200 dark:hover:border-blue-700 cursor-pointer">
            <div className="flex flex-col items-center text-center gap-2 py-4">
              <Settings className="h-8 w-8 text-blue-500" />
              <h3 className="font-medium text-zinc-900 dark:text-zinc-100">系统设置</h3>
              <p className="text-xs text-zinc-500">配置全局参数</p>
            </div>
          </Card>
        </Link>
        <Link href="mailto:support@company.com">
          <Card className="h-full transition-colors hover:border-blue-200 dark:hover:border-blue-700 cursor-pointer">
            <div className="flex flex-col items-center text-center gap-2 py-4">
              <Mail className="h-8 w-8 text-red-500" />
              <h3 className="font-medium text-zinc-900 dark:text-zinc-100">联系支持</h3>
              <p className="text-xs text-zinc-500">support@company.com</p>
            </div>
          </Card>
        </Link>
      </div>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>常见问题</CardTitle>
          <Badge variant="outline">{filtered.length} 条</Badge>
        </CardHeader>
        <CardContent className="space-y-1">
          {filtered.map((faq, i) => {
            const isExpanded = expandedIndex === i;
            return (
              <div key={i} className="rounded-lg border border-zinc-200 dark:border-zinc-600 overflow-hidden last:mb-0">
                <button
                  onClick={() => setExpandedIndex(isExpanded ? null : i)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-700/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                      Q
                    </span>
                    <div>
                      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{faq.q}</span>
                      <Badge variant="outline" size="sm" className="ml-2">{faq.category}</Badge>
                    </div>
                  </div>
                  {isExpanded ? <ChevronDown className="h-4 w-4 text-zinc-400" /> : <ChevronRight className="h-4 w-4 text-zinc-400" />}
                </button>
                {isExpanded && (
                  <div className="border-t border-zinc-200 px-4 py-3 dark:border-zinc-600">
                    <div className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                        A
                      </span>
                      <p className="text-sm text-zinc-600 leading-relaxed dark:text-zinc-400">{faq.a}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
          <HelpCircle className="h-12 w-12 mb-4" />
          <p>未找到匹配的帮助内容</p>
          <Button variant="ghost" className="mt-2" onClick={() => { setSearch(''); setActiveCategory('全部'); }}>清除搜索</Button>
        </div>
      )}

      {/* Contact Section */}
      <Card>
        <CardHeader>
          <CardTitle>需要更多帮助？</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-start gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-600">
              <MessageCircle className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">在线咨询</p>
                <p className="text-xs text-zinc-500 mt-1">工作时间 9:00-18:00</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-600">
              <Mail className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">发送邮件</p>
                <p className="text-xs text-zinc-500 mt-1">ops@company.com</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-600">
              <FileText className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">提交工单</p>
                <p className="text-xs text-zinc-500 mt-1">预计 2 小时内回复</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}