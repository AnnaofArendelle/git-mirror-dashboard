// ============================================================
// Mock Data for Git Mirror Dashboard
// ============================================================
import type {
  MirrorRepo,
  SyncJob,
  User,
  SystemStats,
  SyncChartPoint,
  Activity,
  Alert,
  Announcement,
  GlobalSettings,
  Webhook,
} from './types';

// --- Repos ---
export const mockRepos: MirrorRepo[] = [
  {
    id: '1',
    name: 'linux',
    description: 'Linux kernel source tree',
    upstreamUrl: 'https://github.com/torvalds/linux.git',
    mirrorUrl: 'https://git.mirror.internal/linux',
    protocol: 'https',
    status: 'active',
    visibility: 'public',
    language: 'C',
    license: 'GPL-2.0',
    owner: 'torvalds',
    defaultBranch: 'master',
    starCount: 185_000,
    forkCount: 54_000,
    sizeInBytes: 3_800_000_000,
    lastSyncAt: '2026-07-16T14:30:00Z',
    lastSyncDuration: 245,
    nextSyncAt: '2026-07-16T16:30:00Z',
    syncInterval: 120,
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2026-07-16T14:30:00Z',
    tags: ['kernel', 'os', 'c'],
    healthScore: 98,
  },
  {
    id: '2',
    name: 'react',
    description: 'The library for web and native user interfaces',
    upstreamUrl: 'https://github.com/facebook/react.git',
    mirrorUrl: 'https://git.mirror.internal/react',
    protocol: 'https',
    status: 'active',
    visibility: 'public',
    language: 'TypeScript',
    license: 'MIT',
    owner: 'facebook',
    defaultBranch: 'main',
    starCount: 230_000,
    forkCount: 47_000,
    sizeInBytes: 520_000_000,
    lastSyncAt: '2026-07-16T13:15:00Z',
    lastSyncDuration: 82,
    nextSyncAt: '2026-07-16T15:15:00Z',
    syncInterval: 120,
    createdAt: '2024-02-20T09:00:00Z',
    updatedAt: '2026-07-16T13:15:00Z',
    tags: ['frontend', 'ui', 'javascript'],
    healthScore: 95,
  },
  {
    id: '3',
    name: 'rust',
    description: 'Empowering everyone to build reliable and efficient software.',
    upstreamUrl: 'https://github.com/rust-lang/rust.git',
    mirrorUrl: 'https://git.mirror.internal/rust',
    protocol: 'https',
    status: 'active',
    visibility: 'public',
    language: 'Rust',
    license: 'MIT',
    owner: 'rust-lang',
    defaultBranch: 'master',
    starCount: 100_000,
    forkCount: 22_000,
    sizeInBytes: 1_200_000_000,
    lastSyncAt: '2026-07-16T12:00:00Z',
    lastSyncDuration: 310,
    nextSyncAt: '2026-07-16T14:00:00Z',
    syncInterval: 120,
    createdAt: '2024-03-10T10:00:00Z',
    updatedAt: '2026-07-16T12:00:00Z',
    tags: ['language', 'compiler', 'systems'],
    healthScore: 92,
  },
  {
    id: '4',
    name: 'vscode',
    description: 'Visual Studio Code - Open Source IDE',
    upstreamUrl: 'https://github.com/microsoft/vscode.git',
    mirrorUrl: 'https://git.mirror.internal/vscode',
    protocol: 'https',
    status: 'error',
    visibility: 'public',
    language: 'TypeScript',
    license: 'MIT',
    owner: 'microsoft',
    defaultBranch: 'main',
    starCount: 165_000,
    forkCount: 29_000,
    sizeInBytes: 980_000_000,
    lastSyncAt: '2026-07-16T10:45:00Z',
    lastSyncDuration: 0,
    nextSyncAt: '2026-07-16T12:45:00Z',
    syncInterval: 120,
    createdAt: '2024-04-05T11:00:00Z',
    updatedAt: '2026-07-16T10:45:00Z',
    tags: ['ide', 'editor', 'typescript'],
    healthScore: 45,
  },
  {
    id: '5',
    name: 'kubernetes',
    description: 'Production-Grade Container Scheduling and Management',
    upstreamUrl: 'https://github.com/kubernetes/kubernetes.git',
    mirrorUrl: 'https://git.mirror.internal/kubernetes',
    protocol: 'ssh',
    status: 'syncing',
    visibility: 'public',
    language: 'Go',
    license: 'Apache-2.0',
    owner: 'kubernetes',
    defaultBranch: 'master',
    starCount: 112_000,
    forkCount: 40_000,
    sizeInBytes: 2_100_000_000,
    lastSyncAt: '2026-07-16T11:00:00Z',
    lastSyncDuration: 420,
    nextSyncAt: null,
    syncInterval: 60,
    createdAt: '2024-05-18T08:30:00Z',
    updatedAt: '2026-07-16T11:00:00Z',
    tags: ['cloud', 'containers', 'go'],
    healthScore: 72,
  },
  {
    id: '6',
    name: 'next.js',
    description: 'The React Framework for Production',
    upstreamUrl: 'https://github.com/vercel/next.js.git',
    mirrorUrl: 'https://git.mirror.internal/nextjs',
    protocol: 'https',
    status: 'active',
    visibility: 'public',
    language: 'TypeScript',
    license: 'MIT',
    owner: 'vercel',
    defaultBranch: 'canary',
    starCount: 128_000,
    forkCount: 27_000,
    sizeInBytes: 680_000_000,
    lastSyncAt: '2026-07-16T14:00:00Z',
    lastSyncDuration: 95,
    nextSyncAt: '2026-07-16T16:00:00Z',
    syncInterval: 120,
    createdAt: '2024-06-01T10:00:00Z',
    updatedAt: '2026-07-16T14:00:00Z',
    tags: ['frontend', 'react', 'framework'],
    healthScore: 97,
  },
  {
    id: '7',
    name: 'tensorflow',
    description: 'An Open Source Machine Learning Framework for Everyone',
    upstreamUrl: 'https://github.com/tensorflow/tensorflow.git',
    mirrorUrl: 'https://git.mirror.internal/tensorflow',
    protocol: 'https',
    status: 'paused',
    visibility: 'public',
    language: 'Python',
    license: 'Apache-2.0',
    owner: 'tensorflow',
    defaultBranch: 'master',
    starCount: 188_000,
    forkCount: 74_000,
    sizeInBytes: 4_500_000_000,
    lastSyncAt: '2026-07-14T09:00:00Z',
    lastSyncDuration: 580,
    nextSyncAt: null,
    syncInterval: 1440,
    createdAt: '2024-07-12T07:00:00Z',
    updatedAt: '2026-07-14T09:00:00Z',
    tags: ['ml', 'python', 'ai'],
    healthScore: 60,
  },
  {
    id: '8',
    name: 'tailwindcss',
    description: 'A utility-first CSS framework for rapid UI development.',
    upstreamUrl: 'https://github.com/tailwindlabs/tailwindcss.git',
    mirrorUrl: 'https://git.mirror.internal/tailwindcss',
    protocol: 'https',
    status: 'active',
    visibility: 'public',
    language: 'TypeScript',
    license: 'MIT',
    owner: 'tailwindlabs',
    defaultBranch: 'next',
    starCount: 85_000,
    forkCount: 4_300,
    sizeInBytes: 95_000_000,
    lastSyncAt: '2026-07-16T13:45:00Z',
    lastSyncDuration: 28,
    nextSyncAt: '2026-07-16T15:45:00Z',
    syncInterval: 120,
    createdAt: '2024-08-20T12:00:00Z',
    updatedAt: '2026-07-16T13:45:00Z',
    tags: ['css', 'design', 'frontend'],
    healthScore: 99,
  },
  {
    id: '9',
    name: 'private-docs',
    description: 'Internal documentation repository',
    upstreamUrl: 'git@github.internal:team/docs.git',
    mirrorUrl: 'https://git.mirror.internal/private-docs',
    protocol: 'ssh',
    status: 'active',
    visibility: 'private',
    language: 'Markdown',
    license: 'Internal',
    owner: 'team',
    defaultBranch: 'main',
    starCount: 12,
    forkCount: 3,
    sizeInBytes: 15_000_000,
    lastSyncAt: '2026-07-16T14:15:00Z',
    lastSyncDuration: 8,
    nextSyncAt: '2026-07-16T16:15:00Z',
    syncInterval: 120,
    createdAt: '2024-09-01T09:00:00Z',
    updatedAt: '2026-07-16T14:15:00Z',
    tags: ['docs', 'internal'],
    healthScore: 100,
  },
  {
    id: '10',
    name: 'llama.cpp',
    description: 'LLM inference in C/C++',
    upstreamUrl: 'https://github.com/ggml-ai/llama.cpp.git',
    mirrorUrl: 'https://git.mirror.internal/llama.cpp',
    protocol: 'https',
    status: 'active',
    visibility: 'public',
    language: 'C++',
    license: 'MIT',
    owner: 'ggml-ai',
    defaultBranch: 'master',
    starCount: 72_000,
    forkCount: 10_000,
    sizeInBytes: 2_800_000_000,
    lastSyncAt: '2026-07-16T12:30:00Z',
    lastSyncDuration: 195,
    nextSyncAt: '2026-07-16T14:30:00Z',
    syncInterval: 120,
    createdAt: '2024-10-05T14:00:00Z',
    updatedAt: '2026-07-16T12:30:00Z',
    tags: ['ml', 'llm', 'c++'],
    healthScore: 91,
  },
  {
    id: '11',
    name: 'internal-api',
    description: 'Internal microservices API gateway',
    upstreamUrl: 'git@git.internal:platform/api-gateway.git',
    mirrorUrl: 'https://git.mirror.internal/internal-api',
    protocol: 'ssh',
    status: 'error',
    visibility: 'internal',
    language: 'Go',
    license: 'Internal',
    owner: 'platform-team',
    defaultBranch: 'main',
    starCount: 45,
    forkCount: 8,
    sizeInBytes: 180_000_000,
    lastSyncAt: '2026-07-16T08:00:00Z',
    lastSyncDuration: 0,
    nextSyncAt: '2026-07-16T10:00:00Z',
    syncInterval: 120,
    createdAt: '2024-11-01T08:00:00Z',
    updatedAt: '2026-07-16T08:00:00Z',
    tags: ['go', 'api', 'internal'],
    healthScore: 22,
  },
  {
    id: '12',
    name: 'nixpkgs',
    description: 'Nix Packages collection',
    upstreamUrl: 'https://github.com/NixOS/nixpkgs.git',
    mirrorUrl: 'https://git.mirror.internal/nixpkgs',
    protocol: 'https',
    status: 'syncing',
    visibility: 'public',
    language: 'Nix',
    license: 'MIT',
    owner: 'NixOS',
    defaultBranch: 'master',
    starCount: 18_000,
    forkCount: 14_000,
    sizeInBytes: 6_200_000_000,
    lastSyncAt: '2026-07-16T13:00:00Z',
    lastSyncDuration: 680,
    nextSyncAt: null,
    syncInterval: 360,
    createdAt: '2024-12-01T10:00:00Z',
    updatedAt: '2026-07-16T13:00:00Z',
    tags: ['nix', 'packages', 'linux'],
    healthScore: 78,
  },
];

