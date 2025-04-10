
import './App.css'
import { Navigate, Route,Routes } from 'react-router-dom'
import SignUpPage from './pages/auth/signup/SignUpPage'
import LoginPage from './pages/auth/login/LoginPage'
import HomePage from './pages/Home/Home'
import Sidebar from './components/common/Sidebar'
import RightPanel from './components/common/RightPanel'
import NotificationPage from './pages/notification/NotificationPage'
import ProfilePage from './pages/profilePage/ProfilePage'
import { Toaster } from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import { baseUrl } from './constant/url'
import LoadingSpinner from './components/common/LoadingSpinner'
import Articles from './pages/articles/articles'
import Search from './components/searching/Search'
import BottomNavbar from './components/common/BottomNavbar'
import ArticlesReads from './pages/articles/ArticlesReads'

function App() {
  const {data: authUser, isLoading}  = useQuery({
    queryKey : ["authUser"],
    queryFn : async () => {
      try {
        const res = await fetch(`${baseUrl}/api/auth/me`,{
          method : 'GET',
          credentials:"include",
          headers : {
             "Content-Type": "application/json",
          },
          retry : false
        })
        const data = await res.json();
        if (data.error) {
          return null
        }
        if(!res.ok){
          throw new Error(data.error || "Failed to fetch user")
        }
        console.log("Auth user:", data)
        
        return data;
      } catch (error) {
         throw new Error(error.message);
      }
    }
  })
  console.log(authUser)
  if(isLoading){
    return <div className="flex justify-center items-center h-screen" >
       <LoadingSpinner size="lg"/>
    </div>
  }
  
  return (
    <>
      <div className="flex max-w-6x1 mx-auto">
        {authUser ? <Sidebar /> : null}
        <Routes>
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
          />
          <Route
            path="/notifications"
            element={authUser ? <NotificationPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/articles"
            element={authUser ? <Articles /> : <Navigate to="/login" />}
          />
          <Route
            path="/articleReads/:id"
            element={authUser ? <ArticlesReads /> : <Navigate to="/login" />}
          />
          <Route
            path="/search"
            element={authUser ? <Search /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile/:username"
            element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
          />
        </Routes>
        {authUser ? <RightPanel /> : null}
        <Toaster />
      </div>
      <BottomNavbar />
    </>
  );
}

export default App
