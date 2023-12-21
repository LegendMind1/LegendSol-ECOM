"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ProductColumn = {
  id: string
  name: string
  price: string
  category: string
  size: string
  color: string
  isFeatured: boolean
  isArchived: boolean
  createdAt: string
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({row}) => {
      return(
        <div className="flex items-center gap-x-2">
          {row.original.color}
          <div className="h-6 w-6 rounded-full border-2" style={{backgroundColor: row.original.color}} />
        </div>
      )
    }
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    header: "Manage",
    // Following passes the row (which is tansack object) of table and passes to our CellAction component. This is basically ProductColumn object declared above but only through tansack table component.
    cell: ({row})=> <CellAction data={row.original} /> 
  }
]
