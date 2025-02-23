import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserContext } from "@/context/UserContextProvider"
import { useContext, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

function OrderInfo() {
    const param = useParams()
    const context = useContext(UserContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (param?.id) { context?.getOrders("so", param?.id, 0, 1) }
    }, [])

    if (context?.loading === "getOrders") {
        return <div>Loading...</div>
    }
    const order = context?.ordersData.data;
    if (!order?.length) {
        return <div>No order found</div>
    }

    const OrderInfo = order[0].itemInfo.split("|")

    const statusColors: Record<string, string> = {
        cancelled: "bg-yellow-500 text-black",
        pending: "bg-orange-500 text-white",
        delivered: "bg-green-600 text-white",
    };

    const statusClass = statusColors[order[0].status as keyof typeof statusColors] || "bg-gray-400 text-white";

    return (
        <Card>
            <CardHeader>
                <div>
                    <Badge className={`p-3 ${statusClass}`}>
                        {order[0].status.toUpperCase()}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <Label>Name</Label>
                <Input value={OrderInfo[0]} readOnly />
                <Label>Brand</Label>
                <Input value={OrderInfo[1]} readOnly />
                <Label>Type</Label>
                <Input value={OrderInfo[2]} readOnly />
                <Label>Qty</Label>
                <Input value={OrderInfo[3]} readOnly />
                <Label>Price</Label>
                <Input value={OrderInfo[4]} readOnly />
                <Label>Date</Label>
                <Input value={new Date(order[0].orderDate).toLocaleDateString()} readOnly />
            </CardContent>
            <CardFooter>
                {
                    order[0].status === "pending" ? (
                        <div className="flex gap-2">
                            <Button className="bg-red-500 hover:bg-red-600 text-white"
                                onClick={() => context?.updateOrder(order[0]._id, "status", { status: "cancelled" })}>
                                Cancel
                            </Button>
                            <Button className="bg-green-500 hover:bg-green-600 text-white"
                                onClick={() => context?.updateOrder(order[0]._id, "status", { status: "delivered" })}>
                                Complete
                            </Button>
                        </div>
                    ) : (
                        <Button className="bg-gray-500 hover:bg-gray-600 text-white" onClick={() => navigate(-1)}>
                            Back
                        </Button>
                    )
                }
            </CardFooter>
        </Card>
    )
}

export default OrderInfo
