import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserContext } from "@/context/UserContextProvider"
import { useContext, useEffect } from "react"
import { useParams } from "react-router-dom"

function OrderInfo() {
    const param = useParams()
    const context = useContext(UserContext)

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

    return (
        <Card>
            <CardHeader>
                <div><Badge variant={order[0].status === "pending" ? "secondary" : "default"}>{order[0].status}</Badge></div>
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
                <Button onClick={() => context?.updateOrder(order[0]._id, "status", { status: "delivered" })}>Complete</Button>
            </CardFooter>
        </Card>
    )
}

export default OrderInfo
