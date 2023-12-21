import {format} from 'date-fns'
import prismadb from "@/lib/prismadb"
import { formatter } from '@/lib/utils'

import { OrderClient } from "./components/client"
import { OrderColumn } from "./components/columns"

const OrdersPage = async ({params}: {params: {storeId: string}}) => {

    const orders = await prismadb.order.findMany({
        where:{
            storeId: params.storeId 
        },
        include: {
            orderItems:{
                include:{
                    product:true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    // Instead of passing data={orders} directly to OrderClient, it must be properly formatted for Data Table component as below:

    const formattedOrders: OrderColumn[] =  orders.map((item) => 
            ({
                id: item.id, 
                phone: item.phone,
                address: item.address,
                products: item.orderItems.map((orderItem)=>orderItem.product.name).join(', '),
                totalPrice: formatter.format(item.orderItems.reduce((total, item)=>{
                    return (
                        total + Number (item.product.price)
                    )
                },0)),
                isPaid: item.isPaid,
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
                    <OrderClient data={formattedOrders} />
                </div>
            </div>
        </>
    )
}

export default OrdersPage