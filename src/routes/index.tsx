import { ActionFunctionArgs, redirect } from "react-router-dom";
import { getAuth } from '../services/fdx';
import { createBrowserRouter } from "react-router-dom";
import Home from '../components/home'
import { MenuItems, RELATIONSHIP_URL } from './children'
import { routeToFDXLogin } from "../utils";
import Login from "../components/login";
import Start from '../components/start'

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
    return redirect(RELATIONSHIP_URL)
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
        children: MenuItems.map(({ route, element, loader }) => ({
            path: route,
            element,
            loader
        }))
    },
    {
        path: "/login",
        element: <Login />,
        loader: loginLoader
    },
    {
        path: "/start",
        element: <Start />
    }
]);

export default router