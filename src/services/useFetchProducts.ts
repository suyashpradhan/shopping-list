import {useEffect, useState} from "react";
import axios from "axios";
import {APIResponseStatus, Product} from "../types/Product";

export const useFetchProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<APIResponseStatus>('idle');
    const [error, setError] = useState(false);

    const fetchProducts = async () => {
        setLoading('loading')
        try {
            const response = await axios.get('https://fakestoreapi.com/products?limit=10')

            if (response.status === 200) {
                const data: Product[] = response.data;
                setProducts(data);
                setLoading('success')
            } else {
                setLoading('error')
                setError(true);
            }
        } catch (err) {
            setLoading('error')
            setError(true);
        }
    }

    useEffect(() => {
        fetchProducts()
    }, []);

    return {products, loading, error};
}