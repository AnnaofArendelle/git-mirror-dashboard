import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from '@/lib/auth-context';
import { AnnouncementProvider } from '@/lib/store';
import { AppShell } from '@/components/layout/app-shell';

export const metadata: Metadata = {
  title: "GitMirror - 镜像管理平台",
  description: "Git 镜像站统一管理后台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="h-full font-sans bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <AuthProvider>
          <AnnouncementProvider>
            <AppShell>
              {children}
            </AppShell>
          </AnnouncementProvider>
        </AuthProvider>
      </body>
    </html>
  );
}