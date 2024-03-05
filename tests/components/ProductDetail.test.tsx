import { render, screen } from '@testing-library/react';

import ProductDetail from '../../src/components/ProductDetail';
import {products} from "../mocks/data.ts";
import {http, HttpResponse} from "msw";
import {server} from "../mocks/server.ts";

describe('ProductDetail', () => {
    it('should render the product detail', async () => {
        render(<ProductDetail productId={1} />);

        const name = await screen.findByText(new RegExp(products[0].name));
        expect(name).toBeInTheDocument();
    });

    it('should render the product price', async () => {
        render(<ProductDetail productId={1} />);

        const name = await screen.findByText(new RegExp(products[0].price.toString()));
        expect(name).toBeInTheDocument();
    });

    it('should render an error message when the product is not found', async () => {
        server.use(http.get('/products/1', () => HttpResponse.json(null)))
        render(<ProductDetail productId={1} />);

        const message = await screen.findByText(/not found/i);
        expect(message).toBeInTheDocument();
    });

    it('should render an error message when the product id is invalid', async () => {
        render(<ProductDetail productId={0} />);

        const message = await screen.findByText(/invalid/i);
        expect(message).toBeInTheDocument();
    });
});