import { Routes, Route } from "react-router-dom";
import Header from "./NavbarComponent/Header";

// User Components
import AdminRegisterForm from "./UserComponent/AdminRegisterForm";
import UserLoginForm from "./UserComponent/UserLoginForm";
import UserRegister from "./UserComponent/UserRegister";
import ViewAllEmployees from "./UserComponent/ViewAllEmployees";
import ViewAllEmployers from "./UserComponent/ViewAllEmployers";
import EmployeeProfile from "./UserComponent/EmployeeProfile";
import UpdateUserProfileForm from "./UserComponent/UpdateUserProfileForm";

// Job Components
import AddJobForm from "./JobComponent/AddJobForm";
import ViewEmployerJobs from "./JobComponent/ViewEmployerJobs";
import ViewAllJobs from "./JobComponent/ViewAllJobs";
import JobDetailPage from "./JobComponent/JobDetailPage";

// Category Components
import AddCategoryForm from "./CategoryComponent/AddCategoryForm";
import ViewAllCategories from "./CategoryComponent/ViewAllCategories";
import UpdateCategoryForm from "./CategoryComponent/UpdateCategoryForm";

// Job Application Components
import ViewEmployeeJobApplication from "./JobApplicationComponent/ViewEmployeeJobApplication";
import ViewEmployerJobApplication from "./JobApplicationComponent/ViewEmployerJobApplication";
import ViewAllJobApplication from "./JobApplicationComponent/ViewAllJobApplication";
import ViewJobApplications from "./JobApplicationComponent/ViewJobApplications";

// Page Components
import HomePage from "./PageComponent/HomePage";
import AboutUs from "./PageComponent/AboutUs";
import ContactUs from "./PageComponent/ContactUs";
import EmployerDashboardPage from "./PageComponent/EmployerDashboardPage";
import ApplicationListPage from "./PageComponent/ApplicationListPage";

// ✅ NEW: Employer Applications Page (if added)
import EmployerApplicationsPage from "./PageComponent/Employer/EmployerApplicationsPage";

function App() {
  return (
    <div>
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/contactus" element={<ContactUs />} />

        {/* User Auth */}
        <Route path="/user/admin/register" element={<AdminRegisterForm />} />
        <Route path="/user/login" element={<UserLoginForm />} />
        <Route path="/user/employee/register" element={<UserRegister />} />
        <Route path="/user/employer/register" element={<UserRegister />} />

        {/* Admin Section */}
        <Route path="/admin/job/category/add" element={<AddCategoryForm />} />
        <Route path="/admin/job/category/all" element={<ViewAllCategories />} />
        <Route path="/admin/job/category/update" element={<UpdateCategoryForm />} />
        <Route path="/admin/job/all" element={<ViewAllJobs />} />
        <Route path="/admin/employee/all" element={<ViewAllEmployees />} />
        <Route path="/admin/employer/all" element={<ViewAllEmployers />} />
        <Route path="/admin/job/application/all" element={<ViewAllJobApplication />} />

        {/* Job Details */}
        <Route path="/job/:jobId/detail" element={<JobDetailPage />} />
        <Route path="/job/:jobId/application/all" element={<ViewJobApplications />} />

        {/* Employee Section */}
        <Route path="/employee/job/application/all" element={<ViewEmployeeJobApplication />} />
        <Route path="/employee/profile/detail" element={<EmployeeProfile />} />
        <Route path="/employee/profile/update" element={<UpdateUserProfileForm />} />

        {/* Employer Section */}
        <Route path="/employer/job/post" element={<AddJobForm />} />
        <Route path="/employer/job/all" element={<ViewEmployerJobs />} />
        <Route path="/employer/job/application/all" element={<ViewEmployerJobApplication />} />
        <Route path="/employer/dashboard" element={<EmployerDashboardPage />} />
        <Route path="/employer/job/:jobId/applicants" element={<ApplicationListPage />} />

        {/* ✅ NEW Route for viewing all employer's job applications */}
        <Route path="/employer/applications" element={<EmployerApplicationsPage />} />
      </Routes>
    </div>
  );
}

export default App;
