import { ActionFunctionArgs } from "react-router-dom";
import {
    getAuth,
    Customer,
    getCustomerInfo,
} from '../services/fdx';
import { createBrowserRouter } from "react-router-dom";
import Home from '../components/home'
import { MenuItems } from './children'
import {
    removeAllQueryParams,
    routeToFDXLogin
} from "../utils";
const CODE_NAME = "code"

export const loginLoader = async ({ request }: ActionFunctionArgs): Promise<Customer | undefined> => {
    const url = new URL(request.url);
    const code = url.searchParams.get(CODE_NAME)
    if (!code) {
        routeToFDXLogin() //will only get here on first load; see shouldRevalidateLogin
        return
    }
    if (code) {
        await getAuth(code)
    }
    removeAllQueryParams(url)
    return getCustomerInfo()
}

export const shouldRevalidateLogin = ({ nextUrl }: { nextUrl: URL }) => {
    return nextUrl.searchParams.has(CODE_NAME)
}

const router = createBrowserRouter([
    {
        path: "/",
        loader: loginLoader,
        element: <Home />,
        shouldRevalidate: shouldRevalidateLogin,
        children: MenuItems.map(({ route, element, loader }) => ({
            path: route,
            element,
            loader
        }))
    },
]);

export default router