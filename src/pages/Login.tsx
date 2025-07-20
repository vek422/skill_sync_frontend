import { Link, useNavigate } from "react-router-dom";
import { LoginForm } from "../components/LoginForm";
import { Card } from "@/components/ui/card";
import { ModeToggle } from "@/components/mode-toggle";
import { useLoginMutation } from "@/api/authApi";

export default function LoginPage() {
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate(); 
  const handleLogin = async (data: { email: string; password: string }) => {
    const result = await login({ email: data.email, password: data.password });

    if ("data" in result && result.data) {
      console.log("Login result:", result.data);
      
      // Store the token for authenticated requests
      localStorage.setItem('token', result.data.token);

      if (result.data.role === "candidate") {
        navigate("/candidate/dashboard"); 
      } else if (result.data.role === "recruiter") {
        navigate("/recruiter/dashboard");
      }
    } else {
      console.log("Login error:", result);
    }
  };

  return (
    <div className="flex w-screen h-screen items-center justify-center bg-background">
      <div className="absolute top-0 left-0 w-full flex items-center justify-between px-8 py-2 bg-transparent backdrop-blur-md ">
        <div className="text-2xl font-bold text-primary">Skill Sync</div>
        <ModeToggle />
      </div>
      <Card className="w-full max-w-md">
        <LoginForm onSubmit={handleLogin} loading={isLoading} />
        <p className="mt-6 text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary hover:underline">
            Register
          </Link>
        </p>
      </Card>
    </div>
  );
}
