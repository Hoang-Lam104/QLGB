import AxiosClient from './AxiosClient';
import { API } from '../constains/api.constains';


const getRooms = () => {
    const url = API.ROOM
    return AxiosClient.get(url)
}

export { getRooms }