import { RegistrationForm } from "../../components/RegistrationForm";
import { Link } from "react-router-dom";

import { Card } from "@/components/ui/card";
import { ModeToggle } from "@/components/mode-toggle";
import { useRegisterMutation } from "@/api/authApi";

export default function RecruiterRegister() {
  const [register, { isLoading, error, isError }] = useRegisterMutation();
  return (
    <div className="flex w-screen h-screen items-center justify-center bg-background">
      <div className="absolute top-0 left-0 w-full flex items-center justify-between px-8 py-2 bg-transparent backdrop-blur-md ">
        <div className="text-2xl font-bold text-primary">Skill Sync</div>
        <ModeToggle />
      </div>
      <Card>
        <RegistrationForm
          role={"recruiter"}
          onSubmit={register}
          loading={isLoading}
          title="Recruiter Registration"
        />
        <p className="mt-6 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </Card>
    </div>
  );
}
