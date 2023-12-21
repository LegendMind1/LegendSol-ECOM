"use client"

import { ColumnDef } from "@tanstack/react-table"

// import { CellAction } from "./cell-action"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type OrderColumn = {
  id: string
  phone: string
  address: string
  totalPrice: string
  products: string
  isPaid: boolean
  createdAt: string
}

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "products",
    header: "Products",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "totalPrice",
    header: "Total Price",
  },
  {
    accessorKey: "isPaid",
    header: "Paid",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  // { We don't need any actions for the Orders here because Stripe API is going to create orders not us.
  //   id: "actions",
  //   header: "Manage",
  //   // Following passes the row (which is tansack object) of table and passes to our CellAction component. This is basically OrderColumn object declared above but only through tansack table component.
  //   cell: ({row})=> <CellAction data={row.original} /> 
  // }
]
