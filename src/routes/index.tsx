import { ActionFunctionArgs } from "react-router-dom";
import {
    getAuth,
    getCustomerInfo,
} from '../services/fdx';
import { createBrowserRouter } from "react-router-dom";
import Home, { User } from '../components/home'
import { MenuItems } from './children'
const CODE_NAME = "code"
const LOGIN_URL = `${process.env.REACT_APP_LOGIN_URL}/${process.env.REACT_APP_CLIENT_ID}`
//const ACCESS_CODE_NAME = "accessCode"
export const loginLoader = async ({ request }: ActionFunctionArgs): Promise<User | undefined> => {
    const url = new URL(request.url);
    const code = url.searchParams.get(CODE_NAME)
    if (code) {
        const accessToken = await getAuth(code)
        const customerInfo = await getCustomerInfo(accessToken)
        return { ...customerInfo, accessToken }
    }
    else {
        window.location.href = LOGIN_URL //will only get here on first load; see shouldRevalidateLogin
    }
}

export const shouldRevalidateLogin = ({ nextUrl }: { nextUrl: URL }) => {
    console.log(nextUrl)
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
            //loader,
            element
        }))
    },
]);

export default router