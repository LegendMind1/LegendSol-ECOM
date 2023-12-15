import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"


import prismadb from "@/lib/prismadb"

export async function POST(req:Request, {params}: {params : {storeId: string}}) {
    
    try{
        // First of all use Clerk to authenticate the user

        const { userId } = auth ()
        const body = await req.json()

        const { label, imageUrl } = body

        if (!userId) {
            return new NextResponse ("Unauthenticated", {status: 401})
        }

        if (!label) {
            return new NextResponse ("Label for billboard is rquired", {status: 400})
        }

        if (!imageUrl) {
            return new NextResponse ("Image URL is rquired", {status: 400})
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
        
        const billboard = await prismadb.billboard.create({
            data: {
                storeId: params.storeId,
                label: label,
                imageUrl: imageUrl
            }
        })
        return NextResponse.json(billboard)

    }
    catch (error){
        console.log ('[<api [storeId]>billboards]>-->POST()]', error)
        return new NextResponse ("Internal Error", {status: 500})
    }
}






export async function GET(req:Request, {params}: {params : {storeId: string}}) {
    
    try{

        if (!params.storeId) {
            return new NextResponse ("No store found", {status: 400})
        }

        const billboards = await prismadb.billboard.findMany({
            where: {
                storeId: params.storeId
            }
        })
        return NextResponse.json(billboards)

    }
    catch (error){
        console.log ('[<api [storeId]>billboards]>-->GET()]', error)
        return new NextResponse ("Internal Error", {status: 500})
    }
}