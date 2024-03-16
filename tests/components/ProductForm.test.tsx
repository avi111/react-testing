/* eslint-disable @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any */

import {render, screen} from "@testing-library/react";
import ProductForm from "../../src/components/ProductForm.tsx";
import {afterAll, beforeAll, expect} from "vitest";
import AllProviders from "../AllProviders.tsx";
import {db} from "../mocks/db.ts";
import {Category, Product} from "../../src/entities.ts";
import {userEvent} from "@testing-library/user-event";
import {Toaster} from "react-hot-toast";

type FormData = {
    [K in keyof Product]?: any;
}

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
        const onSubmit = vi.fn();

        render(<>
            <ProductForm {...{product, onSubmit}}/>
            <Toaster />
        </>, {wrapper: AllProviders});

        const waitForFormToLoad = async () => {
            await screen.findByRole("form");

            const nameInput = getNameInput();
            const priceInput = getPriceInput();
            const categoryInput = getCategorySelect();
            const submitButton = screen.getByRole("button");

            const validData: Product = {
                name: "Product",
                price: 1,
                categoryId: category!.id,
                id: 1,
            };

            const expectErrorToBeInDocument = (errorMessage: string | RegExp) => {
                const error = screen.getByRole("alert");
                expect(error).toBeInTheDocument();
                expect(error).toHaveTextContent(errorMessage);
            }

            const fill = async ({name, price}: FormData) => {
                const user = userEvent.setup();
                if (name !== undefined) {
                    await user.type(nameInput, name);
                }
                if (price !== undefined) {
                    await user.type(priceInput, price.toString());
                }

                await user.tab();
                await user.click(categoryInput);
                const options = await screen.findAllByRole("option");
                await user.click(options[0]);
                await user.click(submitButton);
            }
            return {
                nameInput,
                priceInput,
                categoryInput,
                submitButton,
                fill,
                expectErrorToBeInDocument,
                validData,
            }
        };

        const getNameInput = () => screen.getByPlaceholderText(/name/i);
        const getPriceInput = () => screen.getByPlaceholderText(/price/i);
        const getCategorySelect = () => screen.getByRole("combobox", {name: /category/i});

        return {
            waitForFormToLoad,
            onSubmit,
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
        await form.fill({...form.validData, name});
        form.expectErrorToBeInDocument(errorMessage);
    });

    it.each([
        {
            scenario: "missing",
            errorMessage: /required/i,
        },
        {
            scenario: "less than 1",
            price: 0,
            errorMessage: /1/i,
        },
        {
            scenario: "negative",
            price: -1,
            errorMessage: /1/i,
        },
        {
            scenario: "greater than 1000",
            price: 1001,
            errorMessage: /1000/i,
        },
        {
            scenario: "not a number",
            price: "a",
            errorMessage: /required/i,
        },
    ])("should show an error message if the name is $scenario", async ({price, errorMessage}) => {
        const {waitForFormToLoad} = renderComponent();
        const form = await waitForFormToLoad();
        await form.fill({...form.validData, price});
        form.expectErrorToBeInDocument(errorMessage);
    });

    it("should submit the form with valid data", async () => {
        const {waitForFormToLoad, onSubmit} = renderComponent();
        const form = await waitForFormToLoad();
        await form.fill(form.validData);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...formData } = form.validData;
        expect(onSubmit).toHaveBeenCalledWith(formData);
    });

    it("should show an error toast if the form submission fails", async () => {
        const {waitForFormToLoad, onSubmit} = renderComponent();
        onSubmit.mockRejectedValue({})

        const form = await waitForFormToLoad();
        await form.fill(form.validData);

        const toast = await screen.findByRole("status");
        expect(toast).toBeInTheDocument();
        expect(toast).toHaveTextContent(/error/i);
    });

    it("should disable the submit button while submitting", async () => {
        const {waitForFormToLoad, onSubmit} = renderComponent();
        onSubmit.mockImplementation(async () => {
            await new Promise((resolve) => setTimeout(resolve, 100));
        });

        const form = await waitForFormToLoad();
        await form.fill(form.validData);
        expect(form.submitButton).toBeDisabled();
        await new Promise((resolve) => setTimeout(resolve, 100));
        expect(form.submitButton).toBeEnabled();
    });

    it('should disable the submit button upon submission', async () => {
        const { waitForFormToLoad, onSubmit } = renderComponent();
        onSubmit.mockReturnValue(new Promise(() => {}));

        const form = await waitForFormToLoad();
        await form.fill(form.validData);

        expect(form.submitButton).toBeDisabled();
    })

    it('should re-enable the submit button after submission', async () => {
        const { waitForFormToLoad, onSubmit } = renderComponent();
        onSubmit.mockResolvedValue({});

        const form = await waitForFormToLoad();
        await form.fill(form.validData);

        expect(form.submitButton).not.toBeDisabled();
    })

    it('should re-enable the submit button after submission', async () => {
        const { waitForFormToLoad, onSubmit } = renderComponent();
        onSubmit.mockRejectedValue('error');

        const form = await waitForFormToLoad();
        await form.fill(form.validData);

        expect(form.submitButton).not.toBeDisabled();
    })
});