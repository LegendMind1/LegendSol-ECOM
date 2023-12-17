import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"


import prismadb from "@/lib/prismadb"

export async function POST(req:Request, {params}: {params : {storeId: string}}) {
    
    try{
        // First of all use Clerk to authenticate the user

        const { userId } = auth ()
        const body = await req.json()

        const { name, billboardId } = body

        if (!userId) {
            return new NextResponse ("Unauthenticated", {status: 401})
        }

        if (!name) {
            return new NextResponse ("Name for category is rquired", {status: 400})
        }

        if (!billboardId) {
            return new NextResponse ("Billboard Id is rquired", {status: 400})
        }

        if (!params.storeId) {
            return new NextResponse ("No store found", {status: 400})
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
        
        const category = await prismadb.category.create({
            data: {
                storeId: params.storeId,
                billboardId: billboardId,
                name: name,
            }
        })
        return NextResponse.json(category)

    }
    catch (error){
        console.log ('[<api [storeId]>categories]>-->POST()]', error)
        return new NextResponse ("Internal Error", {status: 500})
    }
}






export async function GET(req:Request, {params}: {params : {storeId: string}}) {
    
    try{

        if (!params.storeId) {
            return new NextResponse ("No store found", {status: 400})
        }

        const categories = await prismadb.category.findMany({
            where: {
                storeId: params.storeId
            }
        })
        return NextResponse.json(categories)
        

    }
    catch (error){
        console.log ('[<api [storeId]>categories]>-->GET()]', error)
        return new NextResponse ("Internal Error", {status: 500})
    }
}