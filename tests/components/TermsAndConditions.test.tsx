import {render, screen} from "@testing-library/react";
import TermsAndConditions from "../../src/components/TermsAndConditions.tsx";
import {userEvent} from "@testing-library/user-event";

describe("TermsAndConditions", () => {
    it("should render the terms and conditions", () => {
        render(<TermsAndConditions/>);

        const heading = screen.getByRole('heading');
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent(/terms & conditions/i);

        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeInTheDocument();
        expect(checkbox).not.toBeChecked();

        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        expect(button).toBeDisabled();
    });

    it("should enable the button when the checkbox is checked", async () => {
        render(<TermsAndConditions/>);

        const checkbox = screen.getByRole('checkbox');
        const button = screen.getByRole('button');

        const user = userEvent.setup();
        await user.click(checkbox);
        expect(button).toBeEnabled();
    });
});