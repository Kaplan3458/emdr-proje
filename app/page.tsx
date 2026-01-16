"use client";
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex flex-col justify-between font-sans">
      
      {/* --- 1. ÜST HEADER (LOGO & GÜVEN) --- */}
      <header className="w-full p-6 flex justify-between items-center max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">E</div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">EMDR<span className="text-blue-600">Online</span></span>
        </div>
        <div className="text-[10px] font-bold text-slate-400 border border-slate-200 px-3 py-1 rounded-full uppercase tracking-wider bg-white/50 backdrop-blur-sm">
          🔒 KVKK Uyumlu & Güvenli
        </div>
      </header>

      {/* --- 2. ORTA ALAN (KARTLAR) --- */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        
        {/* Başlık Grubu */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-widest text-blue-700 uppercase bg-blue-100 rounded-full">
            Yeni Nesil Dijital Terapi Asistanı
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Terapiyi <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Özgürleştirin.</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Mekandan bağımsız, profesyonel EMDR desteği. Gelişmiş görsel/işitsel uyaran setleri ve güvenli altyapı ile seanslarınızı dijitale taşıyın.
          </p>
        </div>

        {/* Kartlar Grid */}
        <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl">
          
          {/* TERAPİST KARTI */}
          <div className="group bg-white/80 backdrop-blur-xl border border-white p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div> {/* Sol Çizgi */}
            <div className="mb-6 w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
              👨‍⚕️
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Uzman Girişi</h2>
            <p className="text-slate-500 mb-8 text-sm leading-relaxed">
              Danışanlarınızı yönetin, seans odaları oluşturun, hız ve mod ayarlarını uzaktan kontrol edin.
            </p>
            <Link href="/terapist" className="block w-full text-center bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg">
              Yönetim Paneline Git →
            </Link>
          </div>

          {/* DANIŞAN KARTI */}
          <div className="group bg-white/80 backdrop-blur-xl border border-white p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-green-500"></div> {/* Sol Çizgi */}
            <div className="mb-6 w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-3xl shadow-sm group-hover:bg-green-500 group-hover:text-white transition-colors">
              🧘
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Danışan Girişi</h2>
            <p className="text-slate-500 mb-8 text-sm leading-relaxed">
              Terapistinizin verdiği güvenli kod ile seansa katılın. Kişisel veri girmeden anonim kullanım.
            </p>
            <Link href="/danisan" className="block w-full text-center bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition-colors shadow-lg">
              Seansa Katıl →
            </Link>
          </div>

        </div>
      </main>

      {/* --- 3. ALT FOOTER (YASAL UYARI) --- */}
      <footer className="w-full bg-slate-100 border-t border-slate-200 py-8 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs text-slate-400 font-semibold mb-2 uppercase tracking-wider">Yasal Sorumluluk Reddi & Aydınlatma</p>
          <p className="text-[10px] text-slate-400 leading-relaxed text-justify md:text-center">
            EMDR Online yazılımı, <strong>tıbbi bir cihaz değildir</strong> ve tek başına tanı/tedavi amacı taşımaz. Bu sistem, yalnızca ruh sağlığı profesyonellerinin (Psikolog/Psikiyatrist) yönetiminde kullanılması gereken bir görsel-işitsel asistan aracıdır. Seansın içeriği, süresi ve uygulanabilirliği konusundaki tüm klinik sorumluluk uygulayıcı uzmana aittir. Sistem üzerinde hiçbir şekilde ses veya görüntü kaydı tutulmamaktadır (No-Log Policy). Veriler anlık iletilir ve depolanmaz.
          </p>
          <div className="mt-4 text-[10px] text-slate-300 font-medium">
            © 2026 EMDR Online Projesi. Tüm Hakları Saklıdır. v1.2.0
          </div>
        </div>
      </footer>
      
      {/* Animasyon için minik stil */}
      <style jsx global>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
      `}</style>

    </div>
  );
}