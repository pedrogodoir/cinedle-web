"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDownIcon } from "lucide-react";

export function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null); // Referência para o dropdown

  // Obtém a rota atual no lado do cliente
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Define o texto dinamicamente com base na URL
  const getHeaderText = () => {
    if (currentPath === "/")
      return (
        <div className="flex">
          <p className="z-10 text-5xl max-[500px]:text-4xl max-[350px]:text-2xl font-extrabold">Cine</p>
          <p className="z-10 text-5xl max-[500px]:text-4xl max-[350px]:text-2xl font-extrabold text-red-500">dle</p>
        </div>
      );
    if (currentPath.startsWith("/classic"))
      return <p className="z-10 text-5xl max-[500px]:text-4xl max-[350px]:text-2xl font-extrabold text-red-500">Classic</p>;
    if (currentPath.startsWith("/poster"))
      return <p className="z-10 text-5xl max-[500px]:text-4xl max-[350px]:text-2xl font-extrabold text-blue-500">Poster</p>;
    return (
        <div className="flex">
          <p className="z-10 text-5xl max-[500px]:text-4xl max-[350px]:text-2xl font-extrabold">Cine</p>
          <p className="z-10 text-5xl max-[500px]:text-4xl max-[350px]:text-2xl font-extrabold text-red-500">dle</p>
        </div>
      );
  };

  // Função para navegar para outra rota
  const navigateTo = (path: string) => {
    if (typeof window !== "undefined") {
      window.location.href = path; // Navega para a nova rota
      setIsDropdownOpen(false); // Fecha o dropdown após a navegação
    }
  };

  // Objeto com as rotas
  const routes = [
    { name: "Home", path: "/" },
    {
      name: "Classic",
      path: `/classic/${new Date().toISOString().split("T")[0]}`, // Gera a data no formato "ano-mês-dia"
    },
    // { name: "Poster", path: "/poster" },
  ];

  return (
    <header className="w-full py-4 flex items-center justify-center text-white text-5xl font-extrabold px-4">
      {/* Dropdown para modos */}
      <div className="relative" ref={dropdownRef}>
        {currentPath == "/" ? (
          getHeaderText()
        ) : (
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center justify-center gap-2 transition cursor-pointer"
          >
            {getHeaderText()}
            <ChevronDownIcon className="w-10 h-10 max-[500px]:w-8 max-[500px]:h-8 max-[350px]:h-6 max-[350px]:w-6"/>
          </button>
        )}

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 bg-zinc-950 text-white rounded-lg shadow-lg w-full z-20 border-3 border-zinc-700">
            {routes.map((route) => (
              <button
                key={route.name}
                onClick={() => navigateTo(route.path)}
                className="block w-full text-left text-lg font-medium px-2 py-1 hover:bg-zinc-700"
              >
                {route.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}