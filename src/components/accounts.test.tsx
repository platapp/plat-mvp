import Accounts from './accounts'

import React from 'react';
import { render, screen } from '@testing-library/react';

import {
    createMemoryRouter,
    RouterProvider,
} from "react-router-dom";


test('It displays summary if exists', async () => {
    function loader() {
        return [{
            account: {
                depositAccount: {
                    totalBalance: 500,
                    count: 3
                }
            },
            bankName: "hello world bank"

        }]
    }
    const router = createMemoryRouter([
        {
            path: "/",
            loader,
            element: <Accounts />,
        },
    ], { initialEntries: ["/"] });
    render(<RouterProvider router={router} />)
    const account = await screen.findByText(/You have(.*)3(.*)Deposit accounts(.*)with a total value of(.*)500/i);
    expect(account).toBeInTheDocument();
});
