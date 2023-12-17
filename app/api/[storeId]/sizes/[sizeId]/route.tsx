import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

import prismadb from "@/lib/prismadb"





export const GET:any = async (req: Request, {params}: {params:{sizeId:string}}) => {
    
    try{

        if (!params.sizeId) {
            return new NextResponse ("Size Id is required", {status: 400})
        }

        const size = await prismadb.size.findUnique ({
            where: {
                id: params.sizeId
            }
        })

        return NextResponse.json (size)
    }
    catch (error) {
        console.log ('[<api [storeId]>size>[sizeId]]>-->GET()]', error)
        return new NextResponse ("Internal Error", {status: 500})
    }
}










export const PATCH:any = async (req: Request, {params}: {params:{storeId: string, sizeId:string}}) => {
    
    try{
        const { userId } = auth() 
        const body = await req.json()

        const { name, value } = body


        if (!userId) {
            return new NextResponse ("Unauthenticated", {status: 401})
        }

        if (!name) {
            return new NextResponse ("Name for size is required", {status: 400})
        }

        if (!value) {
            return new NextResponse ("A value for size  is required", {status: 400})
        }

        if (!params.storeId) {
            return new NextResponse ("Store Id is required", {status: 400})
        }

        if (!params.sizeId) {
            return new NextResponse ("Size Id is required", {status: 400})
        }

         /* The following check makes sure that this user can only create billboard in his own store */
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

        const size = await prismadb.size.updateMany ({
            where: {
                id: params.sizeId
            },
            data: {
                name: name,
                value: value
            }
        })

        return NextResponse.json (size)
    }
    catch (error) {
        console.log ('[<api [storeId]>billboards>[sizeId]]>-->PATCH()]', error)
        return new NextResponse ("Internal Error", {status: 500})
    }
}












export const DELETE:any = async (req: Request, {params}: {params:{storeId:string, sizeId:string}}) => {
    
    try{
        const { userId } = auth() 
        // const body = await req.json()

        // const { name } = body


        if (!userId) {
            return new NextResponse ("Unauthenticated", {status: 401})
        }


        if (!params.sizeId) {
            return new NextResponse ("Size Id is required", {status: 400})
        }

        /* The following check makes sure that this user can only create billboard in his own store */
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

        const size = await prismadb.size.deleteMany ({
            where: {
                id: params.sizeId
            }
        })

        return NextResponse.json (size)
    }
    catch (error) {
        console.log ('[<api [storeId]>billboards>[sizeId]]>-->DELETE()]', error)
        return new NextResponse ("Internal Error", {status: 500})
    }
}