"use client";
import { useState, useEffect } from 'react';
import { db, auth } from '../../firebase'; 
import { ref, update, onValue } from "firebase/database";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

export default function TerapistPaneli() {
  const [kullanici, setKullanici] = useState(null);
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");
  const [girisHata, setGirisHata] = useState("");
  const [yukleniyor, setYukleniyor] = useState(true);

  // PANEL STATE
  const [hiz, setHiz] = useState(5);
  const [aktif, setAktif] = useState(false);
  const [renk, setRenk] = useState("cyan");
  const [ses, setSes] = useState(true);
  const [mod, setMod] = useState("top"); 
  const [odaKodu, setOdaKodu] = useState(null);
  const [mesaj, setMesaj] = useState("");
  const [saniye, setSaniye] = useState(0);
  
  // DANIŞAN TAKİP
  const [danisanAdi, setDanisanAdi] = useState("");
  const [notlar, setNotlar] = useState("");

  useEffect(() => {
    const abonelik = onAuthStateChanged(auth, (user) => {
      setKullanici(user);
      setYukleniyor(false);
      // Eğer kullanıcı giriş yaptıysa ve oda kodu yoksa YENİ KOD ÜRET
      if (user && !odaKodu) {
        const yeniKod = Math.floor(100000 + Math.random() * 900000).toString();
        setOdaKodu(yeniKod);
      }
    });
    return () => abonelik();
  }, [odaKodu]);

  // --- 🔥 KRİTİK DÜZELTME BURASI 🔥 ---
  // Oda kodu oluştuğu an, veritabanına varsayılan ayarları YAZ.
  // Böylece danışan girmeye çalıştığında "Oda Bulunamadı" hatası almaz.
  useEffect(() => {
    if (odaKodu) {
      update(ref(db, 'seanslar/' + odaKodu), {
        hiz: 5, 
        calisiyor: false, 
        renk: 'cyan', 
        ses: true, 
        mod: 'top'
      });
    }
  }, [odaKodu]);
  // -------------------------------------

  useEffect(() => {
    let interval;
    if (aktif) interval = setInterval(() => setSaniye((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [aktif]);

  // Notları çek
  useEffect(() => {
    if (!danisanAdi || danisanAdi.length < 2) { setNotlar(""); return; }
    const güvenliIsim = danisanAdi.trim().replace(/\s+/g, '-').toLowerCase();
    onValue(ref(db, `hasta_notlari/${güvenliIsim}`), (snapshot) => {
      const data = snapshot.val();
      if (data) setNotlar(data); else setNotlar("");
    });
  }, [danisanAdi]);

  // Not kaydet
  const notuKaydet = (yeniNot) => {
    setNotlar(yeniNot);
    if (danisanAdi.length > 1) {
      const güvenliIsim = danisanAdi.trim().replace(/\s+/g, '-').toLowerCase();
      update(ref(db, `hasta_notlari`), { [güvenliIsim]: yeniNot });
    }
  };

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
    setMesaj(`${tip.toUpperCase()} modu seçildi`);
  };

  const girisYap = async (e) => {
    e.preventDefault();
    try { await signInWithEmailAndPassword(auth, email, sifre); setGirisHata(""); } catch (e) { setGirisHata("Hatalı email veya şifre!"); }
  };

  if (yukleniyor) return <div className="min-h-screen flex justify-center items-center text-slate-500">Yükleniyor...</div>;

  // 🔒 GİRİŞ EKRANI
  if (!kullanici) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Terapist Paneli 🔒</h2>
            <p className="text-slate-400 text-xs mt-1">Yetkili Girişi</p>
          </div>
          <form onSubmit={girisYap} className="flex flex-col gap-4">
            <input type="email" placeholder="Email" className="p-3 border rounded-lg bg-slate-50 text-slate-900 focus:border-blue-500 outline-none" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Şifre" className="p-3 border rounded-lg bg-slate-50 text-slate-900 focus:border-blue-500 outline-none" value={sifre} onChange={(e) => setSifre(e.target.value)} />
            {girisHata && <p className="text-red-500 text-sm text-center font-bold">{girisHata}</p>}
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg">GİRİŞ YAP</button>
          </form>
          <div className="mt-8 pt-4 border-t border-slate-100 text-[10px] text-slate-400 text-justify leading-tight">
            <strong>YASAL UYARI:</strong> Bu yazılım (EMDR Online), yalnızca terapi sürecini desteklemek amacıyla geliştirilmiş bir görsel/işitsel uyaran aracıdır. Tıbbi bir cihaz değildir ve tek başına tedavi edici özelliği yoktur. Seansın yönetimi, süresi ve uygunluğu konusundaki tüm klinik sorumluluk, sistemi kullanan uzman terapiste aittir.
          </div>
        </div>
      </div>
    );
  }

  // 🔓 ANA PANEL
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row p-5 gap-5 font-sans relative">
      <button onClick={() => signOut(auth)} className="absolute top-4 right-4 bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors z-10">ÇIKIŞ YAP 🚪</button>

      {/* SOL KOLON */}
      <div className="flex-1 flex flex-col items-center pt-8 lg:pt-0">
        <div className="bg-blue-600 text-white p-4 rounded-xl shadow-lg w-full max-w-md text-center mb-4">
          <p className="text-blue-100 text-xs font-bold uppercase">Danışan Kodu</p>
          <h1 className="text-4xl font-extrabold tracking-widest">{odaKodu}</h1>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
          <div className="flex justify-between items-center mb-4 border-b pb-4">
            <div className={`px-4 py-1 rounded font-bold text-sm ${aktif ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{aktif ? "AKTİF" : "DURDU"}</div>
            <div className="text-xl font-mono font-bold text-slate-700">⏱️ {formatSure(saniye)}</div>
            <button onClick={() => setSaniye(0)} className="text-xs text-gray-400 underline">Sıfırla</button>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-6">
            <button onClick={() => hazirModUygula('travma')} className="bg-red-50 text-red-600 text-xs font-bold py-2 rounded border border-red-200 hover:bg-red-100">⚡ Travma</button>
            <button onClick={() => hazirModUygula('rahat')} className="bg-green-50 text-green-600 text-xs font-bold py-2 rounded border border-green-200 hover:bg-green-100">🌿 Rahatlama</button>
            <button onClick={() => hazirModUygula('odak')} className="bg-yellow-50 text-yellow-600 text-xs font-bold py-2 rounded border border-yellow-200 hover:bg-yellow-100">🎯 Odak</button>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-bold text-slate-500 mb-2">HAREKET MODU</label>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => { setMod("top"); if(aktif) guncelle(hiz, aktif, renk, ses, "top"); }} className={`py-3 rounded-lg text-sm font-bold border transition-all ${mod==="top"?'bg-blue-600 text-white shadow-md':'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>↔️ Yatay</button>
              <button onClick={() => { setMod("isik"); if(aktif) guncelle(hiz, aktif, renk, ses, "isik"); }} className={`py-3 rounded-lg text-sm font-bold border transition-all ${mod==="isik"?'bg-blue-600 text-white shadow-md':'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>💡 Işık (Tap)</button>
              <button onClick={() => { setMod("sekiz"); if(aktif) guncelle(hiz, aktif, renk, ses, "sekiz"); }} className={`py-3 rounded-lg text-sm font-bold border transition-all ${mod==="sekiz"?'bg-blue-600 text-white shadow-md':'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>♾️ Sonsuzluk</button>
              <button onClick={() => { setMod("capraz"); if(aktif) guncelle(hiz, aktif, renk, ses, "capraz"); }} className={`py-3 rounded-lg text-sm font-bold border transition-all ${mod==="capraz"?'bg-blue-600 text-white shadow-md':'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>↗️ Çapraz</button>
            </div>
          </div>
          <div className="mb-4"><label className="block text-xs font-bold text-slate-500 mb-1">HIZ: {hiz}</label><input type="range" min="1" max="20" value={hiz} className="w-full h-2 bg-slate-200 rounded-lg cursor-pointer accent-blue-600" onChange={(e) => { setHiz(e.target.value); if(aktif) guncelle(e.target.value, aktif, renk, ses, mod); }} /></div>
          <div className="mb-4 flex items-center justify-between bg-slate-50 p-3 rounded-lg border">
            <span className="text-sm font-bold text-slate-600">🎧 3D Ses (Stereo)</span>
            <button onClick={() => { const yeniSes = !ses; setSes(yeniSes); if(aktif) guncelle(hiz, aktif, renk, yeniSes, mod); }} className={`px-3 py-1 rounded text-xs font-bold transition-colors ${ses ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'}`}>{ses ? "AÇIK" : "KAPALI"}</button>
          </div>
          <div className="mb-6 flex justify-center gap-3">
             {['cyan', 'red', '#22c55e', '#eab308', '#ec4899'].map((r) => (<button key={r} onClick={() => { setRenk(r); if(aktif) guncelle(hiz, aktif, r, ses, mod); }} className={`w-8 h-8 rounded-full border-2 ${renk === r ? 'border-blue-600 ring-2' : 'border-transparent'}`} style={{ backgroundColor: r === 'cyan' ? '#22d3ee' : r }} />))}
          </div>
          <button onClick={() => { const yeniDurum = !aktif; setAktif(yeniDurum); guncelle(hiz, yeniDurum, renk, ses, mod); }} className={`w-full py-4 rounded-xl font-bold text-white text-xl shadow-lg transition-all active:scale-95 ${aktif ? 'bg-red-500' : 'bg-blue-600'}`}>{aktif ? "⏹ DURDUR" : "▶ BAŞLAT"}</button>
          <p className="text-center text-xs text-gray-400 mt-2 h-4">{mesaj}</p>
        </div>
      </div>

      <div className="flex-1 w-full max-w-md pt-8 lg:pt-0">
        <div className="bg-yellow-50 p-6 rounded-2xl shadow-xl border border-yellow-200 h-full flex flex-col">
          <h3 className="text-yellow-800 font-bold mb-3 flex items-center gap-2">📂 Danışan Dosyası <span className="text-[10px] bg-yellow-200 px-2 py-1 rounded text-yellow-800">GİZLİ</span></h3>
          <input type="text" placeholder="Rumuz / Kod Ad (Örn: H-104)" className="w-full p-3 mb-2 rounded-lg border border-yellow-300 bg-white text-slate-800 font-bold placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 outline-none" value={danisanAdi} onChange={(e) => setDanisanAdi(e.target.value)} />
          <p className="text-[10px] text-yellow-600 mb-4 ml-1">*KVKK gereği gerçek isim yerine takma ad kullanınız.</p>
          <div className="flex-1 relative">
             <textarea className="w-full h-full bg-yellow-100 p-4 rounded-xl text-slate-700 leading-relaxed outline-none resize-none shadow-inner border border-yellow-200" placeholder={danisanAdi.length > 1 ? `${danisanAdi} hakkında notlar...` : "Önce yukarıya kod adı girin..."} value={notlar} onChange={(e) => notuKaydet(e.target.value)} disabled={danisanAdi.length < 2} />
             {danisanAdi.length > 1 && <span className="absolute bottom-2 right-4 text-[10px] text-yellow-600 bg-yellow-200 px-2 rounded">Otomatik Kaydediliyor</span>}
          </div>
        </div>
      </div>
    </div>
  );
}