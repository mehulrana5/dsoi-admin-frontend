import { Button } from "@/components/ui/button"
import { useState } from "react"
import { OrdersTable } from "./OrdersTable"
import CreateOrder from "./CreateOrder"
import ScanOrder from "./ScanOrder"
import { Card } from "@/components/ui/card"

function OrdersPage() {
    const type = localStorage.getItem("userType")
    const [option, setOption] = useState<any>(type === "bookKeeper" ? "table" : "scan")

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
            <Card className="flex gap-5 p-5">
                {
                    type === "bookKeeper" ?
                        <>
                            <Button variant={option !== 'table' ? "default" : "secondary"} onClick={() => setOption("table")}>Table</Button>
                            <Button variant={option !== 'order' ? "default" : "secondary"} onClick={() => setOption("order")}>Order</Button>
                        </>
                        :
                        <Button variant={option !== 'scan' ? "default" : "secondary"} onClick={() => setOption("scan")}>Scan</Button>
                }
            </Card>
            {option === 'table' && <OrdersTable />}
            {option === 'order' && <CreateOrder />}
            {option === 'scan' && <ScanOrder />}
        </div>
    )
}

export default OrdersPage
