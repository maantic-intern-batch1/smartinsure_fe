import { createBrowserRouter, Outlet, redirect } from "react-router-dom";
import ClaimInit from "./pages/ClaimInit";
import DocUpload from "./pages/DocUpload";
import Login from "./pages/Login";
import ReportPage from "./pages/Report";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import axios from "./utils/axiosConf";
import Dashboard from "./pages/Dashboard";
import store from './store/storeConf';
import ViewClaim from "./pages/ViewClaim";
import UpdateReport from "./pages/UpdateReport";
import ViewUser from "./pages/ViewUser";
import MyProfile from "./pages/MyProfile";
import EditClaim from "./pages/EditClaim";
import Signup from "./pages/Signup";
import HomePage from "./pages/HomePage";
import ViewAllUsers from "./pages/ViewAllUsers";
import ErrorPage from "./pages/ErrorPage";

export const router = createBrowserRouter([
    {
        path: '/', element: <NavLayout />,
        errorElement: <ErrorPage />,
        children: [
            { path: "", element: <HomePage /> },
            { path: "dash", element: <Dashboard />, loader: dashboardLoader },
            { path: "new-claim", element: <ClaimInit />, loader: claimInitLoader },
            { path: "upload-docs/:claimId", element: <DocUpload />, loader: docUploadLoader },
            { path: "login", element: <Login /> },
            { path: "view-report/:reportId", element: <ReportPage />, loader: viewReportLoader },
            { path: "view-claim/:claimId", element: <ViewClaim />, loader: viewClaimLoader },
            { path: "update-report/:reportId", element: <UpdateReport />, loader: updateReportLoader },
            { path: "view-user/:userId", element: <ViewUser />, loader: viewUserLoader },
            { path: "my-profile", element: <MyProfile />, loader: myProfileLoader },
            { path: "edit-claim/:claimId", element: <EditClaim />, loader: editClaimLoader },
            { path: "signup", element: <Signup /> },
            { path: "view-all-users", element: <ViewAllUsers />, loader: viewAllUsersLoader },
            { path: "", element: <ErrorPage noSuchPage={true} /> },
        ]
    }
])

async function viewUserLoader(req) {
    const userState = store.getState().user
    if (!userState.authToken) return redirect('/login')
    if (userState.role === "POLICY_HOLDER") {
        alert('Only claim assessors can view other users')
        return redirect('/')
    }

    const header = {
        headers: {
            Authorization: `Bearer ${userState.authToken}`
        }
    }

    const res = await axios.get(`${process.env.REACT_APP_BACKEND_DOMAIN}/user/details/${req.params.userId}`, header)

    if (res.data.err) {
        alert(res.data.err);
        return redirect('/');
    }

    return res.data.msg
}

async function viewAllUsersLoader(req) {
    const userState = store.getState().user
    if (!userState.authToken) return redirect('/login')
    if (userState.role === "POLICY_HOLDER") {
        alert('Only claim assessors can view other users')
        return redirect('/')
    }

    const header = {
        headers: {
            Authorization: `Bearer ${userState.authToken}`
        }
    }

    const res = await axios.get(`${process.env.REACT_APP_BACKEND_DOMAIN}/user/get-all`, header)

    if (res.data.err) {
        alert(res.data.err);
        return redirect('/');
    }

    return Array.from(res.data.msg)
}

async function editClaimLoader(req) {
    const userState = store.getState().user
    if (!userState.authToken) return redirect('/login')
    if (userState.role === "CLAIM_ASSESSOR") {
        alert('Only policy holders can edit thier claims')
        return redirect('/')
    }

    const header = {
        headers: {
            Authorization: `Bearer ${userState.authToken}`
        }
    }
    const claimRes = await axios.get(`${process.env.REACT_APP_BACKEND_DOMAIN}/claim/${req.params.claimId}`, header)
    if (claimRes.data.err) {
        alert(claimRes.data.err)
        return redirect('/')
    }
    const hospCodesRes = await axios.get(`${process.env.REACT_APP_BACKEND_DOMAIN}/policy/hosp/all-codes`, header)
    if (hospCodesRes.data.err) {
        alert(hospCodesRes.data.err)
        return redirect('/')
    }

    return { claims: claimRes.data.msg, hospCodes: Array.from(hospCodesRes.data.msg).map(o => o.code) }
}

