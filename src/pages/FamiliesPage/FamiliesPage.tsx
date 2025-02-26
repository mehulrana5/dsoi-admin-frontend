import { FamilyTable } from "./FamiliesTable"

function FamiliesPage() {
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
            <h1>Families Page</h1>
            <FamilyTable />
        </div>
    )
}

export default FamiliesPage