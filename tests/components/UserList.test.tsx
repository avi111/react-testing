import {render, screen} from '@testing-library/react';
import UserList from "../../src/components/UserList.tsx";
import {User} from '../../src/entities.ts';
import {expect} from "vitest";

describe("UseList", () => {
    it("should render no users when the users array is empty", () => {
        render(<UserList users={[]}/>);

        expect(screen.getByText(/no users/i)).toBeInTheDocument();
    });

    it("should render a list of users when the users array is non empty", () => {
        const users: User[] = [
            {
                id: 1,
                name: "Mosh",
                isAdmin: true
            },
            {
                id: 2,
                name: "John",
                isAdmin: false
            }
        ];

        render(<UserList users={users}/>);

        users.forEach(user => {
            const link = screen.getByRole('link', {name: user.name});
            expect(link).toBeInTheDocument();
            expect(link).toHaveAttribute('href', `/users/${user.id}`);
        })
    });
});