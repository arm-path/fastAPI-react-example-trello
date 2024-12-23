import {useEffect} from 'react'
import {Route, Routes} from 'react-router-dom'

import './App.css'
import {useAppDispatch} from './redux/hooks'
import Header from './components/base/Header'

import Login from './components/auth/Login'
import Register from './components/auth/Register'
import {initializeApp} from './redux/reducers/appReducer'
import Projects from './components/project/Projects'
import DetailProject from './components/project/detailProject/DetailProject.tsx';
import Logout from './components/auth/Logout.tsx';
import Profile from './components/profile/Profile.tsx';
import ForgotPassword from './components/auth/ForgotPassword.tsx';
import ChangePassword from './components/auth/ChangePassword.tsx';


function App() {
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(initializeApp())
    }, [dispatch])


    return (
        <div>
            <div className='header'>
                <Header/>
            </div>
            <div className='content'>
                <Routes>
                    <Route path='/register' element={<Register/>}/>
                    <Route path='/login' element={<Login/>}/>
                    <Route path='/logout' element={<Logout/>}/>
                    <Route path='/forgot-password' element={< ForgotPassword/>}/>
                    <Route path='/change-password/:token' element={< ChangePassword/>}/>
                    <Route path='/profile' element={<Profile/>}/>
                    <Route path='/projects' element={<Projects/>}/>
                    <Route path='/projects/project/:projectID' element={<DetailProject/>}/>
                </Routes>
            </div>
        </div>
    )
}

export default App
