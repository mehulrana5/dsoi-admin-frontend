import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { UserContext } from "@/context/UserContextProvider";
import { useContext, useEffect, useState } from "react";
import Fuse from "fuse.js";

interface Item {
    _id: string;
    name: string;
    brand: string;
    type: string;
    qty: number;
    price: number;
}

function CreateOrder() {
    const context = useContext(UserContext);
    const [cred, setCred] = useState<Record<string, string>>({});
    const [queryText, setQueryText] = useState<string>("");
    const [searchResults, setSearchResults] = useState<Item[]>([]);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [basket, setBasket] = useState<Item[]>([]);
    const [selectedOption, setSelectedOption] = useState<"profile" | "add" | "basket" | "">("profile");

    const [member, setMember] = useState<{
        photo: string;
        wallet: number;
        _id: string;
        userName: string;
    }>({ photo: "", wallet: 0, _id: "", userName: "" });

    const handleSubmit = async (e: React.FormEvent, type: string) => {
        e.preventDefault();
        if (type === "contact") {
            const res = (await context?.getMembers("contact", cred.contact || "", 0, 10)) || { data: [] };
            if (res.data.length === 0) {
                alert(`No member with number ${cred.contact}`);
                return;
            }
            setMember(res.data[0]);
        } else if (type === "buy") {
            basket.forEach(e => {
                context?.createOrder(member._id, e._id, member.wallet, e.price);
            });
            resetOrder();
        } else if (type === "add" && selectedItem) {
            setBasket((prev) => [...prev, selectedItem]);
            setQueryText("");
            setSelectedItem(null);
        }
    };

    const resetOrder = () => {
        setCred({});
        setMember({ photo: "", wallet: 0, _id: "", userName: "" });
        setQueryText("");
        setSelectedItem(null);
        setBasket([])
        setSelectedOption("")
    };

    function Profile() {
        return (
            <Card>
                <CardContent className="pt-5">
                    <img src={member.photo} alt="Member" className="h-[200px] sm:h-[200px] w-[fit-content]" />
                    <div className="w-fit">
                        <Label>Name</Label>
                        <Input value={member.userName || ""} readOnly />
                        <Label>Wallet</Label>
                        <Input value={member.wallet || ""} readOnly />
                    </div>
                </CardContent>
            </Card>
        );
    }

    function Basket() {
        const totalPrice = basket.reduce((sum, item) => sum + item.price, 0);
        let flag = false
        if (context?.MIN_AMOUNT) {
            flag = member.wallet - totalPrice > context?.MIN_AMOUNT
        }
        return (
            <Card className="w-full">
                <CardHeader className="text-lg font-semibold">
                    <div>Basket (₹{totalPrice})</div>
                    <div>Wallet (₹{member.wallet || 0})</div>

                    {
                        !flag ?
                            <span className="text-red-500">Member wallet will get below {context?.MIN_AMOUNT}</span>
                            : <Button variant={"outline"} onClick={(e) => handleSubmit(e, "buy")}>Buy</Button>
                    }
                </CardHeader>
                <CardContent>
                    {basket.length === 0 ? (
                        <p className="text-gray-500">No items in the basket</p>
                    ) : (
                        <div className="space-y-3 overflow-y-auto h-[250px]">
                            {basket.map((item, idx) => (
                                <div key={idx} className="p-3 border rounded-lg shadow-sm flex flex-col gap-1">
                                    <div className="flex justify-between">
                                        <h3 className="text-base font-semibold">{item.name}</h3>
                                        <Button
                                            onClick={() => setBasket((prev) => prev.filter((_, index) => index !== idx))}
                                            variant="destructive"
                                            size={'sm'}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                                        <Badge variant="outline">{item.brand}</Badge>
                                        <Badge>{item.type}</Badge>
                                        <Badge variant="secondary">{item.qty} {item.qty > 5 ? "ml" : ""}</Badge>
                                        <Badge className="bg-green-500 text-white">₹{item.price}</Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    }

    useEffect(() => {
        if (!context?.itemsData?.data?.length) {
            context?.getItems("", "", 0, 0);
        }
    }, [context]);

    useEffect(() => {
        if (!queryText) {
            setSearchResults([]);
            return;
        }
        const fuse = new Fuse(context?.itemsData?.data ?? [], {
            keys: ["name", "brand", "type"],
            threshold: 0.3,
        });
        setSearchResults(fuse.search(queryText).map((result) => result.item));
    }, [queryText, context]);

    return (
        <div className="flex flex-col gap-2 w-[100%] sm:w-[70%]">
            {!member.photo ? (
                <form className="flex flex-col gap-2 p-2" onSubmit={(e) => handleSubmit(e, "contact")}>
                    <Label>Contact</Label>
                    <div className="flex gap-2">
                        <Input
                            name="contact"
                            type="tel"
                            minLength={10}
                            maxLength={10}
                            onChange={(e) => setCred({ contact: e.target.value })}
                            className="w-[70%]"
                            value={cred.contact || ""}
                        />
                        <Button type="submit">Submit</Button>
                    </div>
                </form>
            ) : (
                <div className="flex gap-2">
                    {["profile", "add", "basket"].map((option) => (
                        <Button
                            variant={selectedOption === option ? "secondary" : "default"}
                            key={option}
                            onClick={() => setSelectedOption(option as any)}
                        >
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                        </Button>
                    ))}
                </div>
            )}
            {member.photo && selectedOption === "profile" && <Profile />}
            {selectedOption === "basket" && <Basket />}
            {
                selectedOption === "add" &&
                <form className="flex flex-col gap-2 p-2" onSubmit={(e) => handleSubmit(e, "add")}>
                    <Label>Search Item</Label>
                    <Input
                        name="item"
                        type="text"
                        value={queryText}
                        onChange={(e) => setQueryText(e.target.value)}
                    />
                    <div className="h-[150px] rounded-md border p-4 overflow-y-auto">
                        {searchResults.length === 0 ? (
                            <p className="text-gray-500">No results found</p>
                        ) : (
                            searchResults.map((item: Item) => (
                                <div
                                    key={item._id}
                                    className={`cursor-pointer p-1 border-b border-gray-300 ${selectedItem?._id === item._id ? "bg-blue-600" : "hover:bg-gray-900"
                                        }`}
                                    onClick={() => setSelectedItem(item)}
                                >
                                    {item.name} | {item.brand} | {item.type} | {item.qty}{" "}
                                    {item.qty > 5 ? "ml" : ""} | ₹{item.price}
                                </div>
                            ))
                        )}
                    </div>
                    {selectedItem && <Button type="submit">Add</Button>}
                </form>
            }
        </div>
    );
}

export default CreateOrder;
