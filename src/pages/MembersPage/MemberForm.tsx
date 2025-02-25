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
import {
    PasswordInput
} from "@/components/ui/password-input"
import { useContext } from "react"
import { UserContext } from "@/context/UserContextProvider"


export default function MemberForm(props: any) {

    const baseSchema = z.object({
        userName: z.string().min(1),
        contact: z.string().min(1).min(10).max(10),
        email: z.string(),
        photo: z.any().optional(),
        password: z.string()
    });

    const formSchema = props ? baseSchema.partial() : baseSchema;

    const context = useContext(UserContext)

    const form = useForm<z.infer<typeof formSchema>>({ resolver: zodResolver(formSchema), })

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (props?.props?.userName) {
                context?.updateMember(
                    props?.props?._id,
                    values.photo || props?.props?.photo,
                    "updateAc",
                    {
                        userName: values.userName || "",
                        contact: values.contact || "",
                        email: values.email || "",
                        password: values.password || "",
                    }
                ).then((res) => {
                    if (res) {
                        toast(<div>{res}</div>);
                    }
                })
            }
            else {
                context?.addMember(
                    values.userName || "",
                    values.password || "",
                    values.contact || "",
                    values.email || "",
                    4000,
                    values.photo || null,
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 max-w-3xl mx-auto">
                <FormField
                    control={form.control}
                    name="userName"
                    defaultValue={props?.props?.userName}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder=""

                                    type="text"
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
                            name="contact"
                            defaultValue={(props?.props?.contact).toString()}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contact</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder=""
                                            type="text"
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
                            name="email"
                            defaultValue={props?.props?.email}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder=""

                                            type="email"
                                            {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-6">
                        <FormField
                            control={form.control}
                            name="photo"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Image</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(event) => {
                                                const file = event.target.files?.[0];
                                                form.setValue("photo", file, { shouldValidate: true });
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="col-span-6">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <PasswordInput {...field} />
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