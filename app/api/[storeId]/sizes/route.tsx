import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"


import prismadb from "@/lib/prismadb"

export async function POST(req:Request, {params}: {params : {storeId: string}}) {
    
    try{
        // First of all use Clerk to authenticate the user

        const { userId } = auth ()
        const body = await req.json()

        const { name, value } = body

        if (!userId) {
            return new NextResponse ("Unauthenticated", {status: 401})
        }

        if (!name) {
            return new NextResponse ("Name for size is rquired", {status: 400})
        }

        if (!value) {
            return new NextResponse ("A value for size is rquired", {status: 400})
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
        
        const size = await prismadb.size.create({
            data: {
                storeId: params.storeId,
                name: name,
                value: value
            }
        })
        return NextResponse.json(size)

    }
    catch (error){
        console.log ('[<api [storeId]>sizes]>-->POST()]', error)
        return new NextResponse ("Internal Error", {status: 500})
    }
}






export async function GET(req:Request, {params}: {params : {storeId: string}}) {
    
    try{

        if (!params.storeId) {
            return new NextResponse ("No store found", {status: 400})
        }

        const sizes = await prismadb.size.findMany({
            where: {
                storeId: params.storeId
            }
        })
        return NextResponse.json(sizes)

    }
    catch (error){
        console.log ('[<api [storeId]>sizes]>-->GET()]', error)
        return new NextResponse ("Internal Error", {status: 500})
    }
}