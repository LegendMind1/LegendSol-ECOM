'use client'

import {useState} from 'react'
import * as z from 'zod'
import { Trash } from "lucide-react"
import { Category, Color, Image, Product, Size } from "@prisma/client"
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { useOrigin } from '@/hooks/use-origin'

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { AlertModal } from '@/components/modals/alert-modal'
// import { ApiAlert } from '@/components/ui/api-alert'
import ImageUpload from '@/components/ui/image-upload'
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'


const formSchema = z.object({
    
    categoryId: z.string().min(1),
    name: z.string().min(1),
    price: z.coerce.number().min(1),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional(),
    sizeId: z.string().min(1),
    colorId: z.string().min(1),
    images: z.object({url: z.string()}).array(),
})

type ProductFormValues = z.infer<typeof formSchema>

interface ProductFormProps {
    initialData: Product & {images: Image[]} | null
    categories: Category[]
    sizes: Size[]
    colors: Color[]
}


export const ProductForm: React.FC<ProductFormProps> = ({initialData, categories, colors, sizes}) => {

    const [open, setOpen] = useState (false)
    const [loading, setLoading] = useState (false)
    const params = useParams()
    const router= useRouter()
    // const origin = useOrigin()  Used ApiAlert to show API Alert Box at the bottom


    const title = initialData ? "Edit Product" : "Create Product"
    const description = initialData ? "Edit a Product" : "Add a new Product"
    const toastMessage = initialData ? "Product updated." : "Product created."
    const action = initialData ? "Save changes" : "Create"

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {...initialData, price: parseFloat(String(initialData?.price))}: {
            // The above initiaData means that if initialData is empty then that's fine but if it is coming in then we will have to modify price a little bit since in the Database price type is Decimal and here has to be float, we will have to go around that using this trick.
            categoryId: '',
            name: '',
            price: 0,
            isFeatured: false,
            isArchived: false,
            sizeId: '',
            colorId: '',
            images: [],
        }
    })


    const onSubmit = async (data: ProductFormValues) =>{
        try{
            setLoading(true)
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data)
            } else {
                await axios.post(`/api/${params.storeId}/products`, data)
            }
            router.refresh()
            router.push(`/${params.storeId}/products`)
            toast.success(toastMessage)
            router.refresh()
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
            await axios.delete(`/api/${params.storeId}/products/${params.productId}`)
            router.refresh()
            router.push(`/${params.storeId}/products`)
            toast.success('Product deleted')
            router.refresh()
        }
        catch (error) {
            toast.error ("Something went wrong. Contact the support at LegendSol please.")
        }
        finally {
            setLoading(false)
            setOpen(false)
        }
    }
    return (
    <>
    <div>
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
                
                <FormField 
                    control={form.control}
                    name='images'
                    render={
                            ({field}) => 
                            (
                            <FormItem>
                                <FormLabel>Products Images</FormLabel>
                                <FormControl>
                                    <ImageUpload 
                                        // value={field.value ? [field.value] : []}
                                        value={field.value.map((image)=> image.url)}
                                        disabled={loading}
                                        onChange={(url) => field.onChange([...field.value, {url}]) }
                                        onRemove={(url) => field.onChange([...field.value.filter((current)=>current.url !== url )])}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )
                        }
                />
                <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
                    <FormField 
                        control={form.control}
                        name='name'
                        render={
                                ({field}) => 
                                (
                                <FormItem>
                                    <FormLabel>Product Name</FormLabel>
                                    <FormControl>
                                        <Input 
                                            disabled={loading}
                                            placeholder='Product label'
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
                        name='price'
                        render={
                                ({field}) => 
                                (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input 
                                            disabled={loading}
                                            placeholder='9.99'
                                            type='number'
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
                        name='categoryId'
                        render={
                                ({field}) => 
                                (
                                <FormItem>
                                    <FormLabel>Select a Category</FormLabel>
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
                                                    placeholder='Select a category' 
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((item) => (
                                                <SelectItem key={item.id} value={item.id}>
                                                        {item.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )
                            }
                    />


                    <FormField 
                        control={form.control}
                        name='sizeId'
                        render={
                                ({field}) => 
                                (
                                <FormItem>
                                    <FormLabel>Size</FormLabel>
                                    <Select 
                                        disabled={loading} 
                                        onValueChange={field.onChange} 
                                        value={field.value} 
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue 
                                                    defaultValue={field.value} 
                                                    placeholder='Select a size' 
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {sizes.map((item) => (
                                                <SelectItem key={item.id} value={item.id}>
                                                        {item.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )
                            }
                    />

                    <FormField 
                        control={form.control}
                        name='colorId'
                        render={
                                ({field}) => 
                                (
                                <FormItem>
                                    <FormLabel>color</FormLabel>
                                    <Select 
                                        disabled={loading} 
                                        onValueChange={field.onChange} 
                                        value={field.value} 
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue 
                                                    defaultValue={field.value} 
                                                    placeholder='Select a color' 
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {colors.map((item) => (
                                                <SelectItem key={item.id} value={item.id}>
                                                        <div className='flex justify-between w-[200px] items-center'>
                                                            <span className='block'>
                                                                {item.name}
                                                            </span>
                                                            <span>
                                                                {item.value}
                                                            </span>
                                                            <span className='block w-8 h-8 rounded-full border-2' style={{backgroundColor: item.value}}>
                                                                
                                                            </span>
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


                    <FormField 
                        control={form.control}
                        name='isFeatured'
                        render={
                                ({field}) => 
                                (
                                <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <div className='space-y-1 leading-none'>
                                        <FormLabel>
                                            Featured
                                        </FormLabel>
                                        <FormDescription>
                                            This product will appear on the home page.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                                )
                            }
                    />


                    <FormField 
                        control={form.control}
                        name='isArchived'
                        render={
                                ({field}) => 
                                (
                                <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <div className='space-y-1 leading-none'>
                                        <FormLabel>
                                            Archived
                                        </FormLabel>
                                        <FormDescription>
                                            This product will not appear anywhere in the store.
                                        </FormDescription>
                                    </div>
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