'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

type ScamMessage = {
  id: number;
  phone_number: string;
  message_content: string;
  scam_probability: number;
  is_scam: number;
  created_at: string;
};

const apiBase = process.env.NEXT_PUBLIC_SCAM_API_BASE?.trim() || 'http://localhost:8000';
const scamHistoryUrl = `${apiBase}/api/v1/scam-history`;

export default function AdminMonitorPage() {
  const [list, setList] = useState<ScamMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${scamHistoryUrl}?limit=500000`);
      if (!res.ok) throw new Error(`조회 실패: ${res.status}`);
      const data = await res.json();
      setList(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : '목록을 불러올 수 없습니다.');
      setList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(fetchList, 30000);
    return () => clearInterval(id);
  }, [autoRefresh, fetchList]);

  const scamCount = list.filter((m) => m.is_scam === 1).length;
  const highRisk = list.filter((m) => m.scam_probability >= 0.6).length;

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <header
        className="sticky top-0 z-10 flex items-center justify-between h-14 px-4 shrink-0"
        style={{ backgroundColor: '#FEE500' }}
      >
        <Link href="/admin" className="text-sm text-[#3C1E1E] hover:underline">
          ← 관리자
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/admin/scam-history" className="text-sm text-[#3C1E1E] hover:underline">
            스캠 기록 관리
          </Link>
          <h1 className="text-lg font-bold text-[#3C1E1E] tracking-tight">분석 결과 모니터링</h1>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-[#3C1E1E]">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded border-[#E8E8E8]"
            />
            30초 자동 새로고침
          </label>
          <button
            type="button"
            onClick={fetchList}
            disabled={loading}
            className="rounded-xl px-3 py-1.5 text-sm text-[#3C1E1E] disabled:opacity-50 shadow-sm"
            style={{ backgroundColor: '#FEE500' }}
          >
            새로고침
          </button>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-6xl w-full px-4 py-6">
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#E8E8E8] bg-white p-4 shadow-sm">
            <p className="text-sm text-[#6B6B6B]">최근 분석 건수</p>
            <p className="text-2xl font-semibold text-[#3C1E1E]">{list.length}건</p>
          </div>
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm">
            <p className="text-sm text-red-600">스캠 판정</p>
            <p className="text-2xl font-semibold text-red-800">{scamCount}건</p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
            <p className="text-sm text-amber-700">위험도 60% 이상</p>
            <p className="text-2xl font-semibold text-amber-800">{highRisk}건</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}
        {loading && list.length === 0 ? (
          <p className="text-[#6B6B6B]">불러오는 중...</p>
        ) : list.length === 0 ? (
          <p className="text-[#6B6B6B]">아직 분석 기록이 없습니다.</p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-[#E8E8E8] bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#E8E8E8]">
                <thead className="bg-[#FAFAFA]">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[#6B6B6B]">ID</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[#6B6B6B]">전화번호</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[#6B6B6B]">위험도</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[#6B6B6B]">판정</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[#6B6B6B]">등록일시</th>
                    <th className="max-w-xs px-4 py-2 text-left text-xs font-medium text-[#6B6B6B]">내용 요약</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E8E8] bg-white">
                  {list.map((m) => (
                    <tr key={m.id} className="hover:bg-[#FFFEF7]">
                      <td className="whitespace-nowrap px-4 py-2 text-sm text-[#6B6B6B]">{m.id}</td>
                      <td className="whitespace-nowrap px-4 py-2 font-mono text-sm text-[#191919]">
                        {m.phone_number}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 text-sm text-[#191919]">
                        {Math.round(m.scam_probability * 100)}%
                      </td>
                      <td className="whitespace-nowrap px-4 py-2">
                        <span
                          className={`rounded-lg px-2 py-0.5 text-xs font-medium ${m.is_scam ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}
                        >
                          {m.is_scam ? '스캠' : '정상'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 text-sm text-[#6B6B6B]">
                        {m.created_at}
                      </td>
                      <td className="max-w-xs truncate px-4 py-2 text-sm text-[#191919]">
                        {m.message_content}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
