import Rewards from './rewards'

import React from 'react';
import { render, screen } from '@testing-library/react';

import {
    createMemoryRouter,
    RouterProvider,
} from "react-router-dom";


test('It displays program name if exists', async () => {
    function loader() {
        return [
            {
                programName: "my program",
                programUrl: "myurl"
            }
        ]
    }
    const router = createMemoryRouter([
        {
            path: "/",
            loader,
            element: <Rewards />,
        },
    ], { initialEntries: ["/"] });
    render(<RouterProvider router={router} />)
    const reward = await screen.findByText(/Reward program my program/);
    expect(reward).toBeInTheDocument();
    const rewardUrl = await screen.findByText(/Url is myurl/);
    expect(rewardUrl).toBeInTheDocument();
});
