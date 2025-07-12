import { Link } from "react-router-dom";
import { LoginForm } from "../components/LoginForm";
import { Card } from "@/components/ui/card";
import { ModeToggle } from "@/components/mode-toggle";
import { useLoginMutation } from "@/api/authApi";

export default function () {
  const [login, { isLoading, isError, isSuccess }] = useLoginMutation();
  // Simulate login logic
  const handleLogin = (data: { email: string; password: string }) => {
    login({ email: data.email, password: data.password });
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
