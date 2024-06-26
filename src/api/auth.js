import { API } from "../constains/api.constains"
import AxiosClient from "./AxiosClient"

const login = (data) => {
    const url = API.LOGIN
    return AxiosClient.post(url, data)
}

const logout = (id) => {
    const url = API.LOGOUT

    localStorage.removeItem('userId')
    localStorage.removeItem('accessToken')

    return AxiosClient.post(url + '/' + id)
}

export { login, logout }