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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import {
    PasswordInput
} from "@/components/ui/password-input"
import { useContext } from "react"
import { UserContext } from "@/context/UserContextProvider"


export default function AdminForm({ props }: any) {
    const baseSchema = z.object({
        name_4677073376: z.string(),
        name_4832911734: z.string(),
        name_5411977556: z.string(),
    });

    const formSchema = props ? baseSchema.partial() : baseSchema;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    const context = useContext(UserContext)

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (props) {
                const { _id, type, userName, idx } = props;
                const updatedType = values.name_4832911734 || type;
                const updatedUserName = values.name_4677073376 || userName;
                context?.updateAdmin(_id, updatedType, updatedUserName, values.name_5411977556 || "")
                    .then((res) => {
                        if (res) {
                            toast(<div>{res}</div>);
                            let data = [...context.adminsData.data];
                            if (data[idx]) {
                                data[idx] = {
                                    ...data[idx],
                                    type: updatedType,
                                    userName: updatedUserName,
                                    _id
                                };
                            }
                            context.setAdminsData({
                                ...context.adminsData,
                                data: data ?? []
                            });
                        }
                    });
            }
            else {
                context?.addAdmin(
                    values.name_4677073376 || "",
                    values.name_4832911734 || "",
                    values.name_5411977556 || ""
                ).then((res) => {
                    if (!res) return;
                    toast(<div>{res.message}</div>);
                    const newAdmin = {
                        _id: res.data._id,
                        type: res.data.type,
                        userName: res.data.userName,
                        createdAt: res.data.createdAt,
                    };
                    context.setAdminsData((prev: any) => ({
                        ...prev,
                        data: [...prev.data, newAdmin],
                        count: prev.count + 1,
                    }));
                });
            }
        } catch (error) {
            console.error("Form submission error", error);
            toast.error("Failed to submit the form. Please try again.");
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-3xl mx-auto">
                <FormField
                    control={form.control}
                    name="name_4677073376"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Username"
                                    type="text"
                                    {...field}
                                    defaultValue={props?.userName}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="name_4832911734"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={props?.type}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="analyst">Analyst</SelectItem>
                                    <SelectItem value="customerService">Customer Service</SelectItem>
                                    <SelectItem value="bookKeeper">Book Keeper</SelectItem>
                                    <SelectItem value="superAdmin">Super Admin</SelectItem>
                                    <SelectItem value="barTender">Bar Tender</SelectItem>
                                    <SelectItem value="inventoryManager">Inventory Manager</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="name_5411977556"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                {props ? "New Password" : "Password"}
                            </FormLabel>
                            <FormControl>
                                <PasswordInput {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}