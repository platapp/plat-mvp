import { URL } from "url"

const LOGIN_URL = `${process.env.REACT_APP_LOGIN_URL}/${process.env.REACT_APP_CLIENT_ID}`
export const routeToFDXLogin = () => {
    window.location.href = LOGIN_URL
}
const ACCESS_CODE_NAME = "accessCode"
export const logout = () => {
    window.localStorage.removeItem(ACCESS_CODE_NAME)
    routeToFDXLogin()
}

export const getAccessTokenFromLocalStorage = () => {
    return window.localStorage.getItem(ACCESS_CODE_NAME)
}

export const storeAccessTokenInLocalStorage = (accessToken: string) => {
    window.localStorage.setItem(ACCESS_CODE_NAME, accessToken)
}
export const removeAllQueryParams = (url: URL) => {
    Array.from(url.searchParams.keys()).forEach(v => {
        url.searchParams.delete(v);
    })
    window.history.pushState({}, "", url)
}