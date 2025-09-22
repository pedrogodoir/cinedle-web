import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen bg-black bg-[url(/bg.png)] bg-cover bg-center">
      <header>
        Cinedle
      </header>
      
      <div className="flex items-center justify-center flex-1 gap-10 text-center">
        <div className="flex flex-col items-start bg-red-500 h-72 w-56 rounded-4xl shadow-xl p-4 gap-2 cursor-pointer hover:scale-105 transition-transform">
          <h1 className="text-3xl font-extrabold">Classico</h1>
          <p>lorem ipsum</p>
        </div>

        <div className="flex flex-col items-start bg-sky-500 h-72 w-56 rounded-4xl shadow-xl p-4 gap-2 cursor-pointer hover:scale-105 transition-transform">
          <h1 className="text-3xl font-extrabold">Poster</h1>
          <p>lorem ipsum</p>
        </div>
      </div>
    </div>
  );
}
