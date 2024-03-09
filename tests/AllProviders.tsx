import {QueryClient, QueryClientProvider} from "react-query";
import {PropsWithChildren} from "react";
import {CartProvider} from "../src/providers/CartProvider.tsx";

const AllProviders = ({children}: PropsWithChildren) => {
    const client = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

    return (
        <QueryClientProvider client={client}>
            <CartProvider>
            {children}
            </CartProvider>
        </QueryClientProvider>
    );
}

export default AllProviders;