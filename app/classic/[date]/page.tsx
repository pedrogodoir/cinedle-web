"use client";
import { HistoryItem } from "@/lib/types/historyItem";
import { getHistory } from "@/lib/useLocalstorage";
import ClassicTable from "./table/classicTable";
import React from "react";
import WinScreenClassic from "./winScreen/winScreenClassic";

interface PageProps {
  params: Promise<{ date: string }>;
}

function dateExistsInHistory({
  date,
  history,
}: {
  date: string;
  history: HistoryItem[];
}): boolean {
  return history.some((item) => item.date.split("T")[0] === date);
}

export default function Page({ params }: PageProps) {
  const { date } = React.use(params); // <- unwrap da Promise
  const history = getHistory();
  const h = history.find((item) => item.date.split("T")[0] === date);
  return (
    <>
      {dateExistsInHistory({ date, history }) ? (
        <WinScreenClassic movieId={h?.id} totalAttempts={h?.totalAttempts} />
      ) : (
        <ClassicTable />
      )}
    </>
  );
}
