import {render, screen} from "@testing-library/react";
import QuantitySelector from "../../src/components/QuantitySelector.tsx";
import {Product} from "../../src/entities.ts";
import {CartProvider} from "../../src/providers/CartProvider.tsx";
import {userEvent} from "@testing-library/user-event";
import {expect} from "vitest";

describe('QuantitySelector', () => {
    const renderComponent = () => {
        const product: Product = {id: 1, name: "Product", price: 1, categoryId: 1}

        render(<CartProvider>
            <QuantitySelector product={product}/>
        </CartProvider>);

        const getAddToCartButton = () => screen.getByRole("button", {name: /add to cart/i});

        const getQuantityControls = () => ({
            quantity: screen.getByRole("status"),
            decrementButton: screen.getByRole("button", {name: /-/i}),
            incrementButton: screen.getByRole("button", {name: /\+/i})
        });

        const user = userEvent.setup();

        return {
            getAddToCartButton,
            getQuantityControls,
            addToCart: () => user.click(getAddToCartButton()),
            incrementQuantity: () => user.click(getQuantityControls().incrementButton),
            decrementQuantity: () => user.click(getQuantityControls().decrementButton)
        }
    }

    it('should render the Add to Cart button', () => {
        const {getAddToCartButton} = renderComponent();
        expect(getAddToCartButton()).toBeInTheDocument();
    });

    it('should add a product to the cart', async () => {
        const {getAddToCartButton, getQuantityControls, addToCart} = renderComponent();
        const button = getAddToCartButton();
        await addToCart();

        const {quantity, decrementButton, incrementButton} = getQuantityControls();

        expect(quantity).toHaveTextContent("1");
        expect(decrementButton).toBeInTheDocument();
        expect(incrementButton).toBeInTheDocument();
        expect(button).not.toBeInTheDocument();
    });

    it("should increment the quantity of a product in the cart", async () => {
        const {getQuantityControls, addToCart, incrementQuantity} = renderComponent();
        await addToCart();

        const {quantity} = getQuantityControls();
        await incrementQuantity();
        expect(quantity).toHaveTextContent("2");
    });

    it("should decrement the quantity of a product in the cart", async () => {
        const {addToCart, getQuantityControls, decrementQuantity, incrementQuantity} = renderComponent();
        await addToCart();

        await incrementQuantity();
        await decrementQuantity();

        const {quantity} = getQuantityControls();
        expect(quantity).toHaveTextContent("1");
    });

    it("should remove a product from the cart", async () => {
        const {addToCart, getAddToCartButton, getQuantityControls, decrementQuantity} = renderComponent();
        await addToCart();

        await decrementQuantity();

        const {quantity, decrementButton, incrementButton} = getQuantityControls();

        expect(quantity).not.toBeInTheDocument();
        expect(decrementButton).not.toBeInTheDocument();
        expect(incrementButton).not.toBeInTheDocument();
        expect(getAddToCartButton()).toBeInTheDocument();
    });
});