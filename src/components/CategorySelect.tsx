import Skeleton from "react-loading-skeleton";
import {Select} from "@radix-ui/themes";
import {UseQueryResult} from "react-query";
import {Category} from "../entities.ts";

type CategorySelectProps = {
    categoriesQuery: UseQueryResult<Category[], Error>
    setSelectedCategoryId: (categoryId: number) => void
}

const CategorySelect = ({categoriesQuery, setSelectedCategoryId}: CategorySelectProps) => {
    const {data: categories, error, isLoading} = categoriesQuery;
    if (isLoading) return <div role="progressbar" aria-label="Loading categories"><Skeleton/></div>;
    if (error) return null;
    return (
        <Select.Root
            onValueChange={(categoryId) =>
                setSelectedCategoryId(parseInt(categoryId))
            }
        >
            <Select.Trigger placeholder="Filter by Category"/>
            <Select.Content>
                <Select.Group>
                    <Select.Label>Category</Select.Label>
                    <Select.Item value="all">All</Select.Item>
                    {categories?.map((category) => (
                        <Select.Item key={category.id} value={category.id.toString()}>
                            {category.name}
                        </Select.Item>
                    ))}
                </Select.Group>
            </Select.Content>
        </Select.Root>
    );
}

export default CategorySelect;