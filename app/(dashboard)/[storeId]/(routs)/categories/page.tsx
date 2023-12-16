import {format} from 'date-fns'
import prismadb from "@/lib/prismadb"

import { CategoryClient } from "./components/client"
import { CategoryColumn } from "./components/columns"

const CategoriesPage = async ({params}: {params: {storeId: string}}) => {

    const categories = await prismadb.category.findMany({
        where:{
            storeId: params.storeId 
        },
        include:{
            billboard:true
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    // Instead of passing data={categories} directly to BillboardClient, it must be properly formatted for Data Table component as below:

    const formattedCategories: CategoryColumn[] =  categories.map((item) => 
            ({
                id: item.id, 
                name: item.name, 
                billboardLabel: item.billboard.label,
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
                    <CategoryClient data={formattedCategories} />
                </div>
            </div>
        </>
    )
}

export default CategoriesPage