import { MembersTable } from "./MembersTable"

function MembersPages() {
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
      <h1>Members Page</h1>
      <MembersTable />
    </div>
  )
}

export default MembersPages
