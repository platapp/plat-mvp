const LOGIN_URL = `${process.env.REACT_APP_LOGIN_URL}/${process.env.REACT_APP_CLIENT_ID}`
export const routeToFDXLogin = () => {
    window.location.href = LOGIN_URL
}
export const logout = () => {
    routeToFDXLogin()
}