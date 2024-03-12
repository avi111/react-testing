import {Table} from "@radix-ui/themes";
import Skeleton from "react-loading-skeleton";
import QuantitySelector from "./QuantitySelector.tsx";
import {UseQueryResult} from "react-query";
import {Product} from "../entities.ts";


type ProductTableProps = {
    selectedCategoryId: number | undefined
    productsQuery: UseQueryResult<Product[], Error>
}
const ProductTable = ({productsQuery, selectedCategoryId}: ProductTableProps) => {
    const skeletons = [1, 2, 3, 4, 5];

    const {data: products, isLoading, error} = productsQuery;
    if (error) return <div>Error: {error.message}</div>;

    const visibleProducts = selectedCategoryId
        ? products?.filter((p) => p.categoryId === selectedCategoryId)
        : products;

    return (
        <Table.Root>
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Price</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body
                role={isLoading ? "progressbar" : undefined}
                aria-label={isLoading ? "Loading products" : undefined}
            >
                {isLoading &&
                    skeletons.map((skeleton) => (
                        <Table.Row key={skeleton}>
                            <Table.Cell>
                                <Skeleton/>
                            </Table.Cell>
                            <Table.Cell>
                                <Skeleton/>
                            </Table.Cell>
                            <Table.Cell>
                                <Skeleton/>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                {!isLoading &&
                    visibleProducts?.map((product) => (
                        <Table.Row key={product.id}>
                            <Table.Cell>{product.name}</Table.Cell>
                            <Table.Cell>${product.price}</Table.Cell>
                            <Table.Cell>
                                <QuantitySelector product={product}/>
                            </Table.Cell>
                        </Table.Row>
                    ))}
            </Table.Body>
        </Table.Root>
    );
};

export default ProductTable;