import {render, screen, waitForElementToBeRemoved} from '@testing-library/react';
import {afterAll, beforeAll, expect} from "vitest";
import {db, getProductsByCategory} from "../mocks/db.ts";
import AllProviders from "../AllProviders.tsx";
import BrowseProducts from '../../src/pages/BrowseProductsPage.tsx';
import {userEvent} from "@testing-library/user-event";
import {Category, Product} from "../../src/entities.ts";
import {simulateDelay, simulateError} from "../utils.ts";

describe('BrowseProducts', () => {
    const products: Product[] = [];
    const categories: Category[] = [];

    beforeAll(() => [1, 2].forEach((item) => {
        const category = db.category.create({name: "Category " + item});
        categories.push(category);
        [1, 2].forEach(() => {
            products.push(db.product.create({categoryId: category.id}));
        });
    }));

    afterAll(() => {
        db.product.deleteMany({where: {id: {in: products.map((p) => p.id)}}})
        db.category.deleteMany({where: {id: {in: categories.map((c) => c.id)}}})
    });

    it('should show a loading skeleton when fetching categories', () => {
        simulateDelay("categories");

        const {getCategoriesSkeleton} = renderComponent();

        expect(getCategoriesSkeleton()).toBeInTheDocument();
    });

    it('should hide the loading skeleton after categories are fetched', async () => {
        simulateDelay("categories");

        const {getCategoriesSkeleton} = renderComponent();

        await waitForElementToBeRemoved(getCategoriesSkeleton());
    });

    it('should show a loading skeleton when fetching products', () => {
        simulateDelay("products");

        const {getProductsSkeleton} = renderComponent();

        expect(getProductsSkeleton()).toBeInTheDocument();
    });

    it('should hide the loading skeleton after products are fetched', async () => {
        simulateDelay("products");

        const {getProductsSkeleton} = renderComponent();

        await waitForElementToBeRemoved(getProductsSkeleton);
    });

    it("should not render an error if categories cannot be fetched", async () => {
        simulateError("/categories");

        const {getCategoriesSkeleton, getCategoriesComboBox} = renderComponent();

        await waitForElementToBeRemoved(getCategoriesSkeleton)

        expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
        expect(getCategoriesComboBox()).not.toBeInTheDocument();
    });

    it("should not render an error if products cannot be fetched", async () => {
        simulateError("/products");

        renderComponent();

        expect(await screen.findByText(/error/i)).toBeInTheDocument();
    });

    it("should render categories", async () => {
        const {user, getCategoriesSkeleton, getCategoriesComboBox} = renderComponent();
        await waitForElementToBeRemoved(getCategoriesSkeleton)

        const combobox = getCategoriesComboBox();
        expect(combobox).toBeInTheDocument();

        await user.click(combobox!);

        const options = await screen.findAllByRole("option");
        expect(options.length).toBeGreaterThan(0);
        expect(screen.getByRole("option", {name: "All"}));

        categories.forEach((category) => {
            expect(screen.getByRole("option", {name: category.name})).toBeInTheDocument();
        });
    });

    it("should render products", async () => {
        const {getProductsSkeleton} = renderComponent();

        await waitForElementToBeRemoved(getProductsSkeleton);

        products.forEach((product) => {
            expect(screen.getByText(product.name)).toBeInTheDocument();
        });
    });

    it("should filter products by category", async () => {
        const {selectCategory, expectProductToBeInTheDocument} = renderComponent();

        const category = categories[0];
        await selectCategory(category.name)

        const products = getProductsByCategory(category);
        expectProductToBeInTheDocument(products);
    });

    it("should show all products if All category is selected", async () => {
        const {selectCategory, expectProductToBeInTheDocument} = renderComponent();

        await selectCategory(/all/i);

        const products = db.product.getAll();
        expectProductToBeInTheDocument(products);
    });
});

const renderComponent = () => {
    render(
        <BrowseProducts/>,
        {wrapper: AllProviders}
    );

    const getCategoriesSkeleton = () => screen.queryByRole("progressbar", {name: /categories/i});
    const getProductsSkeleton = () => screen.queryByRole("progressbar", {name: /products/i});
    const getCategoriesComboBox = () => screen.queryByRole("combobox");

    const selectCategory = async (name: RegExp | string) => {
        await waitForElementToBeRemoved(getCategoriesSkeleton);
        const combobox = getCategoriesComboBox();
        await user.click(combobox!);
        await user.click(screen.getByRole("option", {name}));
    }

    const user = userEvent.setup();

    const expectProductsToBeInTheDocument = (products: Product[]) => {
        const rows = screen.getAllByRole("row");
        const dataRows = rows.slice(1);
        expect(dataRows).toHaveLength(products.length);

        products.forEach((product) => {
            expect(screen.getByText(product.name)).toBeInTheDocument();
        });
    }

    return {
        user,
        getProductsSkeleton,
        getCategoriesSkeleton,
        getCategoriesComboBox,
        selectCategory,
        expectProductToBeInTheDocument: expectProductsToBeInTheDocument
    };
}
