import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

import prismadb from "@/lib/prismadb"

export const PATCH:any = async (req: Request, {params}: {params:{storeId:string}}) => {
    
    try{
        const { userId } = auth() 
        const body = await req.json()

        const { name } = body

        if (!userId) {
            return new NextResponse ("Unauthenticated", {status: 401})
        }

        if (!name) {
            return new NextResponse ("Name is required", {status: 400})
        }

        if (!params.storeId) {
            return new NextResponse ("Store not found", {status: 400})
        }

        //Now update the Store Name

        const store = await prismadb.store.updateMany ({
            where: {
                id: params.storeId,
                userId: userId
            },
            data: {
                name: name
            }
        })

        return NextResponse.json (store)
    }
    catch (error) {
        console.log ('[<api stores>[storeId]>-->PATCH()]', error)
        return new NextResponse ("Internal Error", {status: 500})
    }
}




export const DELETE:any = async (req: Request, {params}: {params:{storeId:string}}) => {
    
    try{
        const { userId } = auth() 
        // const body = await req.json()

        // const { name } = body


        if (!userId) {
            return new NextResponse ("Unauthenticated", {status: 401})
        }


        if (!params.storeId) {
            return new NextResponse ("Store not found", {status: 400})
        }

        //Now update the Store Name

        const store = await prismadb.store.deleteMany ({
            where: {
                id: params.storeId,
                userId: userId
            }
        })

        return NextResponse.json (store)
    }
    catch (error) {
        console.log ('[<api stores>[storeId]>-->DELETE()]', error)
        return new NextResponse ("Internal Error", {status: 500})
    }
}