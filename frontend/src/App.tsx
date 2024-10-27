import './App.css'
import Header from './components/base/Header.tsx'
import Registration from './components/authentication/Registration.tsx'

function App() {
    return (
        <div>
            <div className='header'>
                <Header/>
            </div>
            <div className='content'>
                <Registration/>
            </div>
        </div>
    )
}

export default App