async function myProfileLoader() {
    const userState = store.getState().user
    if (!userState.authToken) return redirect('/login')

    const header = {
        headers: {
            Authorization: `Bearer ${userState.authToken}`
        }
    }

    const [resUser, resClaims] = await Promise.all([
        axios.get(`${process.env.REACT_APP_BACKEND_DOMAIN}/user/my-details`, header),
        userState.role === 'CLAIM_ASSESSOR' && axios.get(`${process.env.REACT_APP_BACKEND_DOMAIN}/claim/pending`, header)
    ]);

    if (resUser.data.err) {
        alert(resUser.data.err);
        return redirect('/');
    } else if (resClaims?.data?.err) {
        alert(resClaims.data.err);
        return redirect('/')
    }

    let res = {}

    if (userState.role === 'CLAIM_ASSESSOR') {
        res = { ...resUser.data.msg, claims: resClaims.data.msg }
    } else {
        res = { ...resUser.data.msg }
    }

    return res
}

async function docUploadLoader(req) {
    const userState = store.getState().user
    if (!userState.authToken) return redirect('/login')
    if (userState.role === "CLAIM_ASSESSOR") {
        alert('Only policy holders can upload document on their claims')
        return redirect('/')
    }
    const header = {
        headers: {
            Authorization: `Bearer ${userState.authToken}`
        }
    }
    const res = await axios.get(`${process.env.REACT_APP_BACKEND_DOMAIN}/document/count/${req.params.claimId}`, header)
    if (res.data.err) {
        alert(res.data.err)
        return redirect('/')
    }
    return (15 - res.data.msg)
}

async function claimInitLoader(req) {
    const userState = store.getState().user
    if (!userState.authToken) return redirect('/login')
    if (userState.role === "CLAIM_ASSESSOR") {
        alert('Only policy holders can initialize claims')
        return redirect('/')
    }

    const header = {
        headers: {
            Authorization: `Bearer ${userState.authToken}`
        }
    }

    const res1 = await axios.get(`${process.env.REACT_APP_BACKEND_DOMAIN}/policy/hosp/all-codes`, header)
    if (res1.data.err) {
        alert(res1.data.err)
        return redirect('/')
    }

    const res2 = await axios.get(`${process.env.REACT_APP_BACKEND_DOMAIN}/policy/user-policies/${userState.userId}`, header)
    if (res2.data.err) {
        alert(res2.data.err)
        return redirect('/')
    }

    const [hospCodes, policyIds] = [['--'], ['--']]

    Array.from(res1.data.msg).forEach(o => hospCodes.push(o.code))
    Array.from(res2.data.msg).forEach(o => policyIds.push(o.id))

    return { hospCodes, policyIds }
}

async function updateReportLoader(req) {
    const userState = store.getState().user
    if (!userState.authToken) return redirect('/login')
    if (userState.role === "POLICY_HOLDER") {
        alert('Insufficient permission to update claim')
        return redirect('/')
    }

    const header = {
        headers: {
            Authorization: `Bearer ${userState.authToken}`
        }
    }
    const res = await axios.get(`${process.env.REACT_APP_BACKEND_DOMAIN}/report/${req.params.reportId}`, header)
    if (res.data.err) {
        alert(res.data.err)
        return redirect('/')
    }
    return res.data.msg
}

async function dashboardLoader() {
    const userState = store.getState().user

    if (!userState.authToken) return redirect('/login')

    const header = {
        headers: {
            Authorization: `Bearer ${userState.authToken}`
        }
    }

    let res = ''
    if (userState.role === 'CLAIM_ASSESSOR') {
        res = await axios.get(`${process.env.REACT_APP_BACKEND_DOMAIN}/claim/pending`, header)
    } else if (userState.role === "POLICY_HOLDER") {
        res = await axios.get(`${process.env.REACT_APP_BACKEND_DOMAIN}/claim/my-claims`, header)
    } else {
        return { err: 'Invalid role' }
    }

    if (res.data.err) {
        alert(res.data.err)
        return { err: res.data.err }
    }
    return res.data.msg
}

async function viewReportLoader(req) {
    const userState = store.getState().user

    if (!userState.authToken) return redirect('/login')

    const header = {
        headers: {
            Authorization: `Bearer ${userState.authToken}`
        }
    }
    const res = await axios.get(`${process.env.REACT_APP_BACKEND_DOMAIN}/report/${req.params.reportId}`, header)
    if (res.data.err) {
        alert(res.data.err)
        return { err: res.data.err }
    }
    return res.data.msg
}

async function viewClaimLoader(req) {
    const userState = store.getState().user

    if (!userState.authToken) return redirect('/login')

    const header = {
        headers: {
            Authorization: `Bearer ${userState.authToken}`
        }
    }

    const url = `${process.env.REACT_APP_BACKEND_DOMAIN}/claim/${req.params.claimId}`
    const res = await axios.get(url, header)
    if (res.data.err) {
        alert(res.data.err)
        return { err: res.data.err }
    }
    return res.data.msg
}

function NavLayout() {
    return (<div className="flex flex-col min-h-screen">
        <Navbar />
        <Outlet />
        <Footer />
    </div>)
}
