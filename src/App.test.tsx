import React from 'react';
import { render, screen } from '@testing-library/react';
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
  render(<RouterProvider router={router} />);
  const hello = screen.getByText(/Hello/i);
  expect(hello).toBeInTheDocument();
});
