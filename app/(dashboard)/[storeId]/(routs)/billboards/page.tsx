import {format} from 'date-fns'
import prismadb from "@/lib/prismadb"

import { BillboardClient } from "./components/client"
import { BillboardColumn } from "./components/columns"

const BillBoardsPage = async ({params}: {params: {storeId: string}}) => {

    const billboards = await prismadb.billboard.findMany({
        where:{
            storeId: params.storeId 
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    // Instead of passing data={billboards} directly to BillboardClient, it must be properly formatted for Data Table component as below:

    const formattedBillboards: BillboardColumn[] =  billboards.map((item) => 
            ({
                id: item.id, 
                label: item.label, 
                createdAt:format(item.createdAt, "MMMM do, yyyy") 
            })
        )
    return (
        <>
            {/*
           
            <div className="flex justify-center text-center text-3xl absolute top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] items-center">
                
                    I thank to Allah Almgight who has granted me the wisom and means to understand this.
                
            </div> 
            */}

            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <BillboardClient data={formattedBillboards} />
                </div>
            </div>
        </>
    )
}

export default BillBoardsPage