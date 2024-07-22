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

const getAllDepartments = () => {
    const url = API.DEPARTMENT
    return AxiosClient.get(url + '/all')
}

const toogleActiveDepartment = (id) => {
    const url = API.DEPARTMENT
    return AxiosClient.put(url + '/active/' + id)
}


export { getDepartments, createDepartment, getAllDepartments, toogleActiveDepartment }