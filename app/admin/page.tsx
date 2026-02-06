'use client';

import Link from 'next/link';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <header
        className="flex items-center justify-between h-14 px-4 shrink-0 border-b border-[#E8E8E8]"
        style={{ backgroundColor: '#FEE500' }}
      >
        <Link
          href="/"
          className="text-sm text-[#3C1E1E] hover:underline"
        >
          ← 처음으로
        </Link>
        <h1 className="text-lg font-bold text-[#3C1E1E] tracking-tight">
          관리자
        </h1>
        <div className="w-14" />
      </header>

      <main className="flex-1 px-6 py-8">
        <p className="text-[#6B6B6B] text-sm mb-6 text-center">
          스캠 관리 및 모니터링
        </p>

        <div className="max-w-sm mx-auto flex flex-col gap-3">
          <Link
            href="/admin/scam-history"
            className="block w-full py-4 px-6 rounded-2xl font-semibold text-base text-[#3C1E1E] bg-white border border-[#E8E8E8] hover:border-[#FEE500]/40 hover:bg-[#FFFEF7] transition-all shadow-sm"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
          >
            <span className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-[#F5F5F5]">
                📋
              </span>
              스캠 기록 관리 (CRUD)
            </span>
          </Link>

          <Link
            href="/admin/monitor"
            className="block w-full py-4 px-6 rounded-2xl font-semibold text-base text-[#3C1E1E] bg-white border border-[#E8E8E8] hover:border-[#FEE500]/40 hover:bg-[#FFFEF7] transition-all shadow-sm"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
          >
            <span className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-[#F5F5F5]">
                📊
              </span>
              분석 결과 모니터링
            </span>
          </Link>
        </div>
      </main>
    </div>
  );
}