// --- Sync Jobs ---
export const mockSyncJobs: SyncJob[] = [
  {
    id: 's1', repoId: '1', repoName: 'linux', status: 'success', trigger: 'scheduled',
    startedAt: '2026-07-16T14:28:00Z', completedAt: '2026-07-16T14:30:00Z',
    duration: 120, refsPushed: 8, newCommits: 145, sizeTransferred: 89_000_000,
    errorMessage: null, retryCount: 0, logs: ['Fetching upstream...', 'Compressing objects...', 'Transfer complete.'],
  },
  {
    id: 's2', repoId: '5', repoName: 'kubernetes', status: 'running', trigger: 'manual',
    startedAt: '2026-07-16T15:00:00Z', completedAt: null,
    duration: null, refsPushed: 0, newCommits: 0, sizeTransferred: 0,
    errorMessage: null, retryCount: 0, logs: ['Fetching upstream...', 'Receiving objects: 45%'],
  },
  {
    id: 's3', repoId: '4', repoName: 'vscode', status: 'failed', trigger: 'scheduled',
    startedAt: '2026-07-16T10:43:00Z', completedAt: '2026-07-16T10:45:00Z',
    duration: 120, refsPushed: 0, newCommits: 0, sizeTransferred: 0,
    errorMessage: 'Connection timeout after 120s - upstream unreachable',
    retryCount: 3, logs: ['Fetching upstream...', 'Error: connection timed out'],
  },
  {
    id: 's4', repoId: '7', repoName: 'tensorflow', status: 'pending', trigger: 'scheduled',
    startedAt: null, completedAt: null,
    duration: null, refsPushed: 0, newCommits: 0, sizeTransferred: 0,
    errorMessage: null, retryCount: 0, logs: [],
  },
  {
    id: 's5', repoId: '2', repoName: 'react', status: 'success', trigger: 'scheduled',
    startedAt: '2026-07-16T13:13:00Z', completedAt: '2026-07-16T13:15:00Z',
    duration: 120, refsPushed: 6, newCommits: 89, sizeTransferred: 34_000_000,
    errorMessage: null, retryCount: 0, logs: ['Fetching upstream...', 'Compressing objects...', 'Transfer complete.'],
  },
  {
    id: 's6', repoId: '11', repoName: 'internal-api', status: 'failed', trigger: 'scheduled',
    startedAt: '2026-07-16T08:00:00Z', completedAt: '2026-07-16T08:02:00Z',
    duration: 120, refsPushed: 0, newCommits: 0, sizeTransferred: 0,
    errorMessage: 'Authentication failed - SSH key expired',
    retryCount: 2, logs: ['Connecting via SSH...', 'Authentication failed'],
  },
  {
    id: 's7', repoId: '6', repoName: 'next.js', status: 'success', trigger: 'webhook',
    startedAt: '2026-07-16T14:00:00Z', completedAt: '2026-07-16T14:01:00Z',
    duration: 60, refsPushed: 3, newCommits: 23, sizeTransferred: 12_000_000,
    errorMessage: null, retryCount: 0, logs: ['Webhook triggered sync...', 'Transfer complete.'],
  },
  {
    id: 's8', repoId: '3', repoName: 'rust', status: 'cancelled', trigger: 'manual',
    startedAt: '2026-07-16T11:00:00Z', completedAt: '2026-07-16T11:15:00Z',
    duration: 900, refsPushed: 0, newCommits: 0, sizeTransferred: 0,
    errorMessage: 'Cancelled by admin', retryCount: 0, logs: ['Cancelled by user request'],
  },
  {
    id: 's9', repoId: '12', repoName: 'nixpkgs', status: 'running', trigger: 'scheduled',
    startedAt: '2026-07-16T14:50:00Z', completedAt: null,
    duration: null, refsPushed: 0, newCommits: 0, sizeTransferred: 0,
    errorMessage: null, retryCount: 0, logs: ['Fetching upstream...', 'Receiving objects: 72%'],
  },
  {
    id: 's10', repoId: '8', repoName: 'tailwindcss', status: 'success', trigger: 'webhook',
    startedAt: '2026-07-16T13:44:00Z', completedAt: '2026-07-16T13:45:00Z',
    duration: 60, refsPushed: 2, newCommits: 15, sizeTransferred: 4_500_000,
    errorMessage: null, retryCount: 0, logs: ['Webhook triggered sync...', 'Transfer complete.'],
  },
];

