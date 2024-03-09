import {render, screen} from '@testing-library/react';

import ProductDetail from '../../src/components/ProductDetail';
import {http, HttpResponse} from "msw";
import {server} from "../mocks/server.ts";
import {afterAll, beforeAll} from "vitest";
import {db} from "../mocks/db.ts";

describe('ProductDetail', () => {
    let productId: number;
    beforeAll(() => {
        const product = db.product.create();
        productId = product.id;
    });

    afterAll(() => {
        db.product.delete({where: {id: {equals: productId}}})
    });

    it('should render the product detail', async () => {
        const product = db.product.findFirst({where: {id: {equals: productId}}});
        render(<ProductDetail productId={productId}/>);

        const name = await screen.findByText(new RegExp(product!.name));
        expect(name).toBeInTheDocument();

        const price = await screen.findByText(new RegExp(product!.price.toString()));
        expect(price).toBeInTheDocument();
    });

    it('should render an error message when the product is not found', async () => {
        server.use(http.get('/products/1', () => HttpResponse.json(null)))
        render(<ProductDetail productId={1}/>);

        const message = await screen.findByText(/not found/i);
        expect(message).toBeInTheDocument();
    });

    it('should render an error message when the product id is invalid', async () => {
        render(<ProductDetail productId={0}/>);

        const message = await screen.findByText(/invalid/i);
        expect(message).toBeInTheDocument();
    });
});