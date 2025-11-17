"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative overflow-x-auto border-3 border-zinc-700 bg-black rounded-xl flex items-start justify-start"
    >
      <table
        data-slot="table"
        className={cn("w-[1400px] caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-zinc-700 [&_tr]:border-b-3  [+tbody:has(>tr)]:border-b-3 [+tbody:not(:has(>tr))]:border-b-0", className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0 h-full", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        " border-0 grid grid-cols-7 transition-colors",
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, style, colSpan, ...props }: React.ComponentProps<"th">) {
  // Se a linha é renderizada como grid (ver TableRow), colspan não funciona
  // como em tabelas normais. Aqui adicionamos um style de gridColumn quando
  // colSpan é informado para que o cabeçalho possa ocupar múltiplas colunas.
  const gridStyle = colSpan ? { gridColumn: `span ${colSpan} / span ${colSpan}` } : undefined;

  return (
    <th
      data-slot="table-head"
      className={cn(" bg-zinc-950 text-white py-3", className)}
      style={{ ...(style as React.CSSProperties), ...(gridStyle as React.CSSProperties) }}
      {...(colSpan !== undefined ? { colSpan } : {})}
      {...props}
    />
  );
}

function TableCell({ className, style, colSpan, ...props }: React.ComponentProps<"td">) {
  // Suporte a colSpan quando TableRow usa grid: aplicamos gridColumn inline.
  const gridStyle = colSpan ? { gridColumn: `span ${colSpan} / span ${colSpan}` } : undefined;

  return (
    <td
      data-slot="table-cell"
      className={cn("p-2 text-white text-sm", className)}
      style={{ ...(style as React.CSSProperties), ...(gridStyle as React.CSSProperties) }}
      {...(colSpan !== undefined ? { colSpan } : {})}
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
