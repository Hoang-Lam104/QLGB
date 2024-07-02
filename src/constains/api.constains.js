const DOMAIN_API_LOCAL = process.env.REACT_APP_DOMAIN_API

export const AxiosClientConfig = {
    DOMAIN_API: DOMAIN_API_LOCAL,
    AUTH_TYPES: 'Bearer',
    CONTENT_TYPE: 'application/json',
};

export const API = {
    LOGIN: '/login',
    USER: '/user',
    MEETING: '/meetings',
    DEPARTMENT: '/departments',
    ROOM: '/rooms',
    REASON: '/reasons',
    LOGOUT: '/logout'
}