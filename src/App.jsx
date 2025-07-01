import './App.css'
import { BrowserRouter, Routes, Route } from "react-router";
import LandingPage from './quickclap';
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
import AllMediationRequests from './components/AllMediationRequests';
import AllLabourersAdded from './components/AllLabourersAdded';
import AllEmployersAdded from './components/AllEmployersAdded';
import ModifyWalletBalance from './components/ModifyWalletBalance';
import ProtectedRoute from "./components/ProtectedComponent";
import MazdoorMitrLandingPage from './components/MazdoorMitrLandingPage';
import AllTransactionsPage from './components/AllTransactionsPage';
import LabourersAddedPage from './components/LabourersAddedPage';
import EmployersAddedPage from './components/EmployersAddedPage';
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
        <Route exact path="/" element={<MazdoorMitrLandingPage />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/admin-login" element={<AdminLoginPage />} />
          <Route exact path="/employee-login" element={<EmployeeLogin />} />
          <Route exact path="/employee-dashboard" element={<EmployeeDashboard />} />
          <Route exact path="/admin-dashboard" element={<ProtectedRoute userType="admin"><AdminDashboard /></ProtectedRoute> }/>
          <Route exact path="/labourers-added" element={<LabourersAddedPage />} />
          <Route exact path="/employers-added" element={<EmployersAddedPage />} />
          <Route exact path="/add-labourer" element={<ProtectedRoute userType="admin"><AddLabourer /></ProtectedRoute>} />
          <Route exact path="/add-employer" element={<AddEmployer />} />
          <Route exact path="/search-modify-labourer" element={<SearchModifyLabourer />} />
          <Route exact path="/search-modify-employer" element={<SearchModifyEmployer />} />
          <Route exact path="/report-profiles" element={<ReportProfiles />} />
          <Route exact path="/mediation-requests" element={<MediationRequests />} />
          <Route exact path="/profile-transactions" element={<ProfileTransactions />} />
          <Route exact path="/incomplete-profiles" element={<IncompleteProfiles />} />
          <Route exact path="/all-transactions" element={<AllTransactionsPage />} />
          <Route exact path="/all-mediation-requests" element={<AllMediationRequests />} />
          <Route exact path="/all-labourers-added" element={<AllLabourersAdded />} />
          <Route exact path="/all-employers-added" element={<AllEmployersAdded />} />
          <Route exact path="/modify-wallet-balance" element={<ModifyWalletBalance />} />
          <Route exact path="/quickclap" element={<LandingPage />}/>
          <Route path="/app" element={<MazdoorMitra />}>
                <Route exact path="profile" element={<ProtectedRoute userType="user"><Profile /></ProtectedRoute>} />
                <Route exact path="wallet" element={<ProtectedRoute userType="user"><Wallet /></ProtectedRoute>} />
                <Route exact path="profile-page/:profileid" element={<ProtectedRoute userType="user"><ProfilePage /></ProtectedRoute>} />
                <Route exact path="home" element={<ProtectedRoute userType="user"><Home /></ProtectedRoute>} />
                <Route exact path="complete-profile-employer" element={<ProtectedRoute userType="user"><CompleteProfileEmployer /></ProtectedRoute>} />
                <Route exact path="create-labourer-profile" element={<ProtectedRoute userType="user"><CreateLabourerProfile /></ProtectedRoute>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
