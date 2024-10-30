import {Route, Routes} from 'react-router-dom'

import './App.css'
import Header from './components/base/Header.tsx'
import Registration from './components/authentication/Registration.tsx'
import Authentication from "./components/authentication/Authentication.tsx";


function App() {
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
