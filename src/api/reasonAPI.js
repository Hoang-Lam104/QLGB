import AxiosClient from './AxiosClient';
import { API } from '../constains/api.constains';

const getReasons = () => {
    const url = API.REASON
    return AxiosClient.get(url)
}

const toogleActiveReason = (id) => {
    const url = API.REASON
    return AxiosClient.put(url + '/active/' + id)
}

const createReason = (data) => {
    const url = API.REASON
    return AxiosClient.post(url + '/new', data)
}

export { getReasons, toogleActiveReason, createReason }