// --- Users ---
export const mockUsers: User[] = [
  { id: 'u1', name: '张三', email: 'zhangsan@company.com', avatar: '', role: 'admin', status: 'active', lastLoginAt: '2026-07-16T09:30:00Z', createdAt: '2024-01-01T00:00:00Z', apiKeys: 3, mfaEnabled: true },
  { id: 'u2', name: '李四', email: 'lisi@company.com', avatar: '', role: 'operator', status: 'active', lastLoginAt: '2026-07-16T14:00:00Z', createdAt: '2024-02-15T00:00:00Z', apiKeys: 2, mfaEnabled: true },
  { id: 'u3', name: '王五', email: 'wangwu@company.com', avatar: '', role: 'operator', status: 'active', lastLoginAt: '2026-07-15T16:45:00Z', createdAt: '2024-03-20T00:00:00Z', apiKeys: 1, mfaEnabled: false },
  { id: 'u4', name: '赵六', email: 'zhaoliu@company.com', avatar: '', role: 'viewer', status: 'active', lastLoginAt: '2026-07-14T11:20:00Z', createdAt: '2024-04-10T00:00:00Z', apiKeys: 0, mfaEnabled: false },
  { id: 'u5', name: '田七', email: 'tianqi@company.com', avatar: '', role: 'viewer', status: 'disabled', lastLoginAt: '2026-06-30T08:00:00Z', createdAt: '2024-05-05T00:00:00Z', apiKeys: 0, mfaEnabled: false },
];

