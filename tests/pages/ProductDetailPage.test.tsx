import {screen, waitForElementToBeRemoved} from '@testing-library/react';

import {navigateTo} from "../utils.tsx";
import {db} from "../mocks/db.ts";
import {afterAll, beforeAll} from "vitest";
import {Product} from "../../src/entities.ts";

describe('ProductDetailPage', () => {
    let product: Product;
    beforeAll(() => {
        product = db.product.create({id: 1, name: 'Product 1', price: 100});
    })

    afterAll(() => {
        db.product.delete({where: {id: {equals: product.id}}});
    });

    it('should render the product detail page', async () => {
        navigateTo('/products/' + product.id);
        await waitForElementToBeRemoved(() => screen.getByText(/loading/i));
        expect(screen.getByRole('heading', {name: product.name})).toBeInTheDocument();
        expect(screen.getByText('$' + product.price)).toBeInTheDocument();
    });

    it('should render the error page when product is not found', async () => {
        navigateTo('/products/2');
        await waitForElementToBeRemoved(() => screen.getByText(/loading/i));
        expect(screen.getByText(/not found/i)).toBeInTheDocument();
    });

    it('should render the error page when non-numeric value is used to route parameter', async () => {
        navigateTo('/products/abc');
        await waitForElementToBeRemoved(() => screen.getByText(/loading/i));
        expect(screen.getByText(/not found/i)).toBeInTheDocument();
    });
});