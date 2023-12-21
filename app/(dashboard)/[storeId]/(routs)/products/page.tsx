import {format} from 'date-fns'

import prismadb from "@/lib/prismadb"
import { formatter } from '@/lib/utils'

import { ProductClient } from "./components/client"
import { ProductColumn } from "./components/columns"

const ProductsPage = async ({params}: {params: {storeId: string}}) => {

    const products = await prismadb.product.findMany({
        where:{
            storeId: params.storeId 
        },
        include:{
            category:true,
            size:true,
            color:true

        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    // Instead of passing data={billboards} directly to BillboardClient, it must be properly formatted for Data Table component as below:

    const formattedProducts: ProductColumn[] =  products.map((item) => 
            ({
                id: item.id, 
                name: item.name, 
                isFeatured: item.isFeatured,
                isArchived: item.isArchived,
                price:formatter.format(item.price.toNumber()), //Used to convert Decimal(set in datbase table) price to Number
                category: item.category.name,
                size: item.size.name,
                color: item.color.value,
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
                    <ProductClient data={formattedProducts} />
                </div>
            </div>
        </>
    )
}

export default ProductsPage