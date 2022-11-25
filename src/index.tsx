import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import type { ActionFunctionArgs } from "react-router-dom";
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";

import {
  getAuth
} from './services/fdx';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const CODE_NAME = "code"
//get query parameter, if any
export async function loader({ request }: ActionFunctionArgs) {
  console.log("Got here")
  const url = new URL(request.url);
  const code = url.searchParams.get(CODE_NAME);
  if (code) {
    return await getAuth(code)
  }
  else {
    return undefined
  }
}

//only reload the loader if the query parameter exists
const shouldRevalidate = ({ nextUrl }: { nextUrl: URL }) => {
  return nextUrl.searchParams.has(CODE_NAME)
}

const router = createBrowserRouter([
  {
    path: "/",
    loader,
    element: <App />,
    shouldRevalidate
  },
]);
root.render(
  <React.StrictMode>
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-5">
      <div className="container-fluid">
        <div className="navbar-brand" >Plat</div>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <form className="d-flex" id="login">
            <label htmlFor="staticEmail2" className="visually-hidden">Email</label>
            <input type="text" readOnly className="form-control-plaintext text-white" id="staticEmail2" value="email@example.com" />
            <button className="btn btn-success" type="submit" id="logout">Logout</button>
          </form>
        </div>
      </div>
    </nav>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
