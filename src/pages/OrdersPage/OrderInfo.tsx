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
        if (param?.id) {
            context?.getOrders("", "", param?.id)
        }
    }, [])

    // Handle loading state
    if (context?.loading === "getOrders") {
        return <div>Loading...</div>
    }

    // Ensure ordersData is available and has items
    const order = context?.ordersData?.[0]

    // Handle case when no order data is available
    if (!order) {
        return <div>No order found</div>
    }

    return (
        <Card>
            <CardHeader>
                <Badge variant={order?.status === "pending" ? "secondary" : "default"}>{order?.status}</Badge>
            </CardHeader>
            <CardContent>
                <Label>Price</Label>
                <Input value={order?.price} readOnly />
                <Label>Date</Label>
                <Input value={new Date(order?.orderDate).toLocaleDateString()} readOnly />
            </CardContent>
            <CardFooter>
                <Button onClick={() => context.updateOrder(order?._id, "status", { status: "delivered" })}>Complete</Button>
            </CardFooter>
        </Card>
    )
}

export default OrderInfo
