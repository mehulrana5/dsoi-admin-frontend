import { AdminTable } from "./AdminTable"

function AdminsPage() {
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
            <h1>Admins Page</h1>
            <AdminTable />
        </div>
    )
}

export default AdminsPage