import {render, screen} from '@testing-library/react';

import ToastDemo from '../../src/components/ToastDemo';
import {Toaster} from "react-hot-toast";
import {userEvent} from "@testing-library/user-event";
import {expect} from "vitest";

describe('ToastDemo', () => {
    const renderToastDemo = () => {
        render(
            <>
                <ToastDemo/>
                <Toaster/>
            </>
        );
        const button = screen.getByRole('button');
        return {button};
    }
    it('should render the button', async () => {
        const {button} = renderToastDemo();
        expect(button).toBeInTheDocument();
        expect(button.textContent).not.toBeNull();
        expect(/show/i.test(`${button.textContent}`)).toBeTruthy();
    });

    it('should render the toast', async () => {
        const {button} = renderToastDemo();
        const user = userEvent.setup();
        await user.click(button);

        const toast = await screen.findByText(/success/i);
        expect(toast).toBeInTheDocument();
    });
});