// --- System Stats ---
export const mockSystemStats: SystemStats = {
  totalRepos: 12,
  activeRepos: 8,
  erroredRepos: 2,
  totalStorage: 23_890_000_000,
  totalSyncJobs: 4_521,
  syncJobsToday: 78,
  successRate: 96.2,
  avgSyncDuration: 187,
  activeUsers: 4,
  bandwidthToday: 450_000_000_000,
  bandwidthThisMonth: 8_200_000_000_000,
  uptime: 99.97,
};

// --- Sync Chart Data ---
export const mockSyncChartData: SyncChartPoint[] = [
  { date: '07-10', success: 62, failed: 3, duration: 180, size: 380 },
  { date: '07-11', success: 58, failed: 1, duration: 165, size: 350 },
  { date: '07-12', success: 70, failed: 4, duration: 195, size: 420 },
  { date: '07-13', success: 55, failed: 2, duration: 155, size: 310 },
  { date: '07-14', success: 48, failed: 5, duration: 210, size: 290 },
  { date: '07-15', success: 72, failed: 2, duration: 175, size: 440 },
  { date: '07-16', success: 65, failed: 3, duration: 190, size: 410 },
];

// --- Activities ---
export const mockActivities: Activity[] = [
  { id: 'a1', type: 'sync', message: 'linux 镜像同步完成，新增 145 个提交', repoName: 'linux', timestamp: '2026-07-16T14:30:00Z', severity: 'success' },
  { id: 'a2', type: 'error', message: 'vscode 镜像同步失败：连接超时', repoName: 'vscode', timestamp: '2026-07-16T10:45:00Z', severity: 'error' },
  { id: 'a3', type: 'user', message: '张三 修改了全局同步间隔设置', userName: '张三', timestamp: '2026-07-16T09:00:00Z', severity: 'info' },
  { id: 'a4', type: 'sync', message: 'kubernetes 手动同步已启动', repoName: 'kubernetes', timestamp: '2026-07-16T15:00:00Z', severity: 'info' },
  { id: 'a5', type: 'error', message: 'internal-api SSH 密钥已过期，同步失败', repoName: 'internal-api', timestamp: '2026-07-16T08:02:00Z', severity: 'error' },
  { id: 'a6', type: 'config', message: 'tailwindcss 镜像同步间隔调整为 120 分钟', repoName: 'tailwindcss', timestamp: '2026-07-15T17:30:00Z', severity: 'warning' },
  { id: 'a7', type: 'system', message: '系统自动清理了 14 天前的日志归档', timestamp: '2026-07-15T03:00:00Z', severity: 'info' },
  { id: 'a8', type: 'sync', message: 'next.js 通过 webhook 触发增量同步，新增 23 个提交', repoName: 'next.js', timestamp: '2026-07-16T14:01:00Z', severity: 'success' },
  { id: 'a9', type: 'user', message: '王五 添加了新的 SSH 部署密钥', userName: '王五', timestamp: '2026-07-15T14:20:00Z', severity: 'info' },
  { id: 'a10', type: 'sync', message: 'rust 同步被管理员取消', repoName: 'rust', timestamp: '2026-07-16T11:15:00Z', severity: 'warning' },
  { id: 'a11', type: 'error', message: 'tensorflow 存储空间不足（已达限额 85%）', repoName: 'tensorflow', timestamp: '2026-07-14T09:05:00Z', severity: 'warning' },
  { id: 'a12', type: 'sync', message: 'nixpkgs 大型同步进行中（6.2GB）', repoName: 'nixpkgs', timestamp: '2026-07-16T14:50:00Z', severity: 'info' },
];

