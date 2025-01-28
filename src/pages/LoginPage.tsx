import { LoginForm } from "@/components/login-form"

export default function Page() {
  return (
    <div style={{
      height:"100vh",
      outline:"red solid",
      display:"flex",
      justifyContent:"center",
      alignItems:"center"
    }}>
      <LoginForm />
    </div>
  )
}
