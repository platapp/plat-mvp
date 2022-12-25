
import React from 'react';
import { render, screen } from '@testing-library/react';

import {
    createMemoryRouter,
    RouterProvider,
} from "react-router-dom";
import { BankLogin, generateInitialData } from '../state/bankLogin';
import ListBanks from './listBanks';

test('It displays welcome', async () => {

    const router = createMemoryRouter([
        {
            path: "/",
            element: <BankLogin.Provider value={generateInitialData()}>
                <ListBanks />
            </BankLogin.Provider>,
        },
    ], { initialEntries: ["/"] });
    render(<RouterProvider router={router} />)
    const welcome = await screen.findByText(/Welcome, please select your existing relationships/i);
    expect(welcome).toBeInTheDocument();
});

test('It displays banks', async () => {

    const router = createMemoryRouter([
        {
            path: "/",
            element: <BankLogin.Provider value={generateInitialData()}>
                <ListBanks />
            </BankLogin.Provider>,
        },
    ], { initialEntries: ["/"] });
    render(<RouterProvider router={router} />)
    const bank = await screen.findByText(/Belieber Bank/i);
    expect(bank).toBeInTheDocument();
});