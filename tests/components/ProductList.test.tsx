import {render, screen} from "@testing-library/react";
import ProductList from "../../src/components/ProductList.tsx";
import {server} from "../mocks/server.ts";
import {http, HttpResponse} from "msw";

describe('ProductList', () => {
    it('should render the product list', async () => {
        render(<ProductList/>);

        const items = await screen.findAllByRole("listitem");
        expect(items.length).toBeGreaterThan(0);
    });

    it('should render no products available when there are no products', async () => {
        server.use(http.get("/products", () => HttpResponse.json([])));
        render(<ProductList/>);

        const message = await screen.findByText(/no products/i);
        expect(message).toBeInTheDocument();
    });
});