import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

import prismadb from "@/lib/prismadb"





export const GET:any = async (req: Request, {params}: {params:{categoryId:string}}) => {
    
    try{

        if (!params.categoryId) {
            return new NextResponse ("Category Id is required", {status: 400})
        }

        const category = await prismadb.category.findUnique ({
            where: {
                id: params.categoryId
            }
        })

        return NextResponse.json (category)
    }
    catch (error) {
        console.log ('[<api [storeId]>categoryies>[categoryId]]>-->GET()]', error)
        return new NextResponse ("Internal Error", {status: 500})
    }
}










export const PATCH:any = async (req: Request, {params}: {params:{storeId: string, categoryId:string}}) => {
    
    try{
        const { userId } = auth() 
        const body = await req.json()

        const { name, billboardId } = body


        if (!userId) {
            return new NextResponse ("Unauthenticated", {status: 401})
        }

        if (!name) {
            return new NextResponse ("Name is required", {status: 400})
        }

        if (!billboardId) {
            return new NextResponse ("Billboard Id is required", {status: 400})
        }

        if (!params.storeId) {
            return new NextResponse ("Store Id is required", {status: 400})
        }

        if (!params.categoryId) {
            return new NextResponse ("category Id is required", {status: 400})
        }

         /* The following check makes sure that this user can only create category in his own store */
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

        const category = await prismadb.category.updateMany ({
            where: {
                id: params.categoryId
            },
            data: {
                name: name,
                billboardId: billboardId
            }
        })

        return NextResponse.json (category)
    }
    catch (error) {
        console.log ('[<api [storeId]>categories>[categoryId]]>-->PATCH()]', error)
        return new NextResponse ("Internal Error", {status: 500})
    }
}












export const DELETE:any = async (req: Request, {params}: {params:{storeId:string, categoryId:string}}) => {
    
    try{
        const { userId } = auth() 
        // const body = await req.json()

        // const { name } = body


        if (!userId) {
            return new NextResponse ("Unauthenticated", {status: 401})
        }


        if (!params.categoryId) {
            return new NextResponse ("Category Id is required", {status: 400})
        }

        /* The following check makes sure that this user can only create category in his own store */
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

        const category = await prismadb.category.deleteMany ({
            where: {
                id: params.categoryId
            }
        })

        return NextResponse.json (category)
    }
    catch (error) {
        console.log ('[<api [storeId]>categorys>[categoryId]]>-->DELETE()]', error)
        return new NextResponse ("Internal Error", {status: 500})
    }
}