import { URL } from "url"

const LOGIN_URL = `${process.env.REACT_APP_LOGIN_URL}/${process.env.REACT_APP_CLIENT_ID}`
export const routeToFDXLogin = () => {
    window.location.href = LOGIN_URL
}
export const logout = () => {
    routeToFDXLogin()
}

export const removeAllQueryParams = (url: URL) => {
    Array.from(url.searchParams.keys()).forEach(v => {
        url.searchParams.delete(v);
    })
    window.history.pushState({}, "", url)
}