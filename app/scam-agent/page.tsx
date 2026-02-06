'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function ScamAgentPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [senderPhone, setSenderPhone] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const apiBase =
    process.env.NEXT_PUBLIC_SCAM_API_BASE?.trim() || 'http://localhost:8000';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const phone = senderPhone.trim();
    const content = messageContent.trim();
    if (!content || isLoading) return;

    // 사용자 메시지 표시 (발신자 + 내용)
    const userDisplay = phone 
      ? `[발신자] ${phone}\n\n${content}` 
      : content;
    
    setSenderPhone('');
    setMessageContent('');
    setMessages((prev) => [...prev, { role: 'user', content: userDisplay }]);
    setIsLoading(true);

    try {
      const res = await fetch(`${apiBase}/scam-agent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: content,
          sender_phone: phone || undefined,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const detail =
          typeof data?.detail === 'string' ? data.detail : '분석 실패';
        throw new Error(detail);
      }

      // 결과 판정: 차단(60% 이상) / 경고(50~59%) / 통과(50% 미만)
      let status = '통과';
      if (data.is_blocked) {
        status = '차단';
      } else if (data.is_warning) {
        status = '경고';
      }
      
      const resultText = [
        `[결과] ${status}`,
        `위험도: ${Number(data.risk_score ?? 0).toFixed(1)}%`,
        `유형: ${data.scam_type ?? '알 수 없음'}`,
        '',
        data.message ?? '',
      ]
        .filter(Boolean)
        .join('\n');

      setMessages((prev) => [...prev, { role: 'assistant', content: resultText }]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '분석 중 오류가 발생했습니다.';
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `오류: ${errorMessage}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#FAFAFA]">
      <header
        className="shrink-0 flex items-center justify-between h-14 px-4"
        style={{ backgroundColor: '#FEE500' }}
      >
        <Link href="/" className="text-sm text-[#3C1E1E] hover:underline transition-colors">
          ← 처음으로
        </Link>
        <h1 className="text-lg font-bold text-[#3C1E1E] tracking-tight">스캠분류 에이전트</h1>
        <div className="w-14" />
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center pt-20 text-center">
              <p className="text-[#191919] text-lg mb-2 font-medium">무엇이든 입력해 보세요</p>
              <p className="text-[#6B6B6B] text-sm">
                스캠·피싱 여부 분류를 도와드립니다
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      msg.role === 'user'
                        ? 'text-white rounded-br-md'
                        : 'bg-white border border-[#E8E8E8] text-[#191919] rounded-bl-md shadow-sm'
                    }`}
                    style={msg.role === 'user' ? { backgroundColor: '#3C1E1E' } : undefined}
                  >
                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-[#E8E8E8] rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                    <span className="inline-flex gap-1">
                      <span className="w-2 h-2 bg-[#FEE500] rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-2 h-2 bg-[#FEE500] rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-2 h-2 bg-[#FEE500] rounded-full animate-bounce" />
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="shrink-0 border-t border-[#E8E8E8] bg-white p-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-3">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <label className="shrink-0 text-sm font-medium text-[#3C1E1E] w-24">
                발신자 번호
              </label>
              <input
                type="text"
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
                placeholder="010-0000-0000 (선택)"
                className="flex-1 rounded-xl border border-[#E8E8E8] px-4 py-2 text-[#191919] placeholder-[#9E9E9E] focus:outline-none focus:ring-2 focus:ring-[#FEE500]/50 focus:border-[#FEE500]/50"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-[#3C1E1E] mb-2">
                메시지 내용
              </label>
              <textarea
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e as unknown as React.FormEvent);
                  }
                }}
                placeholder="분석할 문자 내용을 입력하세요..."
                rows={3}
                className="w-full resize-none rounded-xl border border-[#E8E8E8] px-4 py-3 text-[#191919] placeholder-[#9E9E9E] focus:outline-none focus:ring-2 focus:ring-[#FEE500]/50 focus:border-[#FEE500]/50"
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={!messageContent.trim() || isLoading}
              className="shrink-0 h-12 w-12 rounded-full hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-[#3C1E1E] transition-colors shadow-sm"
              style={{ backgroundColor: '#FEE500' }}
              aria-label="전송"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
