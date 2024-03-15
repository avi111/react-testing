import {render, screen} from "@testing-library/react";
import ProductForm from "../../src/components/ProductForm.tsx";
import {afterAll, beforeAll, expect} from "vitest";
import AllProviders from "../AllProviders.tsx";
import {db} from "../mocks/db.ts";
import {Category, Product} from "../../src/entities.ts";
import {userEvent} from "@testing-library/user-event";

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

        const waitForFormToLoad = async () => {
            await screen.findByRole("form");
            return {
                nameInput: getNameInput(),
                priceInput: getPriceInput(),
                categoryInput: getCategorySelect(),
                submitButton: screen.getByRole("button"),
            }
        };

        const getNameInput = () => screen.getByPlaceholderText(/name/i);
        const getPriceInput = () => screen.getByPlaceholderText(/price/i);
        const getCategorySelect = () => screen.getByRole("combobox", {name: /category/i});

        return {
            waitForFormToLoad,
        }
    };

    it("should render the form", async () => {
        const {waitForFormToLoad} = renderComponent();
        const {nameInput, priceInput, categoryInput} = await waitForFormToLoad();
        expect(nameInput).toBeInTheDocument();
        expect(priceInput).toBeInTheDocument();
        expect(categoryInput).toBeInTheDocument();
    });

    it("should populate the form with product data", async () => {
        const {waitForFormToLoad} = renderComponent(product);
        const {nameInput, priceInput, categoryInput} = await waitForFormToLoad();
        expect(nameInput).toHaveValue(product.name);
        expect(priceInput).toHaveValue(product.price.toString());
        expect(categoryInput).toHaveTextContent(category.name);
    });

    it("should focus the name input", async () => {
        const {waitForFormToLoad} = renderComponent();
        const {nameInput} = await waitForFormToLoad();
        expect(nameInput).toHaveFocus();
    });

    it.each([
        {
            scenario: "missing",
            errorMessage: /required/i,
        },
        {
            scenario: "longer than 255 characters",
            name: "a".repeat(256),
            errorMessage: /255/i,
        },
    ])("should show an error message if the name is $scenario", async ({name, errorMessage}) => {
        const {waitForFormToLoad} = renderComponent();
        const form = await waitForFormToLoad();
        const user = userEvent.setup();
        if (name!==undefined) {
            await user.type(form.nameInput, name);
        }
        await user.type(form.priceInput, "10");
        await user.click(form.categoryInput);
        const options = await screen.findAllByRole("option");
        await user.click(options[0]);
        await user.click(form.submitButton);

        const error = screen.getByRole("alert");
        expect(error).toBeInTheDocument();
        expect(error).toHaveTextContent(errorMessage);
    });
});