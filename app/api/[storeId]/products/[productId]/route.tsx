import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

import prismadb from "@/lib/prismadb"





export const GET:any = async (req: Request, {params}: {params:{productId:string}}) => {
    
    try{

        if (!params.productId) {
            return new NextResponse ("Product Id is required", {status: 400})
        }

        const product = await prismadb.product.findUnique ({
            where: {
                id: params.productId
            },
            include: {
                images: true,
                category: true,
                size: true,
                color: true,
            }
        })

        return NextResponse.json (product)
    }
    catch (error) {
        console.log ('[<api [storeId]>products>[productId]]>-->GET()]', error)
        return new NextResponse ("Internal Error", {status: 500})
    }
}










export const PATCH:any = async (req: Request, {params}: {params:{storeId: string, productId:string}}) => {
    
    try{
        const { userId } = auth() 
        const body = await req.json()

        const { name, price, categoryId, sizeId, colorId, isFeatured, isArchived, images } = body


        if (!userId) {
            return new NextResponse ("Unauthenticated", {status: 401})
        }

        if (!name) {
            return new NextResponse ("Name for product is rquired", {status: 400})
        }

        if (!price) {
            return new NextResponse ("Price is rquired", {status: 400})
        }
        
        if (!categoryId) {
            return new NextResponse ("Category Id for the product is rquired", {status: 400})
        }
        
        if (!sizeId) {
            return new NextResponse ("Size Id for the product is rquired", {status: 400})
        }
        
        if (!colorId) {
            return new NextResponse ("Color Id for the product is rquired", {status: 400})
        }
        
        if (!images || !images.length) {
            return new NextResponse ("At least one image for the product is rquired", {status: 400})
        }


        if (!params.storeId) {
            return new NextResponse ("Store Id is required", {status: 400})
        }

        if (!params.productId) {
            return new NextResponse ("Product Id is required", {status: 400})
        }

         /* The following check makes sure that this user can only create product in his own store */
         const storeByUserId = await prismadb.store.findFirst({

            where: {
                id: params.storeId,
                userId: userId
            }
        })
        if (!storeByUserId){
            return new NextResponse ("Unauthorized", {status: 403})
        }
        /* =================================================================== */

        await prismadb.product.update ({  // First do a general query to just update the product and delete all images, (FindMany resulted in an error in images updation)
            where: {
                id: params.productId
            },
            data: {
                name: name,
                price: price,
                categoryId: categoryId,
                sizeId: sizeId,
                colorId: colorId,
                isFeatured: isFeatured,
                isArchived: isArchived,
                images: {
                    deleteMany:{}
                },
            }
        })

        const product = await prismadb.product.update({ //Now create all images again
            where:{
                id: params.productId
            },
            data: {
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: {url: string}) => image)
                        ]
                    }
                }
            }
        })

        return NextResponse.json (product)
    }
    catch (error) {
        console.log ('[<api [storeId]>products>[productId]]>-->PATCH()]', error)
        return new NextResponse ("Internal Error", {status: 500})
    }
}












export const DELETE:any = async (req: Request, {params}: {params:{storeId:string, productId:string}}) => {
    
    try{
        const { userId } = auth() 
        // const body = await req.json()

        // const { name } = body


        if (!userId) {
            return new NextResponse ("Unauthenticated", {status: 401})
        }


        if (!params.productId) {
            return new NextResponse ("Product Id is required", {status: 400})
        }

        /* The following check makes sure that this user can only create product in his own store */
        const storeByUserId = await prismadb.store.findFirst({

            where: {
                id: params.storeId,
                userId: userId
            }
        })
        if (!storeByUserId){
            return new NextResponse ("Unauthorized", {status: 403})
        }
        /* =================================================================== */

        const product = await prismadb.product.deleteMany ({
            where: {
                id: params.productId
            }
        })

        return NextResponse.json (product)
    }
    catch (error) {
        console.log ('[<api [storeId]>products>[productId]]>-->DELETE()]', error)
        return new NextResponse ("Internal Error", {status: 500})
    }
}