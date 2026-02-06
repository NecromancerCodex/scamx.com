'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
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

export default function AdminScamHistoryPage() {
  const [list, setList] = useState<ScamMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ created: number; embeddings_created?: number; errors: string[] } | null>(null);
  const [showSchemaGuide, setShowSchemaGuide] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 전체 조회: 0 은 쓰지 않고 큰 값으로 요청 (백엔드 상한 50만 건)
      const res = await fetch(`${scamHistoryUrl}?limit=500000`);
      if (!res.ok) throw new Error(`조회 실패: ${res.status} ${res.statusText}`);
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

  const handleUpdateScam = async (id: number, isScam: number) => {
    try {
      const res = await fetch(`${scamHistoryUrl}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_scam: isScam }),
      });
      if (!res.ok) throw new Error('수정 실패');
      setList((prev) =>
        prev.map((m) => (m.id === id ? { ...m, is_scam: isScam } : m))
      );
    } catch (e) {
      alert(e instanceof Error ? e.message : '수정 실패');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('이 기록을 삭제할까요?')) return;
    try {
      const res = await fetch(`${scamHistoryUrl}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('삭제 실패');
      setList((prev) => prev.filter((m) => m.id !== id));
    } catch (e) {
      alert(e instanceof Error ? e.message : '삭제 실패');
    }
  };

  const escapeCsv = (s: string) => {
    const str = String(s ?? '');
    if (/[",\n\r]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
    return str;
  };

  const handleDownloadCsv = () => {
    if (list.length === 0) {
      alert('다운로드할 기록이 없습니다.');
      return;
    }
    const headers = ['id', 'phone_number', 'message_content', 'scam_probability', 'is_scam', 'created_at'];
    const rows = list.map((m) =>
      [
        m.id,
        escapeCsv(m.phone_number),
        escapeCsv(m.message_content),
        m.scam_probability,
        m.is_scam,
        escapeCsv(m.created_at),
      ].join(',')
    );
    const csv = [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scam-history-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportCsv = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setImporting(true);
    setImportResult(null);
    setError(null);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch(`${scamHistoryUrl}/import`, {
        method: 'POST',
        body: form,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.detail || `업로드 실패: ${res.status}`);
      }
      setImportResult({
        created: data.created ?? 0,
        embeddings_created: data.embeddings_created,
        errors: data.errors ?? [],
      });
      await fetchList();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'CSV 삽입 실패');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <header
        className="sticky top-0 z-10 flex items-center justify-between h-14 px-4 shrink-0"
        style={{ backgroundColor: '#FEE500' }}
      >
        <Link href="/admin" className="text-sm text-[#3C1E1E] hover:underline">
          ← 관리자
        </Link>
        <div className="flex gap-4">
          <Link href="/admin/monitor" className="text-sm text-[#3C1E1E] hover:underline">
            분석 모니터링
          </Link>
          <h1 className="text-lg font-bold text-[#3C1E1E] tracking-tight">스캠 기록</h1>
        </div>
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleImportCsv}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading || importing}
            className="rounded-xl border border-[#E8E8E8] bg-white px-3 py-1.5 text-sm text-[#3C1E1E] hover:bg-[#FFFEF7] disabled:opacity-50 shadow-sm"
          >
            {importing ? '삽입 중...' : 'CSV 삽입'}
          </button>
          <button
            type="button"
            onClick={() => setShowSchemaGuide((v) => !v)}
            className="rounded-xl border border-[#E8E8E8] bg-white px-3 py-1.5 text-sm text-[#6B6B6B] hover:bg-[#FFFEF7] shadow-sm"
            title="CSV 필수 컬럼 안내"
          >
            형식 안내
          </button>
          <button
            type="button"
            onClick={handleDownloadCsv}
            disabled={loading || list.length === 0}
            className="rounded-xl border border-[#E8E8E8] bg-white px-3 py-1.5 text-sm text-[#3C1E1E] hover:bg-[#FFFEF7] disabled:opacity-50 shadow-sm"
          >
            CSV 생성
          </button>
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
        {showSchemaGuide && (
          <div className="mb-4 rounded-2xl border border-[#E8E8E8] bg-white p-4 shadow-sm">
            <p className="font-medium text-[#3C1E1E] mb-2">CSV 삽입 시 필수 스키마</p>
            <p className="text-sm text-[#6B6B6B] mb-3">
              첫 줄은 헤더여야 하며, 아래 네 컬럼은 모두 필수입니다. id, created_at 컬럼이 있어도 무시되고 새로 부여됩니다.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-[#E8E8E8] rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-[#FAFAFA]">
                    <th className="text-left p-2 border-b border-[#E8E8E8] font-medium text-[#3C1E1E]">컬럼명</th>
                    <th className="text-left p-2 border-b border-[#E8E8E8] font-medium text-[#3C1E1E]">필수</th>
                    <th className="text-left p-2 border-b border-[#E8E8E8] font-medium text-[#3C1E1E]">형식·제한</th>
                  </tr>
                </thead>
                <tbody className="text-[#191919]">
                  <tr><td className="p-2 border-b border-[#E8E8E8] font-mono">phone_number</td><td className="p-2 border-b border-[#E8E8E8]">예</td><td className="p-2 border-b border-[#E8E8E8]">발신 번호, 최대 20자</td></tr>
                  <tr><td className="p-2 border-b border-[#E8E8E8] font-mono">message_content</td><td className="p-2 border-b border-[#E8E8E8]">예</td><td className="p-2 border-b border-[#E8E8E8]">문자 내용 (텍스트)</td></tr>
                  <tr><td className="p-2 border-b border-[#E8E8E8] font-mono">scam_probability</td><td className="p-2 border-b border-[#E8E8E8]">예</td><td className="p-2 border-b border-[#E8E8E8]">스캠일 확률 0~1 실수 (예: 0.85)</td></tr>
                  <tr><td className="p-2 border-b border-[#E8E8E8] font-mono">is_scam</td><td className="p-2 border-b border-[#E8E8E8]">예</td><td className="p-2 border-b border-[#E8E8E8]">0(정상) 또는 1(스캠)</td></tr>
                  <tr><td className="p-2 font-mono text-[#9E9E9E]">id, created_at</td><td className="p-2 text-[#9E9E9E]">무시</td><td className="p-2 text-[#9E9E9E]">있어도 새로 부여됨</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-[#9E9E9E]">예시 헤더: id,phone_number,message_content,scam_probability,is_scam,created_at</p>
            <p className="mt-1 text-xs text-[#6B6B6B]">삽입 시 message_content 기준으로 세멘틱 임베딩이 자동 생성되어 유사 스캠 검색에 사용됩니다.</p>
          </div>
        )}
        {importResult && (
          <div className="mb-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-green-800">
            <p className="font-medium">CSV 삽입 완료</p>
            <p className="mt-1 text-sm">
              {importResult.created}건 추가되었습니다.
              {typeof importResult.embeddings_created === 'number' && (
                <> 세멘틱 임베딩 {importResult.embeddings_created}건 생성됨.</>
              )}
            </p>
            {importResult.errors.length > 0 && (
              <p className="mt-2 text-xs">오류 {importResult.errors.length}건 (최대 20건만 표시): {importResult.errors.join(' / ')}</p>
            )}
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            <p className="font-medium">목록 조회 실패</p>
            <p className="mt-1 text-sm">{error}</p>
            <p className="mt-2 text-xs text-[#6B6B6B]">API: {scamHistoryUrl}</p>
          </div>
        )}
        {loading ? (
          <p className="text-[#6B6B6B]">불러오는 중...</p>
        ) : list.length === 0 ? (
          <div className="rounded-2xl border border-[#E8E8E8] bg-white p-8 text-center shadow-sm">
            <p className="text-[#191919]">저장된 스캠 기록이 없습니다.</p>
            <p className="mt-2 text-sm text-[#6B6B6B]">
              스캠분류 에이전트로 메시지를 분석하면 여기에 저장됩니다.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-[#6B6B6B]">전체 <strong className="text-[#3C1E1E]">{list.length}</strong>건 (관리 가능)</p>
            {list.map((m) => (
              <div
                key={m.id}
                className="rounded-2xl border border-[#E8E8E8] bg-white p-4 shadow-sm"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-mono text-[#6B6B6B]">#{m.id}</span>
                  <span className="text-[#191919]">{m.phone_number}</span>
                  <span className={`rounded-lg px-2 py-0.5 text-xs font-medium ${m.is_scam ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {m.is_scam ? '스캠' : '정상'}
                  </span>
                  <span className="text-[#6B6B6B]">
                    위험도 {Math.round(m.scam_probability * 100)}%
                  </span>
                  <span className="text-[#9E9E9E]">{m.created_at}</span>
                </div>
                <p className="mb-3 whitespace-pre-wrap break-words text-[#191919]">
                  {m.message_content.length > 300
                    ? `${m.message_content.slice(0, 300)}...`
                    : m.message_content}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateScam(m.id, 1)}
                    className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-sm text-red-700 hover:bg-red-100"
                  >
                    스캠으로 표시
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateScam(m.id, 0)}
                    className="rounded-xl border border-green-200 bg-green-50 px-3 py-1.5 text-sm text-green-700 hover:bg-green-100"
                  >
                    정상으로 표시
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(m.id)}
                    className="rounded-xl border border-[#E8E8E8] bg-[#F5F5F5] px-3 py-1.5 text-sm text-[#3C1E1E] hover:bg-[#EEEEEE]"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
