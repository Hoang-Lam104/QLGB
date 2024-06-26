import AxiosClient from './AxiosClient';
import { API } from '../constains/api.constains';

const getUserInfo = (id) => {
    const url = API.USER
    return AxiosClient.get(`${url}/${id}/info`)
}

const getUserMeetings = (id, pageIndex, numberInPage, data) => {
    const url = API.USER
    return AxiosClient.get(`${url}/${id}/meetings?pageIndex=${pageIndex}&numberInPage=${numberInPage}`, { params: data })
}

const attendMeeting = (data) => {
    const url = API.USER
    return AxiosClient.put(url + '/attend', data)
}

const putInfo = (id, data) => {
    const url = API.USER
    return AxiosClient.put(url + '/' + id + '/info', data)
}

export { getUserInfo, getUserMeetings, attendMeeting, putInfo }