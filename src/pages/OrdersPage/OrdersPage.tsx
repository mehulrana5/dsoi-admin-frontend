import { Outlet } from "react-router-dom"

function OrdersPage() {
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
            <Outlet />
        </div>
    )
}

export default OrdersPage
