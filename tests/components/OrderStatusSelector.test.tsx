import {render, screen} from '@testing-library/react';

import OrderStatusSelector from '../../src/components/OrderStatusSelector';
import {Theme} from "@radix-ui/themes";
import {expect} from "vitest";
import {userEvent} from "@testing-library/user-event";

describe('OrderStatusSelector', () => {
    const renderOrderStatusSelector = () => {
        const onChange = vi.fn();
        render(
            <Theme>
                <OrderStatusSelector onChange={onChange}/>
            </Theme>
        );
        const select = screen.getByRole('combobox');
        const getOptions = () => screen.getAllByRole('option');
        return {select, onChange, getOptions};
    }
    it('should render the order status selector', async () => {
        const {select} = renderOrderStatusSelector();
        expect(select).toBeInTheDocument();
    });

    it('should render new as the default value', async () => {
        const {select} = renderOrderStatusSelector();
        expect(select).toHaveTextContent(/new/i);
    });

    it('should render the correct values', async () => {
        const {select, getOptions} = renderOrderStatusSelector();
        const user = userEvent.setup();
        await user.click(select);

        const options = getOptions();
        expect(options).toHaveLength(3);

        const labels = options.map(option => option.textContent);
        expect(labels).toEqual(['New', 'Processed', 'Fulfilled']);
    });
});