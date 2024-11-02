import {useEffect} from 'react'
import {Route, Routes} from 'react-router-dom'

import './App.css'
import {useAppDispatch} from './redux/hooks'
import Header from './components/base/Header'

import Login from './components/auth/Login'
import Register from './components/auth/Register'
import {initializeApp} from './redux/reducers/appReducer'
import Projects from './components/project/Projects'


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
                    <Route path='/projects' element={<Projects />}/>
                </Routes>
            </div>
        </div>
    )
}

export default App
