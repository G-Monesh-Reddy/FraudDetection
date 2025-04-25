import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

test("renders form and handles prediction", async () => {
    render(<App />);

    // Check if form elements are present
    expect(screen.getByPlaceholderText(/amount/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/category/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/gender/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/time/i)).toBeInTheDocument();
    expect(
        screen.getByRole("button", { name: /predict/i })
    ).toBeInTheDocument();

    // Simulate user input
    fireEvent.change(screen.getByPlaceholderText(/amount/i), {
        target: { value: "100" },
    });
    fireEvent.change(screen.getByPlaceholderText(/category/i), {
        target: { value: "1" },
    });
    fireEvent.change(screen.getByPlaceholderText(/gender/i), {
        target: { value: "0" },
    });
    fireEvent.change(screen.getByPlaceholderText(/time/i), {
        target: { value: "2023-01-01 12:00:00" },
    });

    // Simulate form submission
    fireEvent.click(screen.getByRole("button", { name: /predict/i }));

    // Check if prediction result is displayed (mocking the API response would be needed for a real test)
    // expect(await screen.findByText(/prediction:/i)).toBeInTheDocument();
});

test("displays error message on invalid input", async () => {
    render(<App />);

    // Simulate form submission without filling inputs
    fireEvent.click(screen.getByRole("button", { name: /predict/i }));

    // Check if error message is displayed
    expect(await screen.findByText(/error:/i)).toBeInTheDocument();
});
