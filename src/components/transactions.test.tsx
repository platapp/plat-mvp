import Transactions from './transactions'

import React from 'react';
import { render, screen } from '@testing-library/react';

import {
    createMemoryRouter,
    RouterProvider,
} from "react-router-dom";


test('It displays transactions if exists', async () => {
    function loader() {
        return {
            averageTransactionSize: 1100.103,
            totalTransactions: 300
        }
    }
    const router = createMemoryRouter([
        {
            path: "/",
            loader,
            element: <Transactions />,
        },
    ], { initialEntries: ["/"] });
    render(<RouterProvider router={router} />)
    const transactionSize = await screen.findByText(/Average transaction size: 1100.10/);
    expect(transactionSize).toBeInTheDocument();

    const totalTransactions = await screen.findByText(/Total transactions: 300/);
    expect(totalTransactions).toBeInTheDocument();
});
