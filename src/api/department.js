import AxiosClient from './AxiosClient';
import { API } from '../constains/api.constains';


const getDepartments = () => {
    const url = API.DEPARTMENT
    return AxiosClient.get(url)
}

export { getDepartments }