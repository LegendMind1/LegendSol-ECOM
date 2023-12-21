import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"


import prismadb from "@/lib/prismadb"

export async function POST(req:Request, {params}: {params : {storeId: string}}) {
    
    try{
        // First of all use Clerk to authenticate the user

        const { userId } = auth ()
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
            return new NextResponse ("No store found", {status: 400})
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
        
        const product = await prismadb.product.create({
            data: {
                storeId: params.storeId,
                name: name,
                price: price,
                categoryId: categoryId,
                sizeId: sizeId,
                colorId: colorId,
                isFeatured: isFeatured,
                isArchived: isArchived,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: {url: string}) => image )
                        ]
                    }
                }
            }
        })
        return NextResponse.json(product)

    }
    catch (error){
        console.log ('[<api [storeId]>products]>-->POST()]', error)
        return new NextResponse ("Internal Error", {status: 500})
    }
}








export async function GET(req:Request, {params}: {params : {storeId: string}}) {
    

// The GET gonna be used heavily by the Frontend so I gonna make it enough filtered.

    try{
        const {searchParams} = new URL (req.url)

        const categoryId = searchParams.get("categoryId") || undefined
        const sizeId = searchParams.get("sizeId") || undefined
        const colorId = searchParams.get("colorId") || undefined
        const isFeatured = searchParams.get("isFeatured")  // Doesn't need undefined already have default value of false
        const isArchived = searchParams.get("isArchived")  // Doesn't need undefined already have default value of false
        //Here we can add filters for price range too
    
        if (!params.storeId) {
            return new NextResponse ("No store found", {status: 400})
        }

        const products = await prismadb.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId: categoryId,
                sizeId: sizeId,
                colorId: colorId,
                isFeatured: isFeatured ? true : undefined, // Value of undefined instead of false is used so that query may completely ignore this filter
                isArchived: false //We never want to load products for Frontend which have been archived
            },
            include: {  //Include all the other necessary database tables as well
                images:true,
                category: true,
                size: true,
            },
            orderBy: {
                createdAt: 'desc'  // So that we can alwayes have latest products to be displayed at the top.
            }
        })
        return NextResponse.json(products)

    }
    catch (error){
        console.log ('[<api [storeId]>products]>-->GET()]', error)
        return new NextResponse ("Internal Error", {status: 500})
    }
}