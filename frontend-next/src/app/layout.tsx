import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/bottom-nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EPL Zone",
  description: "Новости, таблица, матчи и статистика Английской Премьер-лиги",
};

const NAV_LINKS = [
  ["/matches", "Матчи"],
  ["/live", "Live"],
  ["/table", "Таблица"],
  ["/teams", "Клубы"],
  ["/news", "Новости"],
  ["/highlights", "Хайлайты"],
  ["/stats", "Статистика"],
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col text-zinc-100">
        <header className="sticky top-0 z-40 border-b border-white/10 bg-black/40 backdrop-blur-xl">
          <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3.5 text-sm">
            <a href="/" className="flex shrink-0 items-center gap-2 text-lg font-extrabold text-white">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-epl-green shadow-[0_0_12px_2px_rgba(0,255,133,0.6)]" />
              EPL <span className="bg-gradient-to-r from-epl-magenta to-epl-cyan bg-clip-text text-transparent">Zone</span>
            </a>
            <div className="ml-auto flex shrink-0 items-center gap-3 sm:gap-4">
              <a href="/search" className="hidden text-white/60 transition-colors hover:text-epl-cyan sm:inline">
                Поиск
              </a>
              <a
                href="/login"
                className="rounded-full bg-gradient-to-r from-epl-magenta to-epl-pink px-3.5 py-1.5 text-xs font-semibold text-white shadow-[0_0_16px_rgba(233,0,82,0.35)] transition-transform hover:scale-105 sm:text-sm"
              >
                Войти
              </a>
            </div>
          </div>
          <nav className="mx-auto hidden max-w-5xl items-center gap-x-1 px-3 pb-2 text-sm sm:flex sm:flex-wrap">
            {NAV_LINKS.map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="shrink-0 rounded-full px-3 py-1.5 text-white/60 transition-colors hover:bg-white/5 hover:text-epl-cyan"
              >
                {label}
              </a>
            ))}
          </nav>
        </header>
        <div className="flex-1 pb-20 sm:pb-0">{children}</div>
        <footer className="mt-auto hidden border-t border-white/10 bg-black/30 px-4 py-6 text-center text-xs text-white/40 sm:block">
          EPL Zone — учебный проект. Не аффилирован с Premier League. Данные: football-data.org.
        </footer>
        <BottomNav />
      </body>
    </html>
  );
}
