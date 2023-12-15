'use client'

import {useState} from 'react'
import * as z from 'zod'
import { Trash } from "lucide-react"
import { Store } from "@prisma/client"
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { useOrigin } from '@/hooks/use-origin'

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { AlertModal } from '@/components/modals/alert-modal'
import { ApiAlert } from '@/components/ui/api-alert'


const formSchema = z.object({
    
    name: z.string().min(1)
})

type SettingsFormValues = z.infer<typeof formSchema>

interface SettingsFormProps {
    initialData: Store

}
export const SettingsForm: React.FC<SettingsFormProps> = ({initialData}) => {

    const [open, setOpen] = useState (false)
    const [loading, setLoading] = useState (false)
    const params = useParams()
    const router= useRouter()
    const origin = useOrigin()



    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    })


    const onSubmit = async (data: SettingsFormValues) =>{
        try{
            setLoading(true)
            await axios.patch(`/api/stores/${params.storeId}`, data)
            router.refresh()
            toast.success("Store updated")
        }
        catch (error) {
            toast.error ("Something went wrong.")
        }
        finally {
            setLoading(false)
        }
    }

    const onDelete = async () =>{
        try{
            setLoading(true)
            await axios.delete(`/api/stores/${params.storeId}`)
            router.refresh()
            router.push('/')
            toast.success('Store deleted')
        }
        catch (error) {
            toast.error ("Make sure you removed all products and categories first.")
        }
        finally {
            setLoading(false)
            setOpen(false)
        }
    }
    return (
        <>
        <AlertModal 
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={onDelete}
            loading = {loading}
        />
        <div className="flex items-center justify-between">
            <Heading 
                title="Settings"
                description="Manage Store Preferences"
            />
            <Button disabled={loading} variant="destructive" size="icon" onClick={()=>{setOpen(true)}}>
                <Trash className="h-4 w-4" />
            </Button>
        </div>
        <Separator />

        <Form {...form}>

            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
                <div className='grid grid-cols-3 gap-8'>
                    <FormField 
                        control={form.control}
                        name='name'
                        render={
                                ({field}) => 
                                (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input 
                                            disabled={loading}
                                            placeholder='Store Name'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )
                            }
                    />
                </div>
                <Button disabled={loading} className='ml-auto' type='submit'>
                    Submit Changes 
                </Button>
            </form>

        </Form>
        <Separator />

        {/*Following ApiAlert Component is not going to be used for 
        this project but depicts how we can show vital 
        info to user for connecting the frontend easily with the backend */}

        <ApiAlert 
            title="NEXT_PUBLIC_API_URL" 
            description={`${origin}/api/${params.storeId}`} 
            variant='public' 
        />
        </>
    )
}