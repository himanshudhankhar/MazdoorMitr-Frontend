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
import AddEmployer from './components/AddEmployerPage';
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
import ModifyLabourerPage from './components/ModifyLabourerPage';
import ModifyEmployerPage from './components/ModifyEmployersPage';
import AddEmployeePage from './components/AddEmployeePage';
import ModifyEmployee from './components/ModifyEmployee';
import RegisteredLabourersByEmployee from './components/RegisteredLabourersByEmployee';
import RegisterLabourerByEmployee from './components/RegisterLabourerByEmployee';
import EditLabourerByEmployee from './components/EditLabourerByEmployee';
import TermsConditions from './components/TermsandConditions';
import RefundPolicy from './components/RefundPolicy';
import AboutUs from './components/AboutUs';
import PrivacyPolicy from './components/PrivacyPolicy';
import ContactUs from './components/ContactUs';
import CompleteShopProfile from './components/CompleteShopProfile';
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
        <Route exact path="/" element={<MazdoorMitrLandingPage />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/admin-login" element={<AdminLoginPage />} />
          <Route exact path="/employee-login" element={<EmployeeLogin />} />
          <Route exact path="/employee-dashboard" element={<ProtectedRoute userType="Employee"> <EmployeeDashboard /></ProtectedRoute>} />
          <Route exact path="/admin-dashboard" element={<ProtectedRoute userType="admin"><AdminDashboard /></ProtectedRoute> }/>
          <Route exact path="/labourers-added" element={<LabourersAddedPage />} />
          <Route exact path="/registered-labourers-by-employee" element={<ProtectedRoute userType="Employee"> <RegisteredLabourersByEmployee /></ProtectedRoute>} />
          <Route exact path="/register-labourers-by-employee" element={<ProtectedRoute userType="Employee"> <RegisterLabourerByEmployee /></ProtectedRoute>} />
          <Route exact path="/edit-labourer-by-employee" element={<ProtectedRoute userType="Employee"> <EditLabourerByEmployee /></ProtectedRoute>} />
          <Route exact path="/employers-added" element={<EmployersAddedPage />} />
          <Route exact path="/add-labourer" element={<ProtectedRoute userType="admin"><AddLabourer /></ProtectedRoute>} />
          <Route exact path="/modify-labourer" element={<ProtectedRoute userType="admin"><ModifyLabourerPage /></ProtectedRoute>} />
          <Route exact path="/add-employer" element={ <ProtectedRoute userType="admin"><AddEmployer /></ProtectedRoute>} />
          <Route exact path="/add-employee" element={ <ProtectedRoute userType="admin"><AddEmployeePage /></ProtectedRoute>} />
          <Route exact path="/modify-employee" element={ <ProtectedRoute userType="admin"><ModifyEmployee /></ProtectedRoute>} />
          {/* <Route exact path="/search-modify-labourer" element={<SearchModifyLabourer />} /> */}
          <Route exact path="/modify-employer" element={<ProtectedRoute userType="admin"><ModifyEmployerPage /></ProtectedRoute>} />
          <Route exact path="/report-profiles" element={<ReportProfiles />} />
          <Route exact path="/mediation-requests" element={<MediationRequests />} />
          <Route exact path="/profile-transactions" element={<ProfileTransactions />} />
          <Route exact path="/incomplete-profiles" element={<IncompleteProfiles />} />
          <Route exact path="/all-transactions" element={<AllTransactionsPage />} />
          <Route exact path="/all-mediation-requests" element={<AllMediationRequests />} />
          <Route exact path="/all-labourers-added" element={<AllLabourersAdded />} />
          <Route exact path="/all-employers-added" element={<AllEmployersAdded />} />
          <Route exact path="/terms-and-conditions" element={<TermsConditions/>} />
          <Route exact path="/refund-policy" element={<RefundPolicy/>} />
          <Route exact path="/about-us" element={<AboutUs/>} />
          <Route exact path="/privacy-policy" element={<PrivacyPolicy/>} />
          <Route exact path="/contact-us" element={<ContactUs/>} />
          <Route exact path="/modify-wallet-balance" element={<ProtectedRoute userType="admin"><ModifyWalletBalance /></ProtectedRoute>} />
          <Route exact path="/quickclap" element={<LandingPage />}/>
          <Route path="/app" element={<MazdoorMitra />}>
                <Route exact path="profile" element={<ProtectedRoute userType="user"><Profile /></ProtectedRoute>} />
                <Route exact path="wallet" element={<ProtectedRoute userType="user"><Wallet /></ProtectedRoute>} />
                <Route exact path="profile-page/:profileid" element={<ProtectedRoute userType="user"><ProfilePage /></ProtectedRoute>} />
                <Route exact path="home" element={<ProtectedRoute userType="user"><Home /></ProtectedRoute>} />
                <Route exact path="complete-profile-employer" element={<ProtectedRoute userType="user"><CompleteProfileEmployer /></ProtectedRoute>} />
                <Route exact path="create-labourer-profile" element={<ProtectedRoute userType="user"><CreateLabourerProfile /></ProtectedRoute>} />
                <Route exact path="complete-shop-profile" element={<ProtectedRoute userType="user"><CompleteShopProfile /></ProtectedRoute>} />

          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
