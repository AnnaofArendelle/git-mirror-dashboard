// ============================================================
// Core Types for Git Mirror Site Management Dashboard
// ============================================================

// --- Mirror Repository ---
export interface MirrorRepo {
  id: string;
  name: string;
  description: string;
  upstreamUrl: string;
  mirrorUrl: string;
  protocol: 'https' | 'ssh' | 'git';
  status: 'active' | 'syncing' | 'error' | 'paused' | 'inactive';
  visibility: 'public' | 'internal' | 'private';
  language: string;
  license: string;
  owner: string;
  defaultBranch: string;
  starCount: number;
  forkCount: number;
  sizeInBytes: number;
  lastSyncAt: string | null;
  lastSyncDuration: number | null; // seconds
  nextSyncAt: string | null;
  syncInterval: number; // minutes
  createdAt: string;
  updatedAt: string;
  tags: string[];
  healthScore: number; // 0-100
}

// --- Sync Job ---
export type SyncJobStatus = 'pending' | 'running' | 'success' | 'failed' | 'cancelled';
export type SyncJobTrigger = 'scheduled' | 'manual' | 'webhook' | 'retry';

export interface SyncJob {
  id: string;
  repoId: string;
  repoName: string;
  status: SyncJobStatus;
  trigger: SyncJobTrigger;
  startedAt: string | null;
  completedAt: string | null;
  duration: number | null; // seconds
  refsPushed: number;
  newCommits: number;
  sizeTransferred: number; // bytes
  errorMessage: string | null;
  retryCount: number;
  logs: string[];
}

// --- User ---
export type UserRole = 'admin' | 'operator' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  status: 'active' | 'disabled';
  lastLoginAt: string | null;
  createdAt: string;
  apiKeys: number;
  mfaEnabled: boolean;
}

// --- System Stats ---
export interface SystemStats {
  totalRepos: number;
  activeRepos: number;
  erroredRepos: number;
  totalStorage: number; // bytes
  totalSyncJobs: number;
  syncJobsToday: number;
  successRate: number; // percentage
  avgSyncDuration: number; // seconds
  activeUsers: number;
  bandwidthToday: number; // bytes
  bandwidthThisMonth: number; // bytes
  uptime: number; // percentage
}

// --- Sync Chart Data Point ---
export interface SyncChartPoint {
  date: string;
  success: number;
  failed: number;
  duration: number;
  size: number;
}

// --- Activity ---
export type ActivityType = 'sync' | 'error' | 'user' | 'config' | 'system';

export interface Activity {
  id: string;
  type: ActivityType;
  message: string;
  repoName?: string;
  userName?: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'error' | 'success';
}

// --- Notification / Alert ---
export interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'error' | 'warning' | 'info' | 'success';
  repoId?: string;
  repoName?: string;
  acknowledged: boolean;
  createdAt: string;
  category: 'alert' | 'announcement' | 'system';
}

// --- Announcement ---
export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'high' | 'normal' | 'low';
  status: 'published' | 'draft' | 'archived';
  author: string;
  pinned: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  readCount: number;
}

// --- Settings ---
export interface GlobalSettings {
  defaultSyncInterval: number;
  maxConcurrentSyncs: number;
  syncTimeout: number;
  retryAttempts: number;
  retryDelay: number;
  storageLimit: number;
  notificationEmail: string;
  webhookSecret: string;
  proxyUrl: string;
  sshKeyPath: string;
  enableAutoSync: boolean;
  enableWebhookSync: boolean;
  enableNotifications: boolean;
  logRetentionDays: number;
}

// --- Webhook ---
export interface Webhook {
  id: string;
  repoId: string;
  url: string;
  events: string[];
  secret: string;
  enabled: boolean;
  lastTriggeredAt: string | null;
  createdAt: string;
}

// --- Pagination ---
export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// --- API Response ---
export interface ApiResponse<T> {
  data: T;
  meta?: PaginationMeta;
  error?: string;
}