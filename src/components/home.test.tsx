import Home from './home'

import React from 'react';
import { render, screen } from '@testing-library/react';

import {
    createMemoryRouter,
    RouterProvider,
} from "react-router-dom";


test('It displays user if exists', async () => {
    const router = createMemoryRouter([
        {
            path: "/",
            element: <Home />,
        },
    ], { initialEntries: ["/"] });
    render(<RouterProvider router={router} />)
    const user = await screen.findAllByText(/Existing Relationships/i);
    expect(user.length).toBeGreaterThan(0)//toBeInTheDocument();
});