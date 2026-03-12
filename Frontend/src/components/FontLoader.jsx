import React from 'react';

const FontLoader = () => (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');
  
      * { box-sizing: border-box; margin: 0; padding: 0; }
  
      :root {
        --bg:        #090c14;
        --surface:   #111827;
        --surface2:  #1a2133;
        --border:    #1e2d45;
        --green:     #10b981;
        --green-dim: #065f46;
        --blue:      #3b82f6;
        --gold:      #f59e0b;
        --red:       #ef4444;
        --red-dim:   #7f1d1d;
        --text:      #f1f5f9;
        --muted:     #64748b;
        --muted2:    #94a3b8;
        font-family: 'Sora', sans-serif;
      }
  
      body { background: var(--bg); color: var(--text); }
  
      .mono { font-family: 'DM Mono', monospace; }
  
      /* scrollbar */
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: var(--bg); }
      ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
  
      /* animations */
      @keyframes fadeUp {
        from { opacity:0; transform:translateY(16px); }
        to   { opacity:1; transform:translateY(0); }
      }
      @keyframes pulse-green {
        0%,100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.4); }
        50%      { box-shadow: 0 0 0 8px rgba(16,185,129,0); }
      }
      @keyframes spin { to { transform:rotate(360deg); } }
  
      .fade-up { animation: fadeUp 0.45s ease both; }
      .fade-up-1 { animation: fadeUp 0.45s 0.05s ease both; }
      .fade-up-2 { animation: fadeUp 0.45s 0.10s ease both; }
      .fade-up-3 { animation: fadeUp 0.45s 0.15s ease both; }
      .fade-up-4 { animation: fadeUp 0.45s 0.20s ease both; }
  
      .card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 24px;
        transition: border-color 0.2s;
      }
      .card:hover { border-color: #2d3f5c; }
  
      .btn-primary {
        background: var(--green);
        color: #000;
        border: none;
        padding: 10px 20px;
        border-radius: 10px;
        font-family: 'Sora', sans-serif;
        font-weight: 600;
        font-size: 13px;
        cursor: pointer;
        transition: opacity 0.2s, transform 0.1s;
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
      .btn-ghost {
        background: transparent;
        color: var(--muted2);
        border: 1px solid var(--border);
        padding: 9px 18px;
        border-radius: 10px;
        font-family: 'Sora', sans-serif;
        font-weight: 500;
        font-size: 13px;
        cursor: pointer;
        transition: all 0.2s;
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .btn-ghost:hover { border-color: var(--green); color: var(--green); }
      .btn-danger {
        background: transparent;
        color: var(--red);
        border: 1px solid var(--red-dim);
        padding: 7px 14px;
        border-radius: 8px;
        font-family: 'Sora', sans-serif;
        font-weight: 500;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s;
      }
      .btn-danger:hover { background: var(--red-dim); }
  
      input, select, textarea {
        background: var(--bg);
        border: 1px solid var(--border);
        color: var(--text);
        padding: 10px 14px;
        border-radius: 10px;
        font-family: 'Sora', sans-serif;
        font-size: 13px;
        width: 100%;
        outline: none;
        transition: border-color 0.2s;
      }
      input:focus, select:focus { border-color: var(--green); }
      input::placeholder { color: var(--muted); }
      select option { background: var(--surface2); }
  
      label { font-size: 12px; color: var(--muted2); margin-bottom: 6px; display: block; font-weight: 500; }
  
      .tag-green { background: #064e3b; color: var(--green); padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
      .tag-red   { background: var(--red-dim); color: var(--red); padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
      .tag-gold  { background: #451a03; color: var(--gold); padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
      .tag-blue  { background: #1e3a5f; color: var(--blue); padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
  
      /* progress bar */
      .progress-track { background: var(--bg); border-radius: 99px; height: 6px; overflow: hidden; }
      .progress-fill  { height: 100%; border-radius: 99px; transition: width 1s ease; }
  
      /* tooltip override */
      .recharts-tooltip-wrapper .recharts-default-tooltip {
        background: var(--surface2) !important;
        border: 1px solid var(--border) !important;
        border-radius: 10px !important;
        font-family: 'Sora', sans-serif !important;
        font-size: 12px !important;
      }
  
      /* modal */
      .modal-overlay {
        position: fixed; inset: 0;
        background: rgba(0,0,0,0.7);
        backdrop-filter: blur(4px);
        display: flex; align-items: center; justify-content: center;
        z-index: 1000;
        animation: fadeUp 0.2s ease;
      }
      .modal-box {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 20px;
        padding: 32px;
        width: 480px;
        max-width: 90vw;
      }
  
      .nav-item {
        display: flex; align-items: center; gap: 12px;
        padding: 11px 16px; border-radius: 12px;
        cursor: pointer; transition: all 0.2s;
        color: var(--muted2);
        font-size: 14px; font-weight: 500;
        border: 1px solid transparent;
      }
      .nav-item:hover { background: var(--surface2); color: var(--text); }
      .nav-item.active {
        background: linear-gradient(135deg, #064e3b, #065f46);
        color: var(--green);
        border-color: var(--green-dim);
      }
      .nav-item.active svg { color: var(--green); }
  
      .stat-card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 20px 24px;
        position: relative;
        overflow: hidden;
      }
      .stat-card::after {
        content: '';
        position: absolute;
        top: 0; right: 0;
        width: 80px; height: 80px;
        border-radius: 0 16px 0 80px;
        opacity: 0.06;
      }
      .stat-card.green::after { background: var(--green); }
      .stat-card.red::after   { background: var(--red); }
      .stat-card.blue::after  { background: var(--blue); }
      .stat-card.gold::after  { background: var(--gold); }
  
      .section-title {
        font-size: 18px; font-weight: 700;
        margin-bottom: 20px;
        display: flex; align-items: center; gap: 10px;
      }
  
      .divider { border: none; border-top: 1px solid var(--border); margin: 16px 0; }
  
      .chip {
        display: inline-flex; align-items: center; gap: 5px;
        padding: 4px 12px; border-radius: 99px;
        font-size: 11px; font-weight: 600; border: 1px solid;
      }
    `}</style>
);

export default FontLoader;
