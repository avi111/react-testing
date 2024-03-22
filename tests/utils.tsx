import {server} from "./mocks/server.ts";
import {delay, http, HttpResponse} from "msw";
import {useAuth0, User} from "@auth0/auth0-react";
import {render} from '@testing-library/react';
import {createMemoryRouter, RouterProvider} from "react-router-dom";
import routes from "../src/routes.tsx";

export const simulateDelay = (endpoint: string) => {
    server.use(http.get(endpoint, async () => {
        await delay();
        return HttpResponse.json([]);
    }));
}

export const simulateError = (endpoint: string) => {
    server.use(http.get(endpoint, () => HttpResponse.error()));
}

type AuthState = {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | undefined;

}

export const mockAuthState = (authState: AuthState) => {
    vi.mocked(useAuth0).mockReturnValue({
        ...authState,
        getAccessTokenSilently: vi.fn().mockResolvedValue("access-token"),
        getAccessTokenWithPopup: vi.fn(),
        getIdTokenClaims: vi.fn(),
        loginWithRedirect: vi.fn(),
        loginWithPopup: vi.fn(),
        logout: vi.fn(),
        handleRedirectCallback: vi.fn()
    });
}

export const navigateTo = (path: string) => {
    const router = createMemoryRouter(routes, {initialEntries: [path]});
    render(<RouterProvider router={router} />);
};