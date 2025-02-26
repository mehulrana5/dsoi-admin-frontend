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
import { Label } from "@/components/ui/label"
import { useContext, useState } from "react"
import { UserContext } from "@/context/UserContextProvider"


export default function FamilyForm(props: any) {
    const baseSchema = z.object({
        userName: z.string().min(1),
        type: z.string(),
        photo: z.any().optional(),
    })

    const formSchema = props ? baseSchema.partial() : baseSchema;

    const context = useContext(UserContext)
    const [mc, setMc] = useState<any>("")
    const [mid, setMid] = useState<any>("")
    const [dob, setDob] = useState<any>("")

    const form = useForm<z.infer<typeof formSchema>>({ resolver: zodResolver(formSchema), })

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (props?.props?.name) {
                context?.updateFamily(
                    props?.props?._id,
                    values.type || props?.props?.type,
                    values.userName || props?.props?.name,
                    dob || props?.props?.dob,
                    values.photo || ""
                ).then((res) => {
                    if (res) {
                        toast(<div>{res}</div>);
                    }
                })
            }
            else {
                context?.addFamily(
                    mid,
                    values.type || "",
                    values.userName || "",
                    dob,
                    values.photo
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
            {
                !mid.length && !props?.props?._id ?
                    <div className="flex flex-col gap-2">
                        <div>
                            <Label>Member Contact</Label>
                            <Input
                                type="text"
                                placeholder="Enter Contact Number"
                                value={mc}
                                onChange={(e) => setMc(e.target.value)}
                            />
                        </div>
                        <div>
                            <Button
                                onClick={
                                    () => context?.getMembers("contact", mc, 0, 0).then((res) => { setMid(res.data[0]._id); })
                                }
                                disabled={context?.loading === "getMembers"}
                            >
                                {
                                    context?.loading === "getMembers" ? "Loading..." : "Search"
                                }
                            </Button>
                        </div>
                    </div>
                    : <>
                        <Input
                            value={props?.props?.member_id || mid}
                            disabled
                        />
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 max-w-3xl mx-auto">
                            <div className="grid grid-cols-12 gap-4">
                                <div className="col-span-6">
                                    <FormField
                                        control={form.control}
                                        name="userName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder=""
                                                        type="text"
                                                        {...field}
                                                        defaultValue={props?.props?.name}
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
                                        name="type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Type</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value || props?.props?.type}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="spouse">spouse</SelectItem>
                                                        <SelectItem value="dependent">dependent</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-12 gap-4">
                                <div className="col-span-6">
                                    <div className="relative w-full">
                                        <Label>Date of Birth</Label>
                                        <input
                                            type="date"
                                            style={{
                                                color: "black",
                                                width: "100%",
                                                filter: "invert(1)",
                                                padding: "5px 5px 5px 10px",
                                                background: "transparent",
                                                fontWeight: "600",
                                                border: "#00000059 solid 1px",
                                                borderRadius: "10px",
                                                margin: "7px 0 0 0",
                                            }}
                                            onChange={(e) => setDob(e.target.value)}
                                            defaultValue={
                                                props?.props?.dob
                                                    ? new Date(props.props.dob).toISOString().split("T")[0]
                                                    : ""
                                            }
                                        />
                                    </div>
                                </div>
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
                            </div>
                            <Button
                                type="submit"
                                disabled={["updateFamily", "addFamily"].includes(context?.loading || "")}
                            >
                                {
                                    ["updateFamily", "addFamily"].includes(context?.loading || "") ?
                                        "Loading..." : "Submit"
                                }
                            </Button>
                        </form>
                    </>
            }
        </Form>
    )
}