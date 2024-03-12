import {QueryClient, QueryClientProvider} from "react-query";
import {PropsWithChildren} from "react";
import {CartProvider} from "../src/providers/CartProvider.tsx";
import {Theme} from "@radix-ui/themes";

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
                <Theme>
                    {children}
                </Theme>
            </CartProvider>
        </QueryClientProvider>
    );
}

export default AllProviders;