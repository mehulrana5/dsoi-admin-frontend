import { InventoryTable } from "./InventoryTable"

function InventoryPage() {
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
            <h1>Inventory Page</h1>
            <InventoryTable />
        </div>
    )
}

export default InventoryPage
