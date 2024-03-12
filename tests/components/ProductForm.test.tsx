import {render, screen} from "@testing-library/react";
import ProductForm from "../../src/components/ProductForm.tsx";
import {afterAll, beforeAll, expect} from "vitest";
import AllProviders from "../AllProviders.tsx";
import {db} from "../mocks/db.ts";
import {Category, Product} from "../../src/entities.ts";

describe("ProductForm", () => {
    let category: Category;
    let product: Product;
    beforeAll(() => {
        category = db.category.create();
        product = db.product.create({categoryId: category.id});
    });

    afterAll(() => {
        db.product.delete({where: {id: {equals: product.id}}});
        db.category.delete({where: {id: {equals: category.id}}});
    });

    const renderComponent = (product?: Product) => {
        render(<ProductForm product={product} onSubmit={vi.fn()}/>, {wrapper: AllProviders});

        const waitForFormToLoad = () => screen.findByRole("form");

        const getNameInput = () => screen.getByPlaceholderText(/name/i);
        const getPriceInput = () => screen.getByPlaceholderText(/price/i);
        const getCategorySelect = () => screen.getByRole("combobox", {name: /category/i});

        const getInputs = () => ({
            nameInput: getNameInput(),
            priceInput: getPriceInput(),
            categoryInput: getCategorySelect()
        });

        return {
            waitForFormToLoad,
            getInputs
        }
    };

    it("should render the form", async () => {
        const {waitForFormToLoad, getInputs} = renderComponent();
        await waitForFormToLoad();
        const {nameInput, priceInput, categoryInput} = getInputs();
        expect(nameInput).toBeInTheDocument();
        expect(priceInput).toBeInTheDocument();
        expect(categoryInput).toBeInTheDocument();
    });

    it("should populate the form with product data", async () => {
        const {waitForFormToLoad, getInputs} = renderComponent(product);
        await waitForFormToLoad();
        const {nameInput, priceInput, categoryInput} = getInputs();
        expect(nameInput).toHaveValue(product.name);
        expect(priceInput).toHaveValue(product.price.toString());
        expect(categoryInput).toHaveTextContent(category.name);
    });
});