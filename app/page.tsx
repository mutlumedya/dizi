'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const fetchData = async (query = '') => {
    setLoading(true);
    setError('');
    try {
      const url = query ? `/api/epg?search=${encodeURIComponent(query)}` : '/api/epg';
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setData(json);
      } else {
        setError(json.error || 'Veri alınamadı');
      }
    } catch (e: any) {
      setError(e.message || 'Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData(search);
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '16px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: 16 }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, background: 'linear-gradient(135deg, #2b3b5c, #1f2a40)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          🎯 Mutlu Player
        </h1>
        <span style={{ fontSize: '0.75rem', background: '#eef1f5', padding: '4px 14px', borderRadius: 20, color: '#1f2a40' }}>
          EPG • Şimdi Yayında
        </span>
      </div>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Kanal veya program ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, padding: '12px 16px', borderRadius: 30, border: '1px solid #dce0e8', fontSize: '1rem', outline: 'none' }}
        />
        <button type="submit" style={{ padding: '12px 22px', borderRadius: 30, border: 'none', background: '#1f2a40', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
          Ara
        </button>
      </form>

      {loading && <div style={{ textAlign: 'center', padding: 40 }}>⏳ Yükleniyor...</div>}
      {error && <div style={{ background: '#fee', padding: 16, borderRadius: 16, color: '#b00020' }}>❌ {error}</div>}

      {data && !loading && (
        <>
          <div style={{ fontSize: '0.85rem', color: '#555', marginBottom: 12 }}>
            📡 {data.total} yayın • {data.currentTime}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data.onAir.length === 0 && <div style={{ padding: 24, textAlign: 'center', color: '#888' }}>Hiç yayın bulunamadı.</div>}
            {data.onAir.map((item: any, idx: number) => (
              <div key={idx} style={{ background: '#f8faff', borderRadius: 16, padding: '12px 16px', border: '1px solid #e9ecf2', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 600, fontSize: '1rem', color: '#1f2a40' }}>{item.channel}</div>
                <div style={{ fontSize: '0.95rem', color: '#2b3b5c', flex: 1, padding: '0 10px' }}>{item.title}</div>
                <div style={{ fontSize: '0.7rem', color: '#6b7a93', background: '#eef2f7', padding: '2px 12px', borderRadius: 40 }}>
                  {item.start.slice(8,14)} – {item.stop.slice(8,14)}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
