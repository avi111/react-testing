import {render, screen} from '@testing-library/react';

import OrderStatusSelector from '../../src/components/OrderStatusSelector';
import {Theme} from "@radix-ui/themes";
import {describe, expect} from "vitest";
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
        const user = userEvent.setup();
        const getOption = (label: RegExp) => screen.findByRole('option', {name: label});

        return {select, onChange, getOptions, user, getOption};
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
        const {select, getOptions, user} = renderOrderStatusSelector();
        await user.click(select);

        const options = getOptions();
        expect(options).toHaveLength(3);

        const labels = options.map(option => option.textContent);
        expect(labels).toEqual(['New', 'Processed', 'Fulfilled']);
    });

    it.each([
        {label: /processed/i, value: 'processed'},
        {label: /fulfilled/i, value: 'fulfilled'},
    ])(`should call the onChange callback with $value when the $label is selected`, async ({label, value}) => {
        const {select, onChange, user, getOption} = renderOrderStatusSelector();
        await user.click(select);

        const option = await getOption(label);
        await user.click(option);

        expect(onChange).toHaveBeenCalledWith(value);
    });

    it('should call the onChange callback with new when the new option is selected', async () => {
        const {select, onChange, user, getOption} = renderOrderStatusSelector();

        await user.click(select);
        const processedOption = await getOption(/processed/i);
        await user.click(processedOption);

        await user.click(select);
        const newOption = await getOption(/new/i);
        await user.click(newOption);

        expect(onChange).toHaveBeenCalledWith('new');
    });
});