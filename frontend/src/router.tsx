import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import DashboardView from "./view/DashboardView";
import CreateProjectView from "./view/projects/CreateProjectView";
import EditProjectView from "./view/projects/EditProjectView";
import ProjectDetailsView from "./view/projects/ProjectDetailsView";
import AuthLayout from "./layouts/AuthLayout";
import LoginView from "./view/auth/LoginView";
import RegisterView from "./view/auth/RegisterView";
import ConfirmAccountView from "./view/auth/ConfirmAccountView";
import RequestNewCodeView from "./view/auth/RequestNewCodeView";
import ForgotPasswordView from "./view/auth/ForgotPasswordView";
import NewPasswordView from "./view/auth/NewPasswordView";
import ProjectTeamView from "./view/projects/ProjectTeamView";
import ProfileView from "./view/profile/ProfileView";
import ChangePasswordView from "./view/profile/ChangePasswordView";
import ProfileLayout from "./layouts/ProfileLayout";
import NotFound from "./view/404/NotFound";

export default function Router() {

    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path="/" element={<DashboardView />} index />
                    <Route path="/projects/create" element={<CreateProjectView />} />
                    <Route path="/projects/:projectId" element={<ProjectDetailsView />} />
                    <Route path="/projects/:projectId/edit" element={<EditProjectView />} />
                    <Route path="/projects/:projectId/team" element={<ProjectTeamView />} />
                    <Route element={<ProfileLayout/>}>
                        <Route path="/profile" element={<ProfileView />} />
                        <Route path="/profile/password" element={<ChangePasswordView />} />
                    </Route>
                </Route>
                
                <Route element={<AuthLayout />}>
                    <Route path="/auth/login" element={<LoginView />} />
                    <Route path="/auth/register" element={<RegisterView />} />
                    <Route path="/auth/confirm-account" element={<ConfirmAccountView />} />
                    <Route path="/auth/request-code" element={<RequestNewCodeView />} />
                    <Route path="/auth/forgot-password" element={<ForgotPasswordView />} />
                    <Route path="/auth/new-password" element={<NewPasswordView />} />
                </Route>

                <Route element={<AuthLayout/>}>
                    <Route path="*" element={<NotFound/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}