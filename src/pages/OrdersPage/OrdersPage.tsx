import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserContext } from "@/context/UserContextProvider";
import { useContext, useEffect, useState } from "react";

function OrdersPage() {

    const context = useContext(UserContext)

    const [cred, setCred] = useState<any>({})
    const [member, setMember] = useState<any>({})

    async function handleSubmit(e: any, type: string) {
        e.preventDefault()
        if (type === 'contact') {
            const res = await context?.getMembers('contact', cred?.contact, 0, 10) || { data: [] };
            if (!res.data.length) {
                alert(`No member with number ${cred?.contact}`)
                return
            }
            setMember(res.data[0]);
        }
        else {
            // const res=awa
        }
    }

    function handleChange(e: any) {
        setCred({ ...cred, [e.target.name]: e.target.value })
    }

    useEffect(() => {
        if (localStorage.getItem("userType") === 'bookKeeper') {

        }
        else {

        }
    }, [])

    return (
        <div style={{
            display: 'flex',
            flexDirection: "column",
            flexWrap: "wrap",
            padding: "1em",
            alignItems: "center",
            justifyContent: "center",
            maxWidth: "1300px",
            margin: "auto",
        }}>
            <h1>Orders Page</h1>
            <div className="w-[300px] flex flex-col gap-2 sm:w-[50%]">
                <Card>
                    <CardContent>
                        {
                            !member?.photo ?
                                <form className="flex flex-col gap-2 p-5" onSubmit={(e) => handleSubmit(e, "contact")}>
                                    <Label>Contact</Label>
                                    <Input name="contact" type="tel" minLength={10} maxLength={10} onChange={(e) => handleChange(e)} />
                                    <Button type="submit">Submit</Button>
                                </form>
                                :
                                <form className="flex flex-col gap-2 p-5" onSubmit={(e) => handleSubmit(e, "amount")}>
                                    <Label>Enter Amount</Label>
                                    <Input name="amount" type="number" defaultValue={0} min={0} />
                                    <Button type="submit">Submit</Button>
                                </form>
                        }
                    </CardContent>
                </Card>
                {
                    !member?.photo ? <></> :
                        <Card>
                            <CardContent className="flex flex-wrap justify-around">
                                <img src={member?.photo} alt="Member photo" width={200} />
                                <div className="w-[fit-content]">
                                    <div>
                                        <Label>Name</Label>
                                        <Input value={member?.userName} readOnly />
                                    </div>
                                    <div>
                                        <Label>Wallet</Label>
                                        <Input value={member?.wallet} readOnly />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                }
            </div>
        </div>
    )
}

export default OrdersPage
