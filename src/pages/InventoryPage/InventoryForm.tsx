"use client"
import {
    toast
} from "sonner"
import {
    useForm
} from "react-hook-form"
import {
    zodResolver
} from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Button
} from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Input
} from "@/components/ui/input"
import { useContext } from "react"
import { UserContext } from "@/context/UserContextProvider"

export default function MyForm(props: any) {

    const baseSchema = z.object({
        itemName: z.string().min(1),
        brand: z.string().min(1),
        type: z.string().min(1),
        qty: z.string().min(1),
        price: z.string().min(1)
    })

    const formSchema = props ? baseSchema.partial() : baseSchema;

    const context = useContext(UserContext)

    const form = useForm<z.infer<typeof formSchema>>({ resolver: zodResolver(formSchema), })

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (props?.props?.name) {
                context?.updateItem(
                    props?.props?._id,
                    {
                        name: values.itemName || props?.props?.name,
                        brand: values.brand || props?.props?.brand,
                        type: values.type || props?.props?.type,
                        qty: values.qty || props?.props?.qty,
                        price: values.price || props?.props?.price
                    }
                ).then((res) => {
                    if (res) {
                        toast(<div>{res}</div>);
                    }
                })
            }
            else {
                context?.addItem(
                    values.itemName || "",
                    values.brand || "",
                    values.type || "",
                    values.qty || "",
                    values.price || ""
                ).then((res) => {
                    if (res) {
                        toast(<div>{res}</div>);
                    }
                })
            }
        } catch (error) {
            console.error("Form submission error", error);
            toast.error("Failed to submit the form. Please try again.");
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 max-w-3xl mx-auto py-1">

                <FormField
                    control={form.control}
                    name="itemName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder=""
                                    defaultValue={props?.props?.name}
                                    type="text"
                                    autoComplete="off"  
                                    {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Brand</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder=""
                                    defaultValue={props?.props?.brand}
                                    type="text"
                                    autoComplete="off"  
                                    {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Type</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder=""
                                    defaultValue={props?.props?.type}
                                    type="text"
                                    autoComplete="off"  
                                    {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-12 gap-4">

                    <div className="col-span-6">

                        <FormField
                            control={form.control}
                            name="qty"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Quantity</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder=""
                                            defaultValue={props?.props?.qty}
                                            type="number"
                                            autoComplete="off"  
                                            {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="col-span-6">

                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder=""
                                            defaultValue={props?.props?.price}
                                            type="number"
                                            autoComplete="off"  
                                            {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                </div>
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}