import { API } from "../constains/api.constains"
import AxiosClient from "./AxiosClient"

const getMeetings = (pageIndex, numberInPage) => {
    const url = API.MEETING
    return AxiosClient.get(url + '?pageIndex=' + pageIndex + '&numberInPage=' + numberInPage)
}

const createMeeting = (data) => {
    const url = API.MEETING
    return AxiosClient.post(url, data)
}

const getMeetingAttendees = (id, pageIndex, numberInPage) => {
    const url = API.MEETING
    return AxiosClient.get(`${url}/${id}/attendees?pageIndex=${pageIndex}&numberInPage=${numberInPage}`)
}

const deleteMeeting = (id) => {
    const url = API.MEETING
    return AxiosClient.delete(url + '/' + id)
}

const toggleActiveMeeting = (id) => {
    const url = API.MEETING
    return AxiosClient.put(url + '/active/' + id)
}

export { getMeetings, createMeeting, deleteMeeting, getMeetingAttendees, toggleActiveMeeting }