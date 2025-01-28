import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useContext, useState } from "react"
import { UserContext } from "@/context/UserContextProvider"

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const context = useContext(UserContext);
  const { loading } = context || {};

  const [cred, setCred] = useState({ username: "", password: "" })

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    context?.login(cred);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your user name below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <div className="flex">
                  <Label htmlFor="username">User name</Label>
                </div>
                <Input
                  id="username"
                  type="text"
                  required
                  value={cred.username}
                  onChange={(e) => setCred({ ...cred, username: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={cred.password}
                  onChange={(e) => setCred({ ...cred, password: e.target.value })}
                />
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Button type="submit" className="w-full" disabled={loading === "login"}>
                {loading ? 'Loading...' : 'Login'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
