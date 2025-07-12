import { Card } from "@/components/ui/card";
import { RegistrationForm } from "../../components/RegistrationForm";
import { Link } from "react-router-dom";
import { useRegisterMutation } from "@/api/authApi";
import { ModeToggle } from "@/components/mode-toggle";

export default function CandidateRegister() {
  const [register, { isLoading, isError, error }] = useRegisterMutation();

  return (
    <div className="flex w-screen h-screen items-center justify-center bg-background">
      <div className="absolute top-0 left-0 w-full flex items-center justify-between px-8 py-2 bg-transparent backdrop-blur-md ">
        <div className="text-2xl font-bold text-primary">Skill Sync</div>
        <ModeToggle />
      </div>
      <Card>
        <RegistrationForm
          onSubmit={register}
          loading={isLoading}
          title="Candidate Registration"
          role="candidate"
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
