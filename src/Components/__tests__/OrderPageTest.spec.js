import React from "react";
import ReactDOM from "react-dom";
import OrderPage from "../OrderPage";
import OrderForm from "../OrderForm";
import { render, fireEvent, cleanup, screen } from "@testing-library/react";

afterEach(cleanup);
//testing a controlled component form.
it("Renders a title", () => {
  const { getByText, getByAltText } = render(<OrderPage />);

  expect(screen.getByText(/Magic Potion #1/i).textContent).toBe(
    "Magic Potion #1"
  );
});

it("Renders a title for Contact", () => {
  const { getByText, getByAltText } = render(<OrderForm />);

  expect(screen.getByText(/Contact/i).textContent).toBe("Contact");
});

it("Renders a title for Billing Information", () => {
  const { getByText, getByAltText } = render(<OrderForm />);

  expect(screen.getByText(/Billing Information/i).textContent).toBe(
    "Billing Information"
  );
});

it("Renders a Button 'Place Your Order'", () => {
  const { getByText, getByAltText, getByTestId } = render(<OrderForm />);

  expect(screen.getByTestId("order-btn-txt")).toHaveTextContent(
    "PLACE YOUR ORDER"
  );
});

// it("Renders an image", () => {
//   const { getByTestId } = render(<OrderPage />);

//   expect(screen.getByTestId("potion-img")).toBe("potion-img");
// });

//  it('submiting a form works correctly', () => {
//      const { getByTestId, getByText } = render(<HooksForm1 />);

//      expect(getByText(/Submit Value/i).textContent).toBe("Submit Value: ")

//      fireEvent.submit(getByTestId("form"), {target: {text1: {value: 'Text' } } })

//      expect(getByText(/Submit Value/i).textContent).not.toBe("Submit Value: ")
//   })
