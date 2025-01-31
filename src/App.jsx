import './App.css'
import { BrowserRouter, Routes, Route } from "react-router";
import MazdoorMitra from './components/MazdoorMitra';
import Login from "./components/Login";
import Profile from './components/Profile';
import Wallet from './components/Wallet';
import Home from './components/Home';
import ProfilePage from './components/ProfilePage';
import AdminLoginPage from './components/AdminLoginPage';
import CreateLabourerProfile from './components/CreateLabourerProfile';
import CompleteProfileEmployer from './components/CompleteProfileEmployer';
import EmployeeLogin from './components/EmployeeLoginPage';
import EmployeeDashboard from './components/EmployeeDashboard';
import AdminDashboard from './components/AdminDashboard';
import AddLabourer from './components/AddLabourer';
import AddEmployer from './components/AddEmployer';
import SearchModifyLabourer from './components/SearchAndModifyLabourer';
import SearchModifyEmployer from './components/SearchModifyEmployer';
import ReportProfiles from './components/ReportProfiles';
import MediationRequests from './components/MediationRequests';
import ProfileTransactions from './components/ProfileTransactions';
import IncompleteProfiles from './components/IncompleteProfiles';
import AllTransactions from './components/AllTransactions';
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/admin-login" element={<AdminLoginPage />} />
          <Route exact path="/employee-login" element={<EmployeeLogin />} />
          <Route exact path="/employee-dashboard" element={<EmployeeDashboard />} />
          <Route exact path="/admin-dashboard" element={<AdminDashboard />} />
          <Route exact path="/add-labourer" element={<AddLabourer />} />
          <Route exact path="/add-employer" element={<AddEmployer />} />
          <Route exact path="/search-modify-labourer" element={<SearchModifyLabourer />} />
          <Route exact path="/search-modify-employer" element={<SearchModifyEmployer />} />
          <Route exact path="/report-profiles" element={<ReportProfiles />} />
          <Route exact path="/mediation-requests" element={<MediationRequests />} />
          <Route exact path="/profile-transactions" element={<ProfileTransactions />} />
          <Route exact path="/incomplete-profiles" element={<IncompleteProfiles />} />
          <Route exact path="/all-transactions" element={<AllTransactions />} />
          <Route path="/" element={<MazdoorMitra />}>
                <Route exact path="/profile" element={<Profile />} />
                <Route exact path="/wallet" element={<Wallet />} />
                <Route exact path="/profile-page/:profileid" element={<ProfilePage />} />
                <Route exact path="/home" element={<Home />} />
                <Route exact path="/complete-profile-employer" element={<CompleteProfileEmployer />} />
                <Route exact path="/create-labourer-profile" element={<CreateLabourerProfile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
