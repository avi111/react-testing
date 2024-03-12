import axios from "axios";
import {useState} from "react";
import "react-loading-skeleton/dist/skeleton.css";
import {Category, Product} from "../entities";
import {useQuery} from "react-query";
import CategorySelect from "../components/CategorySelect.tsx";
import ProductTable from "../components/ProductTable.tsx";

function BrowseProducts() {
    const productsQuery = useQuery<Product[], Error>({
        queryKey: "products",
        queryFn: async () => {
            const {data} = await axios.get<Product[]>("/products");
            return data;
        },
    });

    const categoriesQuery = useQuery<Category[], Error>({
        queryKey: "categories",
        queryFn: async () => {
            const {data} = await axios.get<Category[]>("/categories");
            return data;
        },
    });

    const [selectedCategoryId, setSelectedCategoryId] = useState<
        number | undefined
    >();

    if (productsQuery.error) return <div>Error: {productsQuery.error.message}</div>;

    return (
        <div>
            <h1>Products</h1>
            <div className="max-w-xs">
                <CategorySelect {...{categoriesQuery, setSelectedCategoryId}} />
            </div>

            <ProductTable {...{selectedCategoryId, productsQuery}} />
        </div>
    );
}

export default BrowseProducts;
