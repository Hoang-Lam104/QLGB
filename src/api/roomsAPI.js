import AxiosClient from './AxiosClient';
import { API } from '../constains/api.constains';


const getRooms = () => {
    const url = API.ROOM
    return AxiosClient.get(url)
}

const toogleActiveRoom = (id) => {
    const url = API.ROOM
    return AxiosClient.put(url + '/active/' + id)
}

const createRoom = (data) => {
    const url = API.ROOM
    return AxiosClient.post(url + '/new', data)
}

export { getRooms, toogleActiveRoom, createRoom }