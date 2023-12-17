'use client'

import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"

import { SizeColumn, columns } from "./columns"


interface SizeClientProps {
    data: SizeColumn[]
}
export const SizeClient: React.FC<SizeClientProps> = ({data}) => {
    
    const router = useRouter()
    const params = useParams()

    return (
        <>
            <div className="flex items-center justify-between">
                 <Heading 
                    title={`Sizes (${data.length})`}
                    description="Manage Sizes of products for your store"
                 />
                 <Button onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
                    <Plus className="mr-2 w-4 h-4"/>
                    Add new
                 </Button>
            </div>
            <Separator />

            <DataTable columns={columns} data={data} filterKey="name" filterKeyPlaceholder="Sizes" />

            <Separator />

            <Heading title="API" description="API calls for Sizes" />

            <ApiList entityName="sizes" entityIdName="sizeId"/>
        </>
    )
}