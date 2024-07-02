import AxiosClient from './AxiosClient';
import { API } from '../constains/api.constains';


const getDepartments = () => {
    const url = API.DEPARTMENT
    return AxiosClient.get(url)
}

const createDepartment = (data) => {
    const url = API.DEPARTMENT
    return AxiosClient.post(url + '/new', data)
}

export { getDepartments, createDepartment }