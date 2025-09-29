'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import axios from "axios";
import { ChevronRight, ChevronRightIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function Classic() {
  const [inputValue, setInputValue] = useState("");
  const [results, setResults] = useState<{ id: string; title: string }[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!inputValue) {
      setResults([]);
      return;
    }
    const handler = setTimeout(() => {
      const fetchData = async () => {
        try {
          const res = await axios.get(`https://cinedle-backend.onrender.com/movies/summary/${inputValue}`);
          setResults(Array.isArray(res.data) ? res.data : []);
          console.log(res.data);
        } catch {
          setResults([]);
        }
      };
      fetchData();
    }, 1000);

    return () => clearTimeout(handler);
  }, [inputValue]);

  useEffect(() => {
    if (inputValue && results.length > 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [inputValue, results]);

  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen bg-black bg-[url(/bg-classic.png)] bg-cover bg-center">
      <header className="text-white text-5xl font-extrabold ">
        Cinedle
      </header>
      <div className="flex flex-col items-center flex-1 gap-10 text-center pt-40 pb-40">
        <div className="flex items-center justify-center gap-6">
          <div className="relative w-72">
            <Input
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              className="border-3 border-zinc-700 p-2 px-3.5 bg-zinc-950 rounded-4xl text-2xl text-white w-full"
              placeholder="Inception"
              type="text"
            />
            {inputValue && (
              <div className="absolute left-0 right-0 mt-2 bg-zinc-950 gap-2 text-white rounded-xl shadow-lg z-10 border-3 border-zinc-700">
                {results.length === 0 ? (
                  <div className="p-4 text-white text-center">Nenhum resultado</div>
                ) : (
                  results.map(item => (
                    <div key={item.id} className=" flex flex-col justify-end text-white hover:bg-zinc-800 hover:rounded-md align-baseline text-left p-2 cursor-pointer">
                      <p className="text-white">{item.title}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <Button className="bg-red-500 text-2xl cursor-pointer hover:scale-105 transition-transform" size={"icon"}>
            <ChevronRightIcon size={40} />
          </Button>
        </div>

        <Table className="bg-zinc-950">
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Genre(s)</TableHead>
              <TableHead>Main Actor</TableHead>
              <TableHead>Director(s)</TableHead>
              <TableHead>Companies</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Realease</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="gap-2 p-2">
              <TableCell>
                <div className="m-2 bg-red-500 h-full">
                  <div className="bg-red-500 rounded-md h-full">
                    <p>Inception</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col bg-yellow-500 rounded-md">
                  <p>Action</p>
                  <p>Adventure</p>
                  <p>Fiction</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col bg-red-500 rounded-md">
                  <p>Leonardo Dicaprio</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col bg-green-500 rounded-md">
                  <p>Christopher Nolan</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col bg-yellow-500 rounded-md">
                  <p>Warner Bros. Pictures</p>
                  <p>Syncopy</p>
                  <p>Legendary Pictures</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col bg-yellow-500 rounded-md">
                  <p>1600000.00</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col bg-yellow-500 rounded-md">
                  <p>15/07/2010</p>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