// --- Alerts ---
export const mockAlerts: Alert[] = [
  { id: 'al1', title: '同步失败', message: 'vscode 镜像连续 3 次同步失败，请检查上游仓库可访问性', type: 'error', repoId: '4', repoName: 'vscode', acknowledged: false, createdAt: '2026-07-16T10:45:00Z', category: 'alert' },
  { id: 'al2', title: '密钥过期', message: 'internal-api 的 SSH 部署密钥已过期，需要重新配置', type: 'warning', repoId: '11', repoName: 'internal-api', acknowledged: false, createdAt: '2026-07-16T08:02:00Z', category: 'alert' },
  { id: 'al3', title: '存储空间预警', message: 'tensorflow 镜像使用的存储空间已达配额 85%，请清理或扩容', type: 'warning', repoId: '7', repoName: 'tensorflow', acknowledged: false, createdAt: '2026-07-14T09:05:00Z', category: 'alert' },
  { id: 'al4', title: '系统更新公告', message: '镜像同步服务已更新至 v3.2.1，查看详情了解新功能', type: 'info', acknowledged: true, createdAt: '2026-07-13T02:00:00Z', category: 'announcement' },
  { id: 'al5', title: '带宽峰值', message: '今日带宽使用已达 450GB，接近月配额 10%', type: 'info', acknowledged: true, createdAt: '2026-07-16T15:00:00Z', category: 'system' },
  { id: 'al6', title: '计划维护通知', message: '本周日凌晨 2:00-4:00 将进行系统维护升级，届时同步服务将暂停', type: 'warning', acknowledged: false, createdAt: '2026-07-15T09:00:00Z', category: 'announcement' },
  { id: 'al7', title: '安全更新', message: '已修复 SSH 密钥认证的安全漏洞，建议所有用户重新生成密钥', type: 'error', acknowledged: false, createdAt: '2026-07-12T14:00:00Z', category: 'announcement' },
  { id: 'al8', title: '新功能上线', message: '新增批量同步和智能调度功能，可在设置中开启', type: 'success', acknowledged: true, createdAt: '2026-07-10T10:00:00Z', category: 'announcement' },
];

// --- Announcements ---
export const mockAnnouncements: Announcement[] = [
  {
    id: 'ann1',
    title: '镜像同步服务 v3.2.1 版本更新',
    content: `## 更新内容\n\n### ✨ 新功能\n- 新增智能调度算法，根据网络状况自动调整同步频率\n- 支持批量选择仓库进行同步操作\n- 新增 Webhook 事件重试机制\n\n### 🔧 优化\n- 优化大仓库同步时的内存使用\n- 提升 SSH 认证的稳定性\n- 改进同步日志的可读性\n\n### 🐛 修复\n- 修复了极端情况下同步状态显示不正确的问题\n- 修复了 Webhook 签名验证失败的问题\n\n如有任何问题，请联系运维团队。`,
    priority: 'high',
    status: 'published',
    author: '系统管理员',
    pinned: true,
    tags: ['版本更新', '系统维护'],
    createdAt: '2026-07-13T02:00:00Z',
    updatedAt: '2026-07-13T02:00:00Z',
    publishedAt: '2026-07-13T02:00:00Z',
    readCount: 128,
  },
  {
    id: 'ann2',
    title: '计划维护通知：本周末服务升级',
    content: `## 维护通知\n\n为了提升服务质量，我们计划在 **7月20日（周日）凌晨 2:00 ~ 4:00** 进行系统维护升级。\n\n### 影响范围\n- 所有镜像同步任务将在维护期间暂停\n- 已缓存的镜像数据仍可正常拉取\n- 管理后台将进入只读模式\n\n### 预期结果\n- 升级完成后同步队列将自动恢复\n- 期间积压的同步任务将按优先级顺序执行\n\n请提前做好安排，如有不便敬请谅解。`,
    priority: 'high',
    status: 'published',
    author: '运维团队',
    pinned: true,
    tags: ['维护通知', '计划维护'],
    createdAt: '2026-07-15T09:00:00Z',
    updatedAt: '2026-07-15T09:00:00Z',
    publishedAt: '2026-07-15T09:00:00Z',
    readCount: 85,
  },
  {
    id: 'ann3',
    title: 'SSH 密钥安全更新通告',
    content: `## 安全通告\n\n近期我们发现部分 SSH 部署密钥存在安全风险，现已完成安全修复。\n\n### 需要您操作\n1. 登录管理后台\n2. 进入「设置」→「SSH 密钥管理」\n3. 重新生成受影响的密钥\n4. 更新上游仓库的部署密钥\n\n### 时间安排\n请在 **7月25日** 前完成密钥更新，过期密钥将被自动禁用。\n\n如有疑问请联系安全团队。`,
    priority: 'high',
    status: 'published',
    author: '安全团队',
    pinned: false,
    tags: ['安全', '密钥'],
    createdAt: '2026-07-12T14:00:00Z',
    updatedAt: '2026-07-12T14:00:00Z',
    publishedAt: '2026-07-12T14:00:00Z',
    readCount: 210,
  },
  {
    id: 'ann4',
    title: '存储配额调整说明',
    content: `## 调整说明\n\n根据近期使用情况，将对各仓库的存储配额进行如下调整：\n\n- \`nixpkgs\` 镜像配额提升至 150GB（当前使用 62GB）\n- \`tensorflow\` 镜像配额提升至 80GB（当前使用 45GB）\n- 新增仓库默认配额从 10GB 提升至 20GB\n\n以上调整将在下次同步时自动生效。`,
    priority: 'normal',
    status: 'published',
    author: '系统管理员',
    pinned: false,
    tags: ['存储', '配額'],
    createdAt: '2026-07-10T08:00:00Z',
    updatedAt: '2026-07-10T08:00:00Z',
    publishedAt: '2026-07-10T08:00:00Z',
    readCount: 56,
  },
  {
    id: 'ann5',
    title: '新增仓库请求流程优化',
    content: `## 流程优化\n\n为了加快新镜像仓库的添加速度，我们对申请流程进行了优化：\n\n1. 支持批量提交多个仓库申请\n2. 新增状态跟踪页面，实时查看审批进度\n3. 自动检测上游仓库是否存在\n\n常规申请将在 **1个工作日内** 完成审核。`,
    priority: 'normal',
    status: 'published',
    author: '产品团队',
    pinned: false,
    tags: ['功能', '优化'],
    createdAt: '2026-07-08T11:00:00Z',
    updatedAt: '2026-07-08T11:00:00Z',
    publishedAt: '2026-07-08T11:00:00Z',
    readCount: 34,
  },
  {
    id: 'ann6',
    title: '内部文档：灾难恢复演练计划',
    content: `## 内部通知\n\n本季度灾难恢复演练安排如下：\n\n- **时间**：7月28日 14:00-16:00\n- **范围**：模拟主备切换\n- **影响**：同步服务可能出现短暂中断（< 5分钟）\n- **参与人员**：运维团队全体\n\n演练结束后将发布复盘报告。`,
    priority: 'low',
    status: 'published',
    author: '运维团队',
    pinned: false,
    tags: ['内部', '演练'],
    createdAt: '2026-07-05T09:00:00Z',
    updatedAt: '2026-07-05T09:00:00Z',
    publishedAt: '2026-07-05T09:00:00Z',
    readCount: 22,
  },
  {
    id: 'ann7',
    title: 'Q3 路线图草稿（内部讨论）',
    content: `## Q3 规划\n\n### 技术方向\n- 分布式同步架构设计\n- 增量同步算法优化\n- 多数据中心支持\n\n### 运营目标\n- 同步成功率提升至 99.5%\n- 平均同步延迟降低 30%\n- 存储利用率提升至 70%\n\n此文档为内部草稿，请勿外传。`,
    priority: 'low',
    status: 'draft',
    author: '技术总监',
    pinned: false,
    tags: ['内部', '规划'],
    createdAt: '2026-07-01T16:00:00Z',
    updatedAt: '2026-07-02T10:00:00Z',
    publishedAt: null,
    readCount: 15,
  },
];

