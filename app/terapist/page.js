"use client";
import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { ref, update } from "firebase/database";

export default function TerapistPaneli() {
  const [hiz, setHiz] = useState(5);
  const [aktif, setAktif] = useState(false);
  const [renk, setRenk] = useState("cyan");
  // DÜZELTME 1: Varsayılan ses artık TRUE (Açık)
  const [ses, setSes] = useState(true);
  const [mod, setMod] = useState("top"); 
  const [odaKodu, setOdaKodu] = useState(null);
  const [mesaj, setMesaj] = useState("");
  const [saniye, setSaniye] = useState(0);
  const [notlar, setNotlar] = useState("");

  useEffect(() => {
    setOdaKodu(Math.floor(100000 + Math.random() * 900000).toString());
  }, []);

  useEffect(() => {
    let interval;
    if (aktif) interval = setInterval(() => setSaniye((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [aktif]);

  const formatSure = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const guncelle = (yHiz, yDurum, yRenk, ySes, yMod) => {
    if (!odaKodu) return;
    update(ref(db, 'seanslar/' + odaKodu), {
      hiz: Number(yHiz), calisiyor: yDurum, renk: yRenk, ses: ySes, mod: yMod
    });
    setMesaj("Güncellendi...");
    setTimeout(() => setMesaj(""), 800);
  };

  const hazirModUygula = (tip) => {
    let ayarlar = {};
    if (tip === "travma") ayarlar = { h: 18, r: 'red', m: 'top', s: true };
    if (tip === "rahat") ayarlar = { h: 4, r: 'green', m: 'top', s: true };
    if (tip === "odak") ayarlar = { h: 10, r: 'yellow', m: 'isik', s: true };

    setHiz(ayarlar.h); setRenk(ayarlar.r); setMod(ayarlar.m); setSes(ayarlar.s);
    if(aktif) guncelle(ayarlar.h, aktif, ayarlar.r, ayarlar.s, ayarlar.m);
  };

  if (!odaKodu) return <div className="p-10 text-center">Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row p-5 gap-5 font-sans">
      
      {/* SOL KOLON: KONTROLLER */}
      <div className="flex-1 flex flex-col items-center">
        <div className="bg-blue-600 text-white p-4 rounded-xl shadow-lg w-full max-w-md text-center mb-4">
          <p className="text-blue-100 text-xs font-bold uppercase">Danışan Kodu</p>
          <h1 className="text-4xl font-extrabold tracking-widest">{odaKodu}</h1>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
          
          {/* SÜRE VE DURUM */}
          <div className="flex justify-between items-center mb-4 border-b pb-4">
            <div className={`px-4 py-1 rounded font-bold text-sm ${aktif ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{aktif ? "AKTİF" : "DURDU"}</div>
            <div className="text-xl font-mono font-bold text-slate-700">⏱️ {formatSure(saniye)}</div>
            <button onClick={() => setSaniye(0)} className="text-xs text-gray-400 underline">Sıfırla</button>
          </div>

          {/* HAZIR BUTONLAR */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            <button onClick={() => hazirModUygula('travma')} className="bg-red-50 text-red-600 text-xs font-bold py-2 rounded border border-red-200">⚡ Travma</button>
            <button onClick={() => hazirModUygula('rahat')} className="bg-green-50 text-green-600 text-xs font-bold py-2 rounded border border-green-200">🌿 Rahatlama</button>
            <button onClick={() => hazirModUygula('odak')} className="bg-yellow-50 text-yellow-600 text-xs font-bold py-2 rounded border border-yellow-200">🎯 Odak</button>
          </div>

          {/* HAREKET TİPİ (Sonsuzluk Kaldırıldı) */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-slate-500 mb-2">HAREKET TİPİ</label>
            <div className="flex gap-2">
              <button onClick={() => { setMod("top"); if(aktif) guncelle(hiz, aktif, renk, ses, "top"); }} className={`flex-1 py-2 rounded text-xs font-bold border ${mod==="top"?'bg-blue-600 text-white':'bg-gray-50'}`}>↔️ Yatay</button>
              <button onClick={() => { setMod("isik"); if(aktif) guncelle(hiz, aktif, renk, ses, "isik"); }} className={`flex-1 py-2 rounded text-xs font-bold border ${mod==="isik"?'bg-blue-600 text-white':'bg-gray-50'}`}>💡 Tapping</button>
              <button onClick={() => { setMod("capraz"); if(aktif) guncelle(hiz, aktif, renk, ses, "capraz"); }} className={`flex-1 py-2 rounded text-xs font-bold border ${mod==="capraz"?'bg-blue-600 text-white':'bg-gray-50'}`}>↗️ Çapraz</button>
            </div>
          </div>

          {/* HIZ */}
          <div className="mb-4"><label className="block text-xs font-bold text-slate-500 mb-1">HIZ: {hiz}</label><input type="range" min="1" max="20" value={hiz} className="w-full h-2 bg-slate-200 rounded-lg cursor-pointer accent-blue-600" onChange={(e) => { setHiz(e.target.value); if(aktif) guncelle(e.target.value, aktif, renk, ses, mod); }} /></div>

          {/* DÜZELTME 2: SES AÇMA KAPAMA GERİ GELDİ */}
          <div className="mb-4 flex items-center justify-between bg-slate-50 p-3 rounded-lg border">
            <span className="text-sm font-bold text-slate-600">🔊 Bilateral Ses</span>
            <button
              onClick={() => {
                const yeniSes = !ses;
                setSes(yeniSes);
                if(aktif) guncelle(hiz, aktif, renk, yeniSes, mod);
              }}
              className={`px-3 py-1 rounded text-xs font-bold transition-colors ${ses ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'}`}
            >
              {ses ? "AÇIK" : "KAPALI"}
            </button>
          </div>

          {/* RENK */}
          <div className="mb-6 flex justify-center gap-3">
            {['cyan', 'red', '#22c55e', '#eab308', '#ec4899'].map((r) => (<button key={r} onClick={() => { setRenk(r); if(aktif) guncelle(hiz, aktif, r, ses, mod); }} className={`w-8 h-8 rounded-full border-2 ${renk === r ? 'border-blue-600 ring-2' : 'border-transparent'}`} style={{ backgroundColor: r === 'cyan' ? '#22d3ee' : r }} />))}
          </div>

          <button onClick={() => { const yeniDurum = !aktif; setAktif(yeniDurum); guncelle(hiz, yeniDurum, renk, ses, mod); }} className={`w-full py-4 rounded-xl font-bold text-white text-xl shadow-lg transition-all active:scale-95 ${aktif ? 'bg-red-500' : 'bg-blue-600'}`}>{aktif ? "⏹ DURDUR" : "▶ BAŞLAT"}</button>
          <p className="text-center text-xs text-gray-400 mt-2 h-4">{mesaj}</p>
        </div>
      </div>

      {/* SAĞ KOLON: NOTLAR */}
      <div className="flex-1 w-full max-w-md">
        <div className="bg-yellow-50 p-6 rounded-2xl shadow-xl border border-yellow-200 h-full flex flex-col">
          <h3 className="text-yellow-800 font-bold mb-3">📝 Seans Notları</h3>
          <textarea className="flex-1 w-full bg-yellow-100 p-4 rounded-xl text-slate-700 outline-none resize-none shadow-inner" placeholder="Notlar..." value={notlar} onChange={(e) => setNotlar(e.target.value)}/>
        </div>
      </div>
    </div>
  );
}