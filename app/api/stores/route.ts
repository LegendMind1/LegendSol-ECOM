import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"


import prismadb from "@/lib/prismadb"

export async function POST(req:Request) {
    
    try{
        // First of all use Clerk to authenticate the user

        const { userId } = auth ()
        const body = await req.json()

        const { name } = body

        if (!userId) {
            return new NextResponse ("Unautherized", {status: 401})
        }

        if (!name) {
            return new NextResponse ("Name is rquired", {status: 400})
        }

        
        const store = await prismadb.store.create({
            data: {
                name,
                userId
            }
        })
        
        return NextResponse.json(store)

    }
    catch (error){
        console.log ('[<api stores>-->POST()]', error)
        return new NextResponse ("Internal Error", {status: 500})
    }
}