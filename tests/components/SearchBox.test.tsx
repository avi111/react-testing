import {render, screen} from "@testing-library/react";

import SearchBox from "../../src/components/SearchBox.tsx";
import {userEvent} from "@testing-library/user-event";
import {expect} from "vitest";

describe("SearchBox", () => {
    const renderSearchBox = () => {
        const onChange = vi.fn()

        render(<SearchBox onChange={onChange}/>);

        const input = screen.getByPlaceholderText(/search/i);
        return {input, onChange};
    }

    it("should render the search box", async () => {
        const {input} = renderSearchBox();
        expect(input).toBeInTheDocument();
    });

    it("should call onChange when pressing enter", async () => {
        const {input, onChange} = renderSearchBox();
        const searchText = "hello world";
        const user = userEvent.setup();
        await user.type(input, `${searchText}{enter}`);
        expect(onChange).toHaveBeenCalledOnce();
        expect(onChange).toHaveBeenCalledWith(searchText);
    });

    it("should not call onChange when pressing enter with empty searchText", async () => {
        const {input, onChange} = renderSearchBox();
        const searchText = "";
        const user = userEvent.setup();
        await user.type(input, `${searchText}{enter}`);
        expect(onChange).not.toHaveBeenCalledOnce();
        expect(onChange).not.toHaveBeenCalledWith(searchText);
    });
});