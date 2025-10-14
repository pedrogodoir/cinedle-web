import { History } from "@/components/ui/history";

export default function Classic({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen bg-black bg-[url(/bg-classic.png)] bg-size-[100vw] bg-no-repeat">
      <header className="text-white text-5xl font-extrabold flex gap-4 mt-8">
        Cinedle <History />
      </header>
      {children}
    </div>
  );
}
