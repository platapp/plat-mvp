import { ActionFunctionArgs } from "react-router-dom";
import {
    getAuth,
    getCustomerInfo,
} from '../services/fdx';
import { createBrowserRouter } from "react-router-dom";
import Home, { User } from '../components/home'
import { MenuItems } from './children'
import {
    removeAllQueryParams,
    routeToFDXLogin,
    getAccessTokenFromLocalStorage,
    storeAccessTokenInLocalStorage
} from "../utils";
const CODE_NAME = "code"

export const loginLoader = async ({ request }: ActionFunctionArgs): Promise<User | undefined> => {
    const url = new URL(request.url);
    const code = url.searchParams.get(CODE_NAME)
    let accessToken = getAccessTokenFromLocalStorage()
    if (!accessToken && !code) {
        routeToFDXLogin() //will only get here on first load; see shouldRevalidateLogin
        return
    }
    if (!accessToken && code) {
        accessToken = await getAuth(code)
    }
    else if (!accessToken) {
        //can never get here, but needed so tyepscript knows that accesstoken has a value
        return
    }
    removeAllQueryParams(url)
    storeAccessTokenInLocalStorage(accessToken)
    const customerInfo = await getCustomerInfo(accessToken)
    return { ...customerInfo, accessToken }

}

export const shouldRevalidateLogin = ({ nextUrl }: { nextUrl: URL }) => {
    return nextUrl.searchParams.has(CODE_NAME)
}

const router = createBrowserRouter([
    {
        path: "/",
        loader: loginLoader,
        id: "root", //in order to get the data from this route from children
        element: <Home />,
        shouldRevalidate: shouldRevalidateLogin,
        children: MenuItems.map(({ route, element }) => ({
            path: route,
            element
        }))
    },
]);

export default router