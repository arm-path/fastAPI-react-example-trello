import {useEffect} from 'react'
import {Route, Routes, useNavigate} from 'react-router-dom'

import './App.css'
import {useAppDispatch, useAppSelector} from './redux/hooks.ts'
import Header from './components/base/Header.tsx'
import Registration from './components/authentication/Registration.tsx'
import Authentication from './components/authentication/Authentication.tsx'
import {initializeApp} from './redux/reducers/appReducer.ts'



function App() {
    const dispatch = useAppDispatch()
    const isInitialized = useAppSelector(state => state.app.initialization)
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(initializeApp())
    }, [dispatch])

    useEffect(() => {
        if (isInitialized) {
            navigate('/authentication')
        }
    }, []);
    return (
        <div>
            <div className='header'>
                <Header/>
            </div>
            <div className='content'>
                <Routes>
                    <Route path='/registration' element={<Registration/>}/>
                    <Route path='/authentication' element={<Authentication/>}/>
                </Routes>
            </div>
        </div>
    )
}

export default App
