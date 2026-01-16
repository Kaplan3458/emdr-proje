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
  
  // SES MOTORU REFERANSLARI
  const audioContextRef = useRef(null);
  
  // Topun/Işığın yönünü takip etmek için (1: Sağ, -1: Sol)
  // Başlangıçta top soldan sağa gidiyor, ilk çarpma SAĞ (1) olacak.
  const yonRef = useRef(1); 

  const odayaBaglan = () => {
    if (girilenKod.length < 6) { setHata("Eksik kod."); return; }
    onValue(ref(db, 'seanslar/' + girilenKod), (snapshot) => {
      const data = snapshot.val();
      if (data) { setVeri(data); setBaglandi(true); setHata(""); } else { setBaglandi(true); }
    });
  };

  const baslatVeSesIzin = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContextRef.current = new AudioContext();
    setHazir(true);
  };

  // --- STEREO SES FONKSİYONU ---
  // panDegeri: -1 (Sol), 0 (Orta), 1 (Sağ)
  const sesCal = (panDegeri = 0) => {
    if (!veri.ses || !hazir) return;
    const ctx = audioContextRef.current;
    
    if (ctx) {
      // osilatör (ses kaynağı)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      // STEREO PANNER (Sağ/Sol Ayırıcı)
      const panner = ctx.createStereoPanner();
      panner.pan.value = panDegeri; // -1 (Sol) ile 1 (Sağ) arası

      // Bağlantı Zinciri: Osilatör -> Gain -> Panner -> Hoparlör
      osc.connect(gain);
      gain.connect(panner);
      panner.connect(ctx.destination);

      osc.frequency.value = 400; // Ton
      osc.type = "sine";
      
      // Ses Zarfi (Yumuşak Başlangıç/Bitiş)
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.1); // 0.1 saniye sürsün

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    }
  };

  // --- ANİMASYON DÖNGÜSÜ TETİKLEYİCİSİ ---
  // Top her duvara çarptığında bu çalışır.
  // CSS 'alternate' animasyonunda olay her 'cycle' bitiminde tetiklenir.
  // 1. Döngü: Soldan -> Sağa (Sağda biter) -> Ses SAĞ (1) gelmeli.
  // 2. Döngü: Sağdan -> Sola (Solda biter) -> Ses SOL (-1) gelmeli.
  const animasyonDungusu = () => {
    // Mevcut yönde sesi çal
    sesCal(yonRef.current);
    // Yönü tersine çevir (1 ise -1 yap, -1 ise 1 yap)
    yonRef.current = yonRef.current * -1;
  };

  // Işık modu için manuel tetikleyiciler
  const solIsikYandi = () => sesCal(-1);
  const sagIsikYandi = () => sesCal(1);

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
      
      {/* --- MOD 1: YATAY TOP (STEREO) --- */}
      {veri.mod === 'top' && (
        <div className="w-full h-full flex items-center relative">
           <div className="absolute w-12 h-12 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.6)]"
            style={{ backgroundColor: secilenRenk, animation: `gitGel ${animasyonSuresi}s linear infinite alternate` }}
            onAnimationIteration={animasyonDungusu}
          ></div>
        </div>
      )}

      {/* --- MOD 2: IŞIK (TAPPING STEREO) --- */}
      {veri.mod === 'isik' && (
        <div className="w-full h-full flex justify-between items-center px-10 md:px-32">
          {/* Sol Işık -> Ses Soldan (-1) */}
          <div className="w-32 h-32 rounded-full opacity-30 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            style={{ backgroundColor: secilenRenk, animation: `yanSon ${animasyonSuresi * 2}s linear infinite` }} 
            onAnimationIteration={solIsikYandi}></div>
          
          {/* Sağ Işık -> Ses Sağdan (1) */}
          <div className="w-32 h-32 rounded-full opacity-30 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            style={{ backgroundColor: secilenRenk, animation: `yanSon ${animasyonSuresi * 2}s linear infinite`, animationDelay: `${animasyonSuresi}s` }} 
            onAnimationIteration={sagIsikYandi}></div>
        </div>
      )}

      {/* --- MOD 3: ÇAPRAZ --- */}
      {veri.mod === 'capraz' && (
        <div className="w-full h-full relative">
           <div className="absolute w-12 h-12 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.6)]"
            style={{ backgroundColor: secilenRenk, animation: `caprazX ${animasyonSuresi}s linear infinite alternate, caprazY ${animasyonSuresi}s linear infinite alternate` }}
            onAnimationIteration={animasyonDungusu}
          ></div>
        </div>
      )}

      {/* --- MOD 4: SONSUZLUK (SEKİZ) --- */}
      {veri.mod === 'sekiz' && (
        <div className="w-full h-full relative flex items-center">
           {/* Yatay Taşıyıcı: Sadece Sağa-Sola gider ve sesi tetikler */}
           <div className="absolute w-full px-10" 
                style={{ animation: `gitGel ${animasyonSuresi}s linear infinite alternate` }}
                onAnimationIteration={animasyonDungusu} // Ses burada tetiklenir (Duvara çarpınca)
           >
             {/* Dikey Hareketli Top: Yukarı aşağı giderek 8 çizer */}
             <div className="w-12 h-12 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.6)]"
                style={{ backgroundColor: secilenRenk, animation: `sekizY ${animasyonSuresi}s ease-in-out infinite` }}
             ></div>
           </div>
        </div>
      )}

      <style jsx>{`
        @keyframes gitGel { from { left: 2%; transform: translateX(0); } to { left: 98%; transform: translateX(-100%); } }
        @keyframes yanSon { 0% { opacity: 0.2; transform: scale(1); } 10% { opacity: 1; transform: scale(1.2); } 20% { opacity: 0.2; transform: scale(1); } 100% { opacity: 0.2; } }
        @keyframes caprazX { from { left: 2%; } to { left: 98%; transform: translateX(-100%); } }
        @keyframes caprazY { from { top: 2%; } to { top: 98%; transform: translateY(-100%); } }
        @keyframes sekizY { 
          0% { transform: translateY(0); } 
          25% { transform: translateY(-250px); } 
          50% { transform: translateY(0); } 
          75% { transform: translateY(250px); } 
          100% { transform: translateY(0); } 
        } 
      `}</style>
    </div>
  );
}