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
            return new NextResponse ("Name for color is rquired", {status: 400})
        }

        if (!value) {
            return new NextResponse ("A hex-value for color is rquired", {status: 400})
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
        
        const color = await prismadb.color.create({
            data: {
                storeId: params.storeId,
                name: name,
                value: value
            }
        })
        return NextResponse.json(color)

    }
    catch (error){
        console.log ('[<api [storeId]>colors]>-->POST()]', error)
        return new NextResponse ("Internal Error", {status: 500})
    }
}






export async function GET(req:Request, {params}: {params : {storeId: string}}) {
    
    try{

        if (!params.storeId) {
            return new NextResponse ("No store found", {status: 400})
        }

        const colors = await prismadb.color.findMany({
            where: {
                storeId: params.storeId
            }
        })
        return NextResponse.json(colors)

    }
    catch (error){
        console.log ('[<api [storeId]>colors]>-->GET()]', error)
        return new NextResponse ("Internal Error", {status: 500})
    }
}