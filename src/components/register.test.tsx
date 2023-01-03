import React from 'react';
import { render, screen } from '@testing-library/react';

import {
    createMemoryRouter,
    RouterProvider,
} from "react-router-dom";
import Register from './register';


test('It displays program name if exists', async () => {
    function loader() {
        return [
            {
                bankName: "Hello world",
                customer: {
                    name: {
                        first: "hi",
                        last: "goodbye"
                    },
                    dateOfBirth: "2001-04-04",
                    addresses: [
                        { city: "paris", postalCode: "12356" }
                    ]
                }
            },

        ]
    }
    const router = createMemoryRouter([
        {
            path: "/",
            loader,
            element: <Register />,
        },
    ], { initialEntries: ["/"] });
    render(<RouterProvider router={router} />)
    const selectLabel = await screen.findByText(/Select bank to populate information/);
    expect(selectLabel).toBeInTheDocument();
});
