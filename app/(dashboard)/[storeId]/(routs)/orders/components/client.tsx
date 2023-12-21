'use client'

// import { Plus } from "lucide-react"
// import { useParams, useRouter } from "next/navigation"

// import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { DataTable } from "@/components/ui/data-table"
// import { ApiList } from "@/components/ui/api-list"

import { OrderColumn, columns } from "./columns"


interface OrderClientProps {
    data: OrderColumn[]
}
export const OrderClient: React.FC<OrderClientProps> = ({data}) => {
    
    // const router = useRouter()
    // const params = useParams()

    return (
        <>
            <div className="flex items-center justify-between">
                 <Heading 
                    title={`Orders (${data.length})`}
                    description="Manage orders of your store"
                 />
                 {/* <Button onClick={() => router.push(`/${params.storeId}/orders/new`)}>
                    <Plus className="mr-2 w-4 h-4"/>
                    Add new
                 </Button> */}
            </div>
            <Separator />

            <DataTable columns={columns} data={data} filterKey="products" filterKeyPlaceholder="Orders" />

            {/* <Separator />

            <Heading title="API" description="API calls for Orders" />

            <ApiList entityName="Orders" entityIdName="OrderId"/> */}
        </>
    )
}