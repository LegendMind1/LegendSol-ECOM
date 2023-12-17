import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

import prismadb from "@/lib/prismadb"





export const GET:any = async (req: Request, {params}: {params:{colorId:string}}) => {
    
    try{

        if (!params.colorId) {
            return new NextResponse ("Color Id is required", {status: 400})
        }

        const color = await prismadb.color.findUnique ({
            where: {
                id: params.colorId
            }
        })

        return NextResponse.json (color)
    }
    catch (error) {
        console.log ('[<api [storeId]>color>[colorId]]>-->GET()]', error)
        return new NextResponse ("Internal Error", {status: 500})
    }
}










export const PATCH:any = async (req: Request, {params}: {params:{storeId: string, colorId:string}}) => {
    
    try{
        const { userId } = auth() 
        const body = await req.json()

        const { name, value } = body


        if (!userId) {
            return new NextResponse ("Unauthenticated", {status: 401})
        }

        if (!name) {
            return new NextResponse ("Name for color is required", {status: 400})
        }

        if (!value) {
            return new NextResponse ("A value for color is required", {status: 400})
        }

        if (!params.storeId) {
            return new NextResponse ("Store Id is required", {status: 400})
        }

        if (!params.colorId) {
            return new NextResponse ("Color Id is required", {status: 400})
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

        const color = await prismadb.color.updateMany ({
            where: {
                id: params.colorId
            },
            data: {
                name: name,
                value: value
            }
        })

        return NextResponse.json (color)
    }
    catch (error) {
        console.log ('[<api [storeId]>billboards>[colorId]]>-->PATCH()]', error)
        return new NextResponse ("Internal Error", {status: 500})
    }
}












export const DELETE:any = async (req: Request, {params}: {params:{storeId:string, colorId:string}}) => {
    
    try{
        const { userId } = auth() 
        // const body = await req.json()

        // const { name } = body


        if (!userId) {
            return new NextResponse ("Unauthenticated", {status: 401})
        }


        if (!params.colorId) {
            return new NextResponse ("color Id is required", {status: 400})
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

        const color = await prismadb.color.deleteMany ({
            where: {
                id: params.colorId
            }
        })

        return NextResponse.json (color)
    }
    catch (error) {
        console.log ('[<api [storeId]>billboards>[colorId]]>-->DELETE()]', error)
        return new NextResponse ("Internal Error", {status: 500})
    }
}