import { ActionFunctionArgs, redirect } from "react-router-dom";
import {
    getAuth,
    Customer,
    getCustomerInfo,
} from '../services/fdx';
import { createBrowserRouter } from "react-router-dom";
import Home from '../components/home'
import { MenuItems } from './children'
import {
    routeToFDXLogin
} from "../utils";
import Login from "../components/login";
const CODE_NAME = "code"

//note that an "unathorized" will be sent back from any fetch that isn't "getAuth".
//this will then force the client to routeToFDX, see ../services/fdx.tsx
export const loginLoader = async ({ request }: ActionFunctionArgs): Promise<Response | undefined> => {
    const url = new URL(request.url);
    const code = url.searchParams.get(CODE_NAME)
    if (!code) {
        routeToFDXLogin() //will only get here if a mistake was made (eg, going to this route manually through the browser)
        return
    }
    if (code) {
        await getAuth(code)
    }
    return redirect("/")
}

export const homeLoader = async ({ request }: ActionFunctionArgs): Promise<Customer> => {
    return getCustomerInfo()
}

const router = createBrowserRouter([
    {
        path: "/",
        loader: homeLoader,
        element: <Home />,
        children: MenuItems.map(({ route, element, loader }) => ({
            path: route,
            element,
            loader
        }))
    },
    { path: "/login", element: <Login />, loader: loginLoader }
]);

export default router