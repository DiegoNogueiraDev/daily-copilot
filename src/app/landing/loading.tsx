export default function Loading() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#2ed573] to-[#7bed9f] flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(46,213,115,0.5)]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-black animate-pulse">
            <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM16.2 16.2L11 13V7H12.5V12.2L17 15L16.2 16.2Z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Carregando...</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-[#ffa502] via-[#ff4d4d] to-[#2ed573] animate-pulse rounded-full"></div>
      </div>
    </div>
  );
} 