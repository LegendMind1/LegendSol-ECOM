/* This is part of the Data Table that uses three files i.e. 

1. columns.tsx (client component) will contain our column definitions. 
    This is put in billboards>components with same name.

2. data-table.tsx (client component) will contain our <DataTable /> component.
    This is current file that is put in components>ui

3. page.tsx (server component) is where we'll fetch data and render our table.
    I actually used billboards>page.tsx to fetch data from prisma and pass it to client component in billboards>components>client.tsx
*/

"use client"

import { useState } from "react"

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {Button} from '@/components/ui/button'
import { Input } from "@/components/ui/input"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  filterKey: string
  filterKeyPlaceholder: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterKey,
  filterKeyPlaceholder,
}: DataTableProps<TData, TValue>) {

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
        columnFilters
    }
  })

  return (
    <div>
        {/* ======================== Filter for Table ================== */}
        <div className="flex items-center py-4">
            <Input
            placeholder={`Filter ${filterKeyPlaceholder}`}
            value={(table.getColumn(filterKey)?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
                table.getColumn(filterKey)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
            />
        </div>
        {/* ================================================================= */}
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                        return (
                        <TableHead key={header.id} className={header.column.columnDef.header === "Manage" ? "text-center" : ''}>
                            {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                                )}
                        </TableHead>
                        )
                    })}
                    </TableRow>
                ))}
                </TableHeader>
                <TableBody>
                {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                    <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                    >
                        {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                        ))}
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                        No results.
                    </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
            <Button 
                variant='outline'
                size='sm'
                onClick={()=>table.previousPage()}
                disabled={!table.getCanPreviousPage()}
            >
                Previous
            </Button>
            <Button 
                variant='outline'
                size='sm'
                onClick={()=>table.nextPage()}
                disabled={!table.getCanNextPage()}
            >
                Next
            </Button>
        </div>
    </div>
  )
}
