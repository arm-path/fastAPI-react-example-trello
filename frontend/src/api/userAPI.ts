import axios from 'axios'
import Cookies from "js-cookie";

const instance = axios.create({
    baseURL: 'http://localhost:8000/user/',
    withCredentials: true
})


const userAPI = {
    async detail() {
        const headers = {
            'Authorization': 'Bearer ' + Cookies.get('access_token')
        }
        return await instance.get('/detail', {headers}).then(
            response => response
        ).catch(
            error => error
        )
    }
}

export default userAPI