'use client'

import {useState} from 'react'
import * as z from 'zod'
import { Trash } from "lucide-react"
import { Category, Billboard } from "@prisma/client"
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { AlertModal } from '@/components/modals/alert-modal'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { SelectValue } from '@radix-ui/react-select'


const formSchema = z.object({
    
    name: z.string().min(1),
    billboardId: z.string().min(1),
})

type CategoryFormValues = z.infer<typeof formSchema>

interface CategoryFormProps {
    initialData: Category | null
    billboards: Billboard[]
    
}


export const CategoryForm: React.FC<CategoryFormProps> = ({initialData, billboards}) => {

    const [open, setOpen] = useState (false)
    const [loading, setLoading] = useState (false)
    const params = useParams()
    const router= useRouter()
    // const origin = useOrigin()  Used ApiAlert to show API Alert Box at the bottom


    const title = initialData ? "Edit Category" : "Create Category"
    const description = initialData ? "Edit a Category" : "Add a new Category"
    const toastMessage = initialData ? "Category updated." : "Category created."
    const action = initialData ? "Save changes" : "Create"

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            billboardId: ''
        }
    })


    const onSubmit = async (data: CategoryFormValues) =>{
        try{
            setLoading(true)
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, data)
            } else {
                await axios.post(`/api/${params.storeId}/categories`, data)
            }
            router.refresh()
            router.push(`/${params.storeId}/categories`)
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
            await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`)
            router.refresh()
            router.push(`/${params.storeId}/categories`)
            router.refresh()
            toast.success('Category deleted')
        }
        catch (error) {
            toast.error ("Make sure you removed all products that are using this category first.")
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
                <Button disabled={loading} variant="destructive" size="icon" onClick={()=>{setOpen(true)}}>
                    <Trash className="h-4 w-4" />
                </Button>
            )}
            {/* ----------------------------------------------------------- */}
        </div>
        <Separator />

        <Form {...form}>

            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
                
                <div className='grid grid-cols-3 gap-8 mt-5'>
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
                                            placeholder='Category name'
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
                        name='billboardId'
                        render={
                                ({field}) => 
                                (
                                <FormItem>
                                    <FormLabel>Choose Billboard</FormLabel>
                                    <Select 
                                        disabled={loading} 
                                        onValueChange={field.onChange} 
                                        value={field.value} 
                                        defaultValue={field.value}
                                    >
                                        <FormControl className='h-[60px]'>
                                            <SelectTrigger>
                                                <SelectValue 
                                                    defaultValue={field.value} 
                                                    placeholder='Select a billboard' 
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {billboards.map((item) => (
                                                <SelectItem key={item.id} value={item.id}>
                                                    <div className='flex justify-between w-[270px] items-center'>
                                                        {item.label}
                                                        <img src={item.imageUrl} className='h-auto w-[50px]' />
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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
       
    </>
    )
}