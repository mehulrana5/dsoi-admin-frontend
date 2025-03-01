import { LogsTable } from "./LogsTable"

function LogsPage() {
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
            <h1>Logs Page</h1>
            <LogsTable />
        </div>
    )
}

export default LogsPage