// --- Settings ---
export const mockSettings: GlobalSettings = {
  defaultSyncInterval: 120,
  maxConcurrentSyncs: 5,
  syncTimeout: 600,
  retryAttempts: 3,
  retryDelay: 300,
  storageLimit: 50_000_000_000_000,
  notificationEmail: 'ops@company.com',
  webhookSecret: 'whsec_********************',
  proxyUrl: 'http://proxy.internal:8080',
  sshKeyPath: '/etc/mirror/keys/deploy_key',
  enableAutoSync: true,
  enableWebhookSync: true,
  enableNotifications: true,
  logRetentionDays: 30,
};

// --- Webhooks ---
export const mockWebhooks: Webhook[] = [
  { id: 'w1', repoId: '1', url: 'https://webhook.company.com/github/linux', events: ['push', 'ping'], secret: '****', enabled: true, lastTriggeredAt: '2026-07-16T14:28:00Z', createdAt: '2024-01-15T08:00:00Z' },
  { id: 'w2', repoId: '6', url: 'https://webhook.company.com/github/nextjs', events: ['push'], secret: '****', enabled: true, lastTriggeredAt: '2026-07-16T14:00:00Z', createdAt: '2024-06-01T10:00:00Z' },
  { id: 'w3', repoId: '8', url: 'https://webhook.company.com/github/tailwindcss', events: ['push', 'ping'], secret: '****', enabled: true, lastTriggeredAt: '2026-07-16T13:44:00Z', createdAt: '2024-08-20T12:00:00Z' },
];

// --- Utility Functions ---

export function getRepoById(id: string): MirrorRepo | undefined {
  return mockRepos.find((r) => r.id === id);
}

export function getSyncJobsForRepo(repoId: string): SyncJob[] {
  return mockSyncJobs.filter((j) => j.repoId === repoId);
}

export function getRecentSyncJobs(limit = 5): SyncJob[] {
  return [...mockSyncJobs]
    .sort((a, b) => new Date(b.startedAt ?? 0).getTime() - new Date(a.startedAt ?? 0).getTime())
    .slice(0, limit);
}

export function getRecentActivities(limit = 10): Activity[] {
  return [...mockActivities]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}

export function getUnacknowledgedAlerts(): Alert[] {
  return mockAlerts.filter((a) => !a.acknowledged);
}

export function getAnnouncementsByStatus(status: 'published' | 'draft' | 'archived'): Announcement[] {
  return mockAnnouncements.filter((a) => a.status === status);
}

export function getPublishedAnnouncements(): Announcement[] {
  return mockAnnouncements.filter((a) => a.status === 'published');
}

export function getPinnedAnnouncements(): Announcement[] {
  return mockAnnouncements.filter((a) => a.pinned && a.status === 'published');
}

export function getAnnouncementById(id: string): Announcement | undefined {
  return mockAnnouncements.find((a) => a.id === id);
}

export function getAlertsByCategory(category: string): Alert[] {
  return mockAlerts.filter((a) => a.category === category);
}

export function getWebhooksForRepo(repoId: string): Webhook[] {
  return mockWebhooks.filter((w) => w.repoId === repoId);
}

export function formatBytesForChart(bytes: number): number {
  return Math.round(bytes / 1_000_000_000);
}