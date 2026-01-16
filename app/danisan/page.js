"use client";
import { useState, useRef, useEffect } from 'react';
import { db } from '../../firebase';
import { ref, onValue } from "firebase/database";

export default function DanisanEkrani() {
  const [girilenKod, setGirilenKod] = useState("");
  const [baglandi, setBaglandi] = useState(false);
  const [hata, setHata] = useState("");
  
  // Varsayılan arka plan 'black'
  const [veri, setVeri] = useState({ hiz: 5, calisiyor: false, renk: 'cyan', ses: true, mod: 'top', arkaPlan: 'black' });
  const [hazir, setHazir] = useState(false);
  
  // KVKK
  const [kvkkAcik, setKvkkAcik] = useState(false);
  const [onay, setOnay] = useState(false);

  const audioContextRef = useRef(null);
  const yonRef = useRef(1); // 1: Sağ, -1: Sol

  // SENKRONİZASYON: Hız/Mod değişince yönü sıfırla
  useEffect(() => {
    yonRef.current = 1; 
  }, [veri.hiz, veri.mod, veri.calisiyor]);

  const kvkkAc = () => {
    if (girilenKod.length < 6) { setHata("Lütfen geçerli bir kod giriniz."); return; }
    setKvkkAcik(true);
  };

  const odayaBaglan = () => {
    if (!onay) return;
    onValue(ref(db, 'seanslar/' + girilenKod), (snapshot) => {
      const data = snapshot.val();
      if (data) { setVeri(data); setBaglandi(true); setHata(""); } 
      else { setHata("Oda bulunamadı."); setKvkkAcik(false); }
    });
  };

  const baslatVeSesIzin = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContextRef.current = new AudioContext();
    setHazir(true);
  };

  const sesCal = (panDegeri) => {
    if (!veri.ses || !hazir) return;
    const ctx = audioContextRef.current;
    if (ctx && ctx.state === 'suspended') ctx.resume(); 

    if (ctx) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const panner = ctx.createStereoPanner();

      panner.pan.value = panDegeri; 

      osc.connect(gain);
      gain.connect(panner);
      panner.connect(ctx.destination);

      osc.frequency.value = 400; 
      osc.type = "sine";
      
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.1); 
      
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    }
  };

  // ÇAPRAZ MOD FİLTRESİ
  const animasyonKontrol = (e) => {
    if (e.animationName.includes('gitGel') || e.animationName.includes('caprazX')) {
       sesCal(yonRef.current); 
       yonRef.current = yonRef.current * -1; 
    }
  };

  const solIsikYandi = () => sesCal(-1);
  const sagIsikYandi = () => sesCal(1);

  const baseSure = Math.max(0.3, 4 - (veri.hiz * 0.18));
  const renkKodlari = { cyan: '#22d3ee', red: '#ef4444', green: '#22c55e', yellow: '#eab308', '#ec4899': '#ec4899' };
  const secilenRenk = renkKodlari[veri.renk] || veri.renk;
  
  // Arka Plan Renkleri
  const bgColors = {
    black: '#000000',
    gray: '#374151', 
    blue: '#172554', 
    beige: '#f5f5dc' 
  };
  const currentBg = bgColors[veri.arkaPlan] || '#000000';
  const isLightMode = veri.arkaPlan === 'beige'; 

  if (!baglandi) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm text-center z-10">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">EMDR Online</h2>
          <p className="text-xs text-slate-400 mb-4">Uzaktan Terapi Asistanı</p>
          <input type="number" placeholder="Oda Kodu" className="w-full text-center text-3xl text-black font-bold tracking-widest p-3 border-2 border-slate-200 rounded-lg mb-4 focus:border-blue-500 outline-none" value={girilenKod} onChange={(e) => setGirilenKod(e.target.value)} />
          {hata && <p className="text-red-500 text-sm mb-3">{hata}</p>}
          <button onClick={kvkkAc} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors">SEANSA BAŞLA</button>
        </div>
        
        {/* --- DETAYLI KVKK METNİ --- */}
        {kvkkAcik && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl animate-fade-in">
              <h3 className="text-xl font-bold text-slate-900 mb-4">⚠️ Aydınlatma Metni</h3>
              <div className="h-64 overflow-y-auto bg-slate-50 p-4 rounded border border-slate-200 text-xs text-slate-600 mb-4 leading-relaxed text-justify">
                <p className="font-bold mb-2 text-slate-800">6698 Sayılı Kişisel Verilerin Korunması Kanunu (KVKK) Uyarınca:</p>
                <p className="mb-2">Bu uygulama (EMDR Online), terapistiniz ile aranızdaki seans süresince görsel ve işitsel uyaran sağlamak amacıyla geliştirilmiş bir dijital araçtır.</p>
                
                <p className="font-bold mb-1 text-slate-800">1. Veri İşleme Politikası:</p>
                <p className="mb-2">Bu sistem üzerinden hiçbir şekilde görüntülü konuşma, ses kaydı veya kişisel kimlik bilgisi (Ad-Soyad, TC No vb.) ALINMAMAKTADIR ve KAYDEDİLMEMEKTEDİR. Sistem sadece anlık olarak seçilen renk, hız, hareket modu ve ses komutlarını işlemektedir.</p>
                
                <p className="font-bold mb-1 text-slate-800">2. Sorumluluk Reddi:</p>
                <p className="mb-2">Bu uygulama tıbbi bir tedavi cihazı değildir. Terapinin klinik yönetimi, süresi ve danışana uygunluğu konusundaki tüm sorumluluk, sistemi kullanan uzman terapiste aittir. Oluşabilecek herhangi bir yan etkiden yazılım sağlayıcısı sorumlu tutulamaz.</p>

                <p className="font-bold mb-1 text-slate-800">3. Çerezler ve Bağlantı:</p>
                <p>Teknik bağlantının sağlanması ve oturumun sürdürülebilmesi amacıyla cihazınızda geçici çerezler kullanılmaktadır. Odaya katılarak bu şartları kabul etmiş sayılırsınız.</p>
              </div>
              
              <label className="flex items-center gap-3 mb-6 cursor-pointer select-none">
                <input type="checkbox" className="w-5 h-5 accent-blue-600" checked={onay} onChange={(e) => setOnay(e.target.checked)} />
                <span className="text-sm text-slate-800 font-medium">Yukarıdaki metni okudum, anladım ve onaylıyorum.</span>
              </label>

              <div className="flex gap-3">
                <button onClick={() => setKvkkAcik(false)} className="flex-1 py-3 rounded-lg border border-slate-300 text-slate-600 font-bold hover:bg-slate-50">İPTAL</button>
                <button 
                  onClick={odayaBaglan} 
                  disabled={!onay}
                  className={`flex-1 py-3 rounded-lg text-white font-bold transition-all ${onay ? 'bg-green-600 hover:bg-green-700 shadow-lg' : 'bg-gray-300 cursor-not-allowed'}`}
                >
                  ODAYA GİR
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (!hazir) return <div onClick={baslatVeSesIzin} className="h-screen w-full bg-slate-900 flex flex-col items-center justify-center cursor-pointer text-white"><h1 className="text-3xl font-bold mb-4 animate-bounce">Başlamak İçin Tıkla</h1><div className="text-5xl">👆</div></div>;

  if (!veri.calisiyor) return <div className="h-screen w-full flex items-center justify-center" style={{backgroundColor: currentBg}}><div className={`animate-pulse text-xl ${isLightMode ? 'text-slate-500' : 'text-gray-600'}`}>Terapist Bekleniyor...</div></div>;

  return (
    <div className="h-screen w-full overflow-hidden relative cursor-none" style={{ backgroundColor: currentBg }}>
      {veri.mod === 'top' && (
        <div className="w-full h-full flex items-center relative">
           <div className="absolute w-12 h-12 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.6)]" style={{ backgroundColor: secilenRenk, animation: `gitGel ${baseSure}s linear infinite alternate` }} onAnimationIteration={animasyonKontrol}></div>
        </div>
      )}
      {veri.mod === 'isik' && (
        <div className="w-full h-full flex justify-between items-center px-10 md:px-32">
          <div className="w-32 h-32 rounded-full opacity-30 shadow-[0_0_20px_rgba(255,255,255,0.2)]" style={{ backgroundColor: secilenRenk, animation: `yanSon ${baseSure * 2}s linear infinite` }} onAnimationIteration={solIsikYandi}></div>
          <div className="w-32 h-32 rounded-full opacity-30 shadow-[0_0_20px_rgba(255,255,255,0.2)]" style={{ backgroundColor: secilenRenk, animation: `yanSon ${baseSure * 2}s linear infinite`, animationDelay: `${baseSure}s` }} onAnimationIteration={sagIsikYandi}></div>
        </div>
      )}
      {veri.mod === 'capraz' && (
        <div className="w-full h-full relative">
           <div className="absolute w-12 h-12 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.6)]" style={{ backgroundColor: secilenRenk, animation: `caprazX ${baseSure}s linear infinite alternate, caprazY ${baseSure}s linear infinite alternate` }} onAnimationIteration={animasyonKontrol}></div>
        </div>
      )}
      {veri.mod === 'sekiz' && (
        <div className="w-full h-full relative flex items-center">
           <div className="absolute w-12 h-12" style={{ animation: `gitGel ${baseSure}s linear infinite alternate` }} onAnimationIteration={animasyonKontrol}>
             <div className="w-full h-full rounded-full shadow-[0_0_30px_rgba(255,255,255,0.6)]" style={{ backgroundColor: secilenRenk, animation: `sekizY ${baseSure}s ease-in-out infinite` }}></div>
           </div>
        </div>
      )}
      <style jsx>{`
        @keyframes gitGel { from { left: 2%; transform: translateX(0); } to { left: 98%; transform: translateX(-100%); } }
        @keyframes yanSon { 0% { opacity: 0.2; transform: scale(1); } 10% { opacity: 1; transform: scale(1.2); } 20% { opacity: 0.2; transform: scale(1); } 100% { opacity: 0.2; } }
        @keyframes caprazX { from { left: 2%; } to { left: 98%; transform: translateX(-100%); } }
        @keyframes caprazY { from { top: 2%; } to { top: 98%; transform: translateY(-100%); } }
        @keyframes sekizY { 0% { transform: translateY(0); } 25% { transform: translateY(-42vh); } 50% { transform: translateY(0); } 75% { transform: translateY(42vh); } 100% { transform: translateY(0); } } 
      `}</style>
    </div>
  );
}