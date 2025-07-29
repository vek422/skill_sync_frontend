import { createBrowserRouter } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/recruiter/Dashboard";
import TestCreate from "../pages/recruiter/TestCreate";
import TestEdit from "../pages/recruiter/TestEdit";
import TestPage from "../pages/recruiter/TestPage";
import Report from "../pages/recruiter/Report";
import CandidateUpload from "../pages/recruiter/CandidateUpload";
import Assessment from "../pages/candidate/Assessment";
import AllTests from "../pages/candidate/AllTests";
import { withAuthGaurd } from "../components/AuthGaurd";
import FallbackPage from "@/pages/FallbackPage";
import CandidateRegister from "@/pages/candidate/Register";
import RecruiterRegister from "@/pages/recruiter/Register";
import RegisterSelect from "@/pages/Register";
import { RecruiterLayout } from "@/components/layouts/RecruiterLayout";


import Tests from "@/pages/recruiter/Tests";
import CandidatesLayout from "@/components/layouts/CandidateLayout";
import Home from "@/pages/candidate/Home";
import TestInstructionPage from "@/pages/candidate/TestInstruction";
import TestInterface from "@/pages/candidate/TestInterface";
import CandidateReport from "@/pages/recruiter/Component/CandidateReport";
import CandidatesPage from "../pages/recruiter/CandidatesPage";



export const router = createBrowserRouter([
    {
        path: "/login",
        Component: Login,
    },
    {
        path: "/register",
        Component: RegisterSelect,
    },
    {
        path: "/register/candidate",
        Component: CandidateRegister,
    },
    {
        path: "/register/recruiter",
        Component: RecruiterRegister
    },

    {
        path: "/recruiter",
        Component: withAuthGaurd(RecruiterLayout),
        children: [
            {
                path: "dashboard",
                Component: Dashboard,
            },

            {
                path: "candidates",
                Component: CandidatesPage,
            }
            ,
            {
                path: "logs",
                Component: withAuthGaurd((await import("../pages/LogPage")).default),
            },
            {
                path: "tests",
                Component: Tests,
            },
            {
                path: "candidates/upload",
                Component: CandidateUpload,
            },
            {
                path: "test/create",
                Component: TestCreate,
            },
            {
                path: "test/:testId",
                Component: TestPage,
            },
            {
                path: "test/:id/edit",
                Component: TestEdit,
            },
            {
                path: "test/:id/report",
                Component: Report,
            },
            {
                path: "assessments/:assessmentId/report",
                Component: CandidateReport,
            },
            {
                path: "candidates/upload",
                Component: CandidateUpload,
            },


        ]
    },
    {
        path: "/candidate",
        Component: withAuthGaurd(CandidatesLayout),
        children: [
            {
                path: "",
                Component: Home
            },
            {
                path: "all-tests",
                Component: AllTests
            }
        ]
    },
    {
        path: "/candidate/assessment/:id",
        Component: withAuthGaurd(Assessment),
    },
    {
        path: "/candidate/test/:id/instruction",
        Component: withAuthGaurd(TestInstructionPage),
    },

    {
        path: "/candidate/test/:id",
        Component: withAuthGaurd(TestInterface),
    },
    {
        path: "*",
        Component: FallbackPage,
    },
]);
