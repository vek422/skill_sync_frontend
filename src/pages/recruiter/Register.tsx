import { Button } from "@/components/ui/button";
import { RegistrationForm } from "../../components/RegistrationForm";
import { useRegister } from "../../lib/useRegister";
import { Link } from "react-router-dom";
import { Sun } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ModeToggle } from "@/components/mode-toggle";

export default function RecruiterRegister() {
  const { submitRegister, loading, error } = useRegister("recruiter");
  return (
    <div className="flex w-screen h-screen items-center justify-center bg-background">
       <div className="absolute top-0 left-0 w-full flex items-center justify-between px-8 py-2 bg-transparent backdrop-blur-md ">
        <div className="text-2xl font-bold text-primary">Skill Sync</div>
        <ModeToggle/>
      </div>
      <Card>
        <RegistrationForm
          onSubmit={submitRegister}
          loading={loading}
          error={error}
          title="Recruiter Registration"
        />
        <p className="mt-6 text-sm text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">Login</Link>
        </p>
      </Card>
    </div>
  );
}
