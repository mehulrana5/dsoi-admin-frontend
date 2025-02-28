import { Button } from "@/components/ui/button";
import { useState } from "react";
import { OrdersTable } from "./OrdersTable";
import CreateOrder from "./CreateOrder";
import ScanOrder from "./ScanOrder";
import { Card } from "@/components/ui/card";

function OrdersPage() {
    const type = localStorage.getItem("userType") || "defaultUser";
    const [option, setOption] = useState<any>(type === "bookKeeper" ? "table" : "scan");

    // Define button configurations for each user type
    const buttonsConfig: Record<string, { label: string; value: string }[]> = {
        superAdmin: [
            { label: "Table", value: "table" },
            { label: "Order", value: "order" },
            { label: "Scan", value: "scan" },
        ],
        analyst: [{ label: "Table", value: "table" }],
        bookKeeper: [
            { label: "Table", value: "table" },
            { label: "Order", value: "order" },
        ],
        barTender: [{ label: "Scan", value: "scan" }],
    };

    // Get buttons based on user type
    const userButtons = buttonsConfig[type] || [];

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                flexWrap: "wrap",
                padding: "1em",
                alignItems: "center",
                justifyContent: "center",
                maxWidth: "1300px",
                margin: "auto",
            }}
        >
            <h1>Orders Page</h1>
            <Card className="flex gap-5 p-5">
                {userButtons.map(({ label, value }) => (
                    <Button
                        key={value}
                        variant={option !== value ? "default" : "secondary"}
                        onClick={() => setOption(value)}
                    >
                        {label}
                    </Button>
                ))}
            </Card>
            {option === "table" && <OrdersTable />}
            {option === "order" && <CreateOrder />}
            {option === "scan" && <ScanOrder />}
        </div>
    );
}

export default OrdersPage;