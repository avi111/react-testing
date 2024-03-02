import {render, screen} from "@testing-library/react";
import {describe, expect} from "vitest";
import ExpandableText from "../../src/components/ExpandableText.tsx";
import {userEvent} from "@testing-library/user-event";

const generateRandomString = (length: number) => Array.from({length}, () => String.fromCharCode(Math.floor(Math.random() * 256))).join('');

describe("ExpandableText", () => {
    it("should render the text", () => {
        render(<ExpandableText text={generateRandomString(30)}/>);
        const article = screen.getByRole("article");
        expect(article).toBeInTheDocument();
        expect(article.textContent?.length).toBe(30);
        const buttons = screen.queryByRole("button");
        expect(buttons).toBeNull();
    });

    it("should render the shortened text, then after click it should show the full", async () => {
        render(<ExpandableText text={generateRandomString(256)}/>);
        const article = screen.getByRole("article");
        expect(article).toBeInTheDocument();
        expect(article.textContent?.length).toBe(255 + "...".length);

        const button = screen.getByRole("button");
        expect(button).toHaveTextContent(/more/i);

        const user = userEvent.setup();
        await user.click(button);
        button.click();

        expect(button).toHaveTextContent(/less/i);
        expect(article.textContent?.length).toBe(256);

    });

    it("should render the shortened text, after clicked show less", async () => {
        render(<ExpandableText text={generateRandomString(256)}/>);

        const button = screen.getByRole("button", {name: /more/i});
        expect(button).toBeInTheDocument();

        const user = userEvent.setup();
        await user.click(button);
        await user.click(button);


        const article = screen.getByRole("article");
        expect(article.textContent?.length).toBe(255 + "...".length);
        expect(button).toHaveTextContent(/more/i);
    });
});