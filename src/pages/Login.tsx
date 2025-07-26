import { Link, useNavigate } from "react-router-dom";
import { LoginForm } from "../components/LoginForm";
import { Card } from "@/components/ui/card";
import { ModeToggle } from "@/components/mode-toggle";
import { useLoginMutation, useProfileQuery } from "@/api/authApi";
import { useAppDispatch } from "@/store";
import { setCredentials } from "@/store/slices/authSlice";

export default function LoginPage() {
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      const result = await login({
        email: data.email,
        password: data.password,
      }).unwrap();

      console.log(`token : ${result.token} user_id:${result.user_id}`);

      // Update Redux store with credentials - this will be persisted automatically
      dispatch(
        setCredentials({
          token: result?.token,
          user: {
            name: data.email.split("@")[0],
            email: data.email,
            role: result.role === "candidate" ? "candaidate" : "recruiter",
            user_id: result.user_id.toString(),
          },
        })
      );

      if (result.role === "candidate") {
        navigate("/candidate/");
      } else if (result.role === "recruiter") {
        navigate("/recruiter/dashboard");
      }
    } catch (error) {
      console.log("Login error:", error);
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
