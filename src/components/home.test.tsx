import Home from './home'

import React from 'react';
import { render, screen } from '@testing-library/react';

import {
    createMemoryRouter,
    RouterProvider,
} from "react-router-dom";


test('It displays user if exists', async () => {
    function loader() {
        return {
            name: {
                first: "some",
                last: "user"
            }
        }
    }
    const router = createMemoryRouter([
        {
            path: "/",
            loader,
            element: <Home />,
        },
    ], { initialEntries: ["/"] });
    render(<RouterProvider router={router} />)
    const user = await screen.findByText(/Hello some user/i);
    expect(user).toBeInTheDocument();
});