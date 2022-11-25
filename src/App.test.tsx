import React from 'react';
import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

import App from './App';
import {
  createMemoryRouter,
  RouterProvider,
} from "react-router-dom";
async function loader() {
  return "hello"
}
const router = createMemoryRouter([
  {
    path: "/",
    loader,
    element: <App />,
  },
]);
test('renders learn react link', () => {
  act(() => {
    render(<App />)
  })
  const hello = screen.queryAllByText(/Accounts/i)[0];
  expect(hello).toBeInTheDocument();
});
