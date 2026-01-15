import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      
      {/* ÜST BAŞLIK ALANI */}
      <div className="text-center mb-12 max-w-2xl">
        <div className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold tracking-wider mb-4 uppercase">
          Yeni Nesil Terapi Aracı
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-4">
          EMDR <span className="text-blue-600">Online</span>
        </h1>
        <p className="text-slate-500 text-lg md:text-xl leading-relaxed">
          Mekandan bağımsız, profesyonel EMDR terapisi. 
          Gelişmiş görsel ve işitsel uyarım setleri ile seanslarınızı dijitale taşıyın.
        </p>
      </div>

      {/* KARTLAR ALANI */}
      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
        
        {/* TERAPİST KARTI */}
        <Link href="/terapist" className="group">
          <div className="bg-white hover:bg-blue-50 border-2 border-slate-100 hover:border-blue-200 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 cursor-pointer h-full flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">
              👨‍⚕️
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Terapist Girişi</h2>
            <p className="text-slate-500 mb-6">
              Seans oluşturun, hızı ve modları kontrol edin. Danışanınızı uzaktan yönetin.
            </p>
            <span className="mt-auto inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg shadow-blue-200 group-hover:bg-blue-700 transition-colors">
              Yönetim Paneline Git →
            </span>
          </div>
        </Link>

        {/* DANIŞAN KARTI */}
        <Link href="/danisan" className="group">
          <div className="bg-white hover:bg-green-50 border-2 border-slate-100 hover:border-green-200 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 cursor-pointer h-full flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">
              🧘
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Danışan Girişi</h2>
            <p className="text-slate-500 mb-6">
              Terapistinizin verdiği kod ile odaya bağlanın. Sessiz bir ortamda odaklanın.
            </p>
            <span className="mt-auto inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg shadow-green-200 group-hover:bg-green-700 transition-colors">
              Seansa Katıl →
            </span>
          </div>
        </Link>

      </div>

      {/* ALT BİLGİ */}
      <footer className="mt-16 text-slate-400 text-sm">
        <p>© 2024 EMDR Online Projesi. Tüm hakları saklıdır.</p>
      </footer>

    </div>
  );
}