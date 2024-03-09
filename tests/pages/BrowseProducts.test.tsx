import {render, screen, waitForElementToBeRemoved} from '@testing-library/react';

import {delay, http, HttpResponse} from "msw";
import {server} from "../mocks/server.ts";
import {afterAll, beforeAll} from "vitest";
import {db} from "../mocks/db.ts";
import AllProviders from "../AllProviders.tsx";
import BrowseProducts from '../../src/pages/BrowseProductsPage.tsx';
import {Theme} from "@radix-ui/themes";

describe('BrowseProducts', () => {
    const productIds: number[] = [];

    const renderComponent = () => {
        render(
            <Theme>
                <BrowseProducts/>
            </Theme>,
            {wrapper: AllProviders}
        );
    }

    beforeAll(() => [1, 2, 3].forEach(() => {
        const product = db.product.create();
        productIds.push(product.id);
    }));

    afterAll(() => {
        db.product.deleteMany({where: {id: {in: productIds}}})
    });

    it('should show a loading skeleton when fetching categories', async () => {
        server.use(http.get("/categories", async () => {
            await delay();
            return HttpResponse.json([]);
        }));

        renderComponent();

        const categoriesSkeleton = await screen.findByRole("progressbar", {name: /categories/i});
        expect(categoriesSkeleton).toBeInTheDocument();
    });

    it('should hide the loading skeleton after categories are fetched', async () => {
        server.use(http.get("/categories", async () => HttpResponse.json([])));

        renderComponent();

        await waitForElementToBeRemoved(() => screen.queryByRole("progressbar", {name: /categories/i}));
    });

    it('should show a loading skeleton when fetching products', async () => {
        server.use(http.get("/products", async () => {
            await delay();
            return HttpResponse.json([]);
        }));

        renderComponent();

        const categoriesSkeleton = await screen.findByRole("progressbar", {name: /products/i});
        expect(categoriesSkeleton).toBeInTheDocument();
    });

    it('should hide the loading skeleton after products are fetched', async () => {
        server.use(http.get("/products", async () => HttpResponse.json([])));

        renderComponent();

        await waitForElementToBeRemoved(() => screen.queryByRole("progressbar", {name: /products/i}));
    });
});