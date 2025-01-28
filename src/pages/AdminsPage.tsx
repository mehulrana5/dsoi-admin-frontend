import { UserContext } from "@/context/UserContextProvider"
import { useContext } from "react"

function AdminsPage() {
    const context = useContext(UserContext)

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
        </div>
    )
}

export default AdminsPage
