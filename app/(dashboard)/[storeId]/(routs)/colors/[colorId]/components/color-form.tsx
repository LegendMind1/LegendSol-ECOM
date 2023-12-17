'use client'

import {useState} from 'react'
import * as z from 'zod'
import { Trash } from "lucide-react"
import { Color } from "@prisma/client"
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
// import { useOrigin } from '@/hooks/use-origin'

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { AlertModal } from '@/components/modals/alert-modal'
// import { ApiAlert } from '@/components/ui/api-alert'
// import ImageUpload from '@/components/ui/image-upload'


const formSchema = z.object({
    
    name: z.string().min(1),
    value: z.string().min(1)
})

type ColorFormValues = z.infer<typeof formSchema>

interface ColorFormProps {
    initialData: Color | null
    
}


export const ColorForm: React.FC<ColorFormProps> = ({initialData}) => {

    const [open, setOpen] = useState (false)
    const [loading, setLoading] = useState (false)
    const params = useParams()
    const router= useRouter()
    // const origin = useOrigin()  Used ApiAlert to show API Alert Box at the bottom


    const title = initialData ? "Edit Color" : "Create Color"
    const description = initialData ? "Edit a Color" : "Add a new Color"
    const toastMessage = initialData ? "Color updated." : "Color created."
    const action = initialData ? "Save changes" : "Create"

    const form = useForm<ColorFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            value: ''
        }
    })


    const onSubmit = async (data: ColorFormValues) =>{
        try{
            setLoading(true)
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, data)
            } else {
                await axios.post(`/api/${params.storeId}/colors`, data)
            }
            router.refresh()
            router.push(`/${params.storeId}/colors`)
            router.refresh()
            toast.success(toastMessage)
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
            await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`)
            router.refresh()
            router.push(`/${params.storeId}/colors`)
            router.refresh()
            toast.success('Color deleted')
        }
        catch (error) {
            toast.error ("Make sure you removed all products that are using this color.")
        }
        finally {
            setLoading(false)
            setOpen(false)
        }
    }
    return (
    <>
    <div className='h-screen'>
        <AlertModal 
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={onDelete}
            loading = {loading}
        />
        <div className="flex items-center justify-between">
            <Heading 
                title={title}
                description={description}
            />

            {/* Render this delete button only when initialData is present */}
            {initialData && (
                <Button disabled={loading} variant="destructive" color="icon" onClick={()=>{setOpen(true)}}>
                    <Trash className="h-4 w-4" />
                </Button>
            )}
            {/* ----------------------------------------------------------- */}
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
                                            placeholder='Color name'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )
                            }
                    />

                    <FormField 
                        control={form.control}
                        name='value'
                        render={
                                ({field}) => 
                                (
                                <FormItem>
                                    <FormLabel>Color Value</FormLabel>
                                    <FormControl>
                                        <Input 
                                            disabled={loading}
                                            placeholder='Give Color value'
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
                    {action} 
                </Button>
            </form>

        </Form>
    </div>
        {/* <Separator /> */}

        {/*Following ApiAlert Component is not going to be used for 
        this project but depicts how we can show vital 
        info to user for connecting the frontend easily with the backend

        <ApiAlert 
            title="NEXT_PUBLIC_API_URL" 
            description={`${origin}/api/${params.storeId}`} 
            variant='public' 
        />
        */}
        </>
    )
}