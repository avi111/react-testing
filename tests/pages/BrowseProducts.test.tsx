import {render, screen, waitForElementToBeRemoved} from '@testing-library/react';

import {delay, http, HttpResponse} from "msw";
import {server} from "../mocks/server.ts";
import {afterAll, beforeAll, expect} from "vitest";
import {db} from "../mocks/db.ts";
import AllProviders from "../AllProviders.tsx";
import BrowseProducts from '../../src/pages/BrowseProductsPage.tsx';
import {Theme} from "@radix-ui/themes";
import {userEvent} from "@testing-library/user-event";
import {Category, Product} from "../../src/entities.ts";

describe('BrowseProducts', () => {
    const products: Product[] = [];
    const categories: Category[] = [];

    const renderComponent = () => {
        render(
            <Theme>
                <BrowseProducts/>
            </Theme>,
            {wrapper: AllProviders}
        );

        const user = userEvent.setup();
        return {user};
    }

    beforeAll(() => [1, 2, 3].forEach(() => {
        const product = db.product.create();
        products.push(product);
    }));

    beforeAll(() => [1, 2, 3].forEach((item) => {
        const category = db.category.create({name: "Category " + item});
        categories.push(category);
    }));

    afterAll(() => {
        db.product.deleteMany({where: {id: {in: products.map((p) => p.id)}}})
        db.category.deleteMany({where: {id: {in: categories.map((c) => c.id)}}})
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

    it("should not render an error if categories cannot be fetched", async () => {
        server.use(http.get("/categories", () => HttpResponse.error()));

        renderComponent();

        await waitForElementToBeRemoved(() => screen.queryByRole("progressbar", {name: /categories/i}))

        expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
        expect(screen.queryByRole("combobox", {name: /category/i})).not.toBeInTheDocument();
    });

    it("should not render an error if products cannot be fetched", async () => {
        server.use(http.get("/products", () => HttpResponse.error()));

        renderComponent();

        expect(await screen.findByText(/error/i)).toBeInTheDocument();
    });

    it("should render categories", async () => {
        const {user} = renderComponent();

        const combobox = await screen.findByRole("combobox");
        expect(combobox).toBeInTheDocument();

        await user.click(combobox);

        const options = await screen.findAllByRole("option");
        expect(options.length).toBeGreaterThan(0);
        expect(screen.getByRole("option", {name: "All"}));

        categories.forEach((category) => {
            expect(screen.getByRole("option", {name: category.name})).toBeInTheDocument();
        });
    });

    it("should render products", async () => {
        renderComponent();

        await waitForElementToBeRemoved(() => screen.queryByRole("progressbar", {name: /products/i}));

        products.forEach((product) => {
            expect(screen.getByText(product.name)).toBeInTheDocument();
        });
    });
});