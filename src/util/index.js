export const formatDate = (param) => {
    var date = new Date(param)
    var hour = date.getHours() > 10 ? date.getHours() : '0' + date.getHours()
    var minute = date.getMinutes() > 10 ? date.getMinutes() : '0' + date.getMinutes()

    var day = date.getDate() > 10 ? date.getDate() : '0' + date.getDate()
    var month = date.getMonth() > 10 ? date.getMonth() : '0' + date.getMonth()
    var year = date.getFullYear()

    return `${hour}:${minute} ${day}/${month}/${year}`
}