'use client'

import axios from "axios"
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react"
import toast from "react-hot-toast"
import { useParams, useRouter } from "next/navigation"
import {useState} from 'react'


import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {Button} from '@/components/ui/button'
import { AlertModal } from "@/components/modals/alert-modal"

import { SizeColumn } from "./columns"


interface CellActionProps {
    data: SizeColumn
}


export const CellAction: React.FC<CellActionProps> = ({data}) => {

    const router = useRouter()
    const params = useParams()

    //===Need following for Delete method====
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    //=======================================


    // ======================= Native Methods ========================================
    const onCopy = (id:string) =>{
        navigator.clipboard.writeText(id)
        toast.success("Size Id copid to the clipboard.")
    }


    const onDelete = async () =>{
        try{
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/sizes/${data.id}`)
            router.refresh()
            // router.push('/')
            toast.success('Size deleted')
        }
        catch (error) {
            toast.error ("Make sure you removed all products that are using this size.")
        }
        finally {
            setLoading(false)
            setOpen(false)
        }
    }
// ===============================================================================



  return (
    <>
        <AlertModal 
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={onDelete}
            loading={loading}
        />
        {/* LegendMind Notes 
            Following Div controls the alignment of dropdown menu dots in data table coloumns
        */}
        <div className="flex justify-center">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='ghost' className="h-8 w-8 p-0">
                    {/* Accessibility feature only screen readers can detect following span */}
                    <span className="sr-only"> 
                        Open Menu
                    </span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel className="p-1 justify-center flex text-[3E363F] bg-[#E1AD01]">
                    Actions
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={()=>onCopy(data.id)}>
                    <Copy className="ml-1 mr-2 h-4 w-4" />
                    <span className="font-semibold">Copy Id</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/sizes/${data.id}`)}>
                    <Edit className="ml-1 mr-2 h-4 w-4 text-green-700" />
                    <span className="font-semibold">Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setOpen(true)}>
                    <Trash className="ml-1 mr-2 h-4 w-4 text-red-600" />
                    <span className="font-semibold">Delete</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        </div>
    </>
  )
}