import {render, screen} from "@testing-library/react";
import ProductList from "../../src/components/ProductList.tsx";
import {server} from "../mocks/server.ts";
import {http, HttpResponse} from "msw";
import {afterAll, beforeAll} from "vitest";
import {db} from "../mocks/db.ts";

describe('ProductList', () => {
    const productIds: number[] = [];
    beforeAll(() => [1, 2, 3].forEach(() => {
        const product = db.product.create();
        productIds.push(product.id);
    }));

    afterAll(() => {
        db.product.deleteMany({where: {id: {in: productIds}}})
    });

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

    it('should render an error message when an unexpected error occurs', async () => {
        server.use(http.get("/products", () => HttpResponse.error()));
        render(<ProductList/>);

        const message = await screen.findByText(/error/i);
        expect(message).toBeInTheDocument();
    });
})
;