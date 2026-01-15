"use client";
import { useState, useRef } from 'react';
import { db } from '../../firebase';
import { ref, onValue } from "firebase/database";

export default function DanisanEkrani() {
  const [girilenKod, setGirilenKod] = useState("");
  const [baglandi, setBaglandi] = useState(false);
  const [hata, setHata] = useState("");
  const [veri, setVeri] = useState({ hiz: 5, calisiyor: false, renk: 'cyan', ses: true, mod: 'top' });
  const [hazir, setHazir] = useState(false);
  const audioContextRef = useRef(null);

  const odayaBaglan = () => {
    if (girilenKod.length < 6) { setHata("Eksik kod."); return; }
    onValue(ref(db, 'seanslar/' + girilenKod), (snapshot) => {
      const data = snapshot.val();
      if (data) { setVeri(data); setBaglandi(true); setHata(""); } else { setBaglandi(true); }
    });
  };

  const baslatVeSesIzin = () => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    setHazir(true);
  };

  const sesCal = () => {
    if (!veri.ses || !hazir) return;
    const ctx = audioContextRef.current;
    if(ctx) {
        const osc = ctx.createOscillator(); const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = 400; osc.type = "sine";
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.1);
        osc.start(); osc.stop(ctx.currentTime + 0.1);
    }
  };

  const animasyonSuresi = Math.max(0.3, 4 - (veri.hiz * 0.18));
  const renkKodlari = { cyan: '#22d3ee', red: '#ef4444', green: '#22c55e', yellow: '#eab308', '#ec4899': '#ec4899' };
  const secilenRenk = renkKodlari[veri.renk] || veri.renk;

  if (!baglandi) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">EMDR Online</h2>
          <input type="number" placeholder="Kod" className="w-full text-center text-3xl text-black font-bold tracking-widest p-3 border-2 border-slate-200 rounded-lg mb-4 focus:border-blue-500 outline-none" value={girilenKod} onChange={(e) => setGirilenKod(e.target.value)} />
          {hata && <p className="text-red-500 text-sm mb-3">{hata}</p>}
          <button onClick={odayaBaglan} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors">ODAYA KATIL</button>
        </div>
      </div>
    );
  }

  if (!hazir) return <div onClick={baslatVeSesIzin} className="h-screen w-full bg-slate-900 flex flex-col items-center justify-center cursor-pointer text-white"><h1 className="text-3xl font-bold mb-4 animate-bounce">Başlamak İçin Tıkla</h1><div className="text-5xl">👆</div></div>;

  if (!veri.calisiyor) return <div className="h-screen w-full bg-black flex items-center justify-center"><div className="text-gray-600 animate-pulse text-xl">Bekleniyor...</div></div>;

  return (
    <div className="h-screen w-full bg-black overflow-hidden relative cursor-none">
      
      {/* --- MOD 1: YATAY (KLASİK) --- */}
      {veri.mod === 'top' && (
        <div className="w-full h-full flex items-center relative">
           <div className="absolute w-12 h-12 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.6)]"
            style={{ backgroundColor: secilenRenk, animation: `gitGel ${animasyonSuresi}s linear infinite alternate` }}
            onAnimationIteration={sesCal}
          ></div>
        </div>
      )}

      {/* --- MOD 2: IŞIK (TAPPING) --- */}
      {veri.mod === 'isik' && (
        <div className="w-full h-full flex justify-between items-center px-10 md:px-32">
          <div className="w-32 h-32 rounded-full opacity-30 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            style={{ backgroundColor: secilenRenk, animation: `yanSon ${animasyonSuresi * 2}s linear infinite` }} onAnimationIteration={sesCal}></div>
          <div className="w-32 h-32 rounded-full opacity-30 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            style={{ backgroundColor: secilenRenk, animation: `yanSon ${animasyonSuresi * 2}s linear infinite`, animationDelay: `${animasyonSuresi}s` }} onAnimationIteration={sesCal}></div>
        </div>
      )}

      {/* --- MOD 3: ÇAPRAZ --- */}
      {veri.mod === 'capraz' && (
        <div className="w-full h-full relative">
           <div className="absolute w-12 h-12 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.6)]"
            style={{ backgroundColor: secilenRenk, animation: `caprazX ${animasyonSuresi}s linear infinite alternate, caprazY ${animasyonSuresi}s linear infinite alternate` }}
            onAnimationIteration={sesCal}
          ></div>
        </div>
      )}

      <style jsx>{`
        @keyframes gitGel { from { left: 2%; transform: translateX(0); } to { left: 98%; transform: translateX(-100%); } }
        @keyframes yanSon { 0% { opacity: 0.2; transform: scale(1); } 10% { opacity: 1; transform: scale(1.2); } 20% { opacity: 0.2; transform: scale(1); } 100% { opacity: 0.2; } }
        @keyframes caprazX { from { left: 2%; } to { left: 98%; transform: translateX(-100%); } }
        @keyframes caprazY { from { top: 2%; } to { top: 98%; transform: translateY(-100%); } }
      `}</style>
    </div>
  );
}