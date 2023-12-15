import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

import prismadb from "@/lib/prismadb"





export const GET:any = async (req: Request, {params}: {params:{billboardId:string}}) => {
    
    try{

        if (!params.billboardId) {
            return new NextResponse ("Billboard Id is required", {status: 400})
        }

        const billboard = await prismadb.billboard.findUnique ({
            where: {
                id: params.billboardId
            }
        })

        return NextResponse.json (billboard)
    }
    catch (error) {
        console.log ('[<api [storeId]>billboards>[billboardId]]>-->GET()]', error)
        return new NextResponse ("Internal Error", {status: 500})
    }
}










export const PATCH:any = async (req: Request, {params}: {params:{storeId: string, billboardId:string}}) => {
    
    try{
        const { userId } = auth() 
        const body = await req.json()

        const { label, imageUrl } = body


        if (!userId) {
            return new NextResponse ("Unauthenticated", {status: 401})
        }

        if (!label) {
            return new NextResponse ("Name is required", {status: 400})
        }

        if (!imageUrl) {
            return new NextResponse ("Image URL is required", {status: 400})
        }

        if (!params.storeId) {
            return new NextResponse ("Store Id is required", {status: 400})
        }

        if (!params.billboardId) {
            return new NextResponse ("Billboard Id is required", {status: 400})
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

        const billboard = await prismadb.billboard.updateMany ({
            where: {
                id: params.billboardId
            },
            data: {
                label: label,
                imageUrl: imageUrl
            }
        })

        return NextResponse.json (billboard)
    }
    catch (error) {
        console.log ('[<api [storeId]>billboards>[billboardId]]>-->PATCH()]', error)
        return new NextResponse ("Internal Error", {status: 500})
    }
}












export const DELETE:any = async (req: Request, {params}: {params:{storeId:string, billboardId:string}}) => {
    
    try{
        const { userId } = auth() 
        // const body = await req.json()

        // const { name } = body


        if (!userId) {
            return new NextResponse ("Unauthenticated", {status: 401})
        }


        if (!params.billboardId) {
            return new NextResponse ("Billboard Id is required", {status: 400})
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

        const billboard = await prismadb.billboard.deleteMany ({
            where: {
                id: params.billboardId
            }
        })

        return NextResponse.json (billboard)
    }
    catch (error) {
        console.log ('[<api [storeId]>billboards>[billboardId]]>-->DELETE()]', error)
        return new NextResponse ("Internal Error", {status: 500})
    }
}