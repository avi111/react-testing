import {render, screen, waitForElementToBeRemoved} from "@testing-library/react";
import ProductList from "../../src/components/ProductList.tsx";
import {server} from "../mocks/server.ts";
import {delay, http, HttpResponse} from "msw";
import {afterAll, beforeAll} from "vitest";
import {db} from "../mocks/db.ts";
import {QueryClient, QueryClientProvider} from "react-query";

describe('ProductList', () => {
    const productIds: number[] = [];
    beforeAll(() => [1, 2, 3].forEach(() => {
        const product = db.product.create();
        productIds.push(product.id);
    }));

    afterAll(() => {
        db.product.deleteMany({where: {id: {in: productIds}}})
    });

    const renderComponent = () => {
        const client = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                },
            },
        });

        render(
            <QueryClientProvider client={client}>
                <ProductList/>
            </QueryClientProvider>
        );
    }

    it('should render the product list', async () => {
        renderComponent();

        const items = await screen.findAllByRole("listitem");
        expect(items.length).toBeGreaterThan(0);
    });

    it('should render no products available when there are no products', async () => {
        server.use(http.get("/products", () => HttpResponse.json([])));
        renderComponent();

        const message = await screen.findByText(/no products/i);
        expect(message).toBeInTheDocument();
    });

    it('should render an error message when an unexpected error occurs', async () => {
        server.use(http.get("/products", () => HttpResponse.error()));
        renderComponent();

        const message = await screen.findByText(/error/i);
        expect(message).toBeInTheDocument();
    });

    it('should render a loading message when the products are being fetched', async () => {
        server.use(http.get("/products", async () => {
            await delay();
            return HttpResponse.json([]);
        }));

        renderComponent();

        const message = await screen.findByText(/loading/i);
        expect(message).toBeInTheDocument();
    });

    it('should remove the loading indicator after data is fetched', async () => {
        renderComponent();

        await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
    });

    it('should remove the loading indicator if the data fetching failed', async () => {
        server.use(http.get("/products", () => HttpResponse.error()));
        renderComponent();

        await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
    });
});