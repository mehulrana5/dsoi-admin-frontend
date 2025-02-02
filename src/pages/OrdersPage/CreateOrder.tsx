import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserContext } from "@/context/UserContextProvider";
import { useContext, useState } from "react";

interface Credentials {
    contact?: string;
    amount?: number;
}

interface Member {
    photo?: string;
    userName?: string;
    wallet?: string;
    _id?: string
}

function CreateOrder() {
    const context = useContext(UserContext);
    const [cred, setCred] = useState<Credentials>({});
    const [member, setMember] = useState<Member | null>(null);

    async function handleSubmit(e: React.FormEvent, type: "contact" | "amount") {
        e.preventDefault();
        if (type === "contact") {
            const res = await context?.getMembers("contact", cred.contact || "", 0, 10) || { data: [], };
            if (res.data.length === 0) {
                alert(`No member with number ${cred.contact}`);
                return;
            }
            setMember(res.data[0]);
        } else {
            context?.createOrder(member?._id ?? "", Number(cred.amount ?? 0), Number(member?.wallet) ?? 0)
            setCred({});
            setMember(null);
        }
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setCred((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    return (
        <div className="flex flex-col gap-2">
            <Card>
                <CardContent>
                    <form className="flex flex-col gap-2 p-2" onSubmit={(e) => handleSubmit(e, "contact")}>
                        <Label>Contact</Label>
                        <div className="flex gap-2">
                            <Input
                                name="contact"
                                type="tel"
                                minLength={10}
                                maxLength={10}
                                onChange={handleChange}
                                disabled={Boolean(member?.photo)}
                                className="w-[70%]"
                                value={cred.contact || ""}
                            />
                            <Button className="w-[fit-content]" type="submit" disabled={Boolean(member?.photo)}>
                                Submit
                            </Button>
                        </div>
                    </form>
                    {member?.photo && (
                        <form className="flex flex-col gap-2 p-2" onSubmit={(e) => handleSubmit(e, "amount")}>
                            <Label>Enter Amount</Label>
                            <div className="flex gap-2">
                                <Input
                                    className="w-[60%]"
                                    name="amount"
                                    type="number"
                                    min={0}
                                    onChange={handleChange}
                                    value={cred.amount || ""}
                                />
                                <Button className="w-[fit-content]" type="submit">
                                    Submit
                                </Button>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>
            {member?.photo && (
                <Card>
                    <CardContent className="flex gap-2 flex-wrap justify-around">
                        <img src={member.photo} alt="Member photo" className="h-[200px] sm:h-[200px]" />
                        <div className="w-[fit-content]">
                            <div>
                                <Label>Name</Label>
                                <Input value={member.userName || ""} readOnly />
                            </div>
                            <div>
                                <Label>Wallet</Label>
                                <Input value={member.wallet || ""} readOnly />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default CreateOrder;
