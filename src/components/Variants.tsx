import { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Typography, Button } from "@material-tailwind/react";

interface ProductVariant {
    sizeGuidance: string;
    thickness: string;
    care: string;
    materials: string[];
}

interface ProductData {
    variants: {
        [key: string]: ProductVariant;
    };
    meta: {
        prev: number;
        page: number;
        next: number;
        count: number;
        pages: number;
    };
}

export function ProductList() {
    const [products, setProducts] = useState<ProductData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchProducts = async (page: number) => {
        try {
            setLoading(true);
            const apiUrl = import.meta.env.VITE_API_URL;
            const response = await fetch(`${apiUrl}?page=${page}`);
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            setProducts(data);
            setCurrentPage(page);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(currentPage);
    }, []);

    const handlePreviousPage = () => {
        if (products?.meta.prev !== null) {
            fetchProducts(products.meta.prev);
        }
    };

    const handleNextPage = () => {
        if (products?.meta.next !== null) {
            fetchProducts(products.meta.next);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Typography placeholder="" variant="h2"> Loading products...</Typography>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Typography placeholder="" variant="h2" color="red">Error: {error}. Please refresh the page to try again</Typography>
            </div>
        );
    }

    if (!products) {
        return null;
    }

    return (
        <div id="productList" className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="container mx-auto px-4 py-12">
                <Typography placeholder="" variant="h2" className="mb-12 text-center text-4xl font-bold text-gray-800">
                    Product List
                </Typography>

                <div className="flex flex-col gap-8">
                    {Object.entries(products.variants).map(([sku, variant]) => (
                        <Card placeholder="" key={sku} className="w-full shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
                            <CardHeader placeholder="" color="blue" className="relative h-40 bg-gradient-to-r from-blue-600 to-blue-800 rounded-t-lg">
                                <Typography placeholder="" variant="h4" color="white" className="absolute bottom-6 left-6 font-bold">
                                    {sku}
                                </Typography>
                            </CardHeader>
                            <CardBody placeholder="" className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <Typography placeholder="" variant="h6" color="blue-gray" className="font-semibold text-lg">
                                            Size Guidance
                                        </Typography>
                                        <Typography placeholder="" className="text-gray-700">
                                            {variant.sizeGuidance}
                                        </Typography>
                                    </div>

                                    <div className="space-y-2">
                                        <Typography placeholder="" variant="h6" color="blue-gray" className="font-semibold text-lg">
                                            Thickness
                                        </Typography>
                                        <Typography placeholder="" className="text-gray-700">
                                            {variant.thickness}
                                        </Typography>
                                    </div>

                                    <div className="md:col-span-2 space-y-2">
                                        <Typography placeholder="" variant="h6" color="blue-gray" className="font-semibold text-lg">
                                            Care Instructions
                                        </Typography>
                                        <Typography placeholder="" className="text-gray-700">
                                            {variant.care}
                                        </Typography>
                                    </div>

                                    <div className="md:col-span-2 space-y-2">
                                        <Typography placeholder="" variant="h6" color="blue-gray" className="font-semibold text-lg">
                                            Materials
                                        </Typography>
                                        <ul className="list-disc pl-4 space-y-1">
                                            {variant.materials.map((material, index) => (
                                                <li key={index} className="flex items-center">
                                                    <Typography placeholder="" className="text-gray-700">
                                                        {material}
                                                    </Typography>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>

                <div className="flex justify-center gap-6 mt-12">
                    <Button placeholder="" disabled={products.meta.prev === null} onClick={handlePreviousPage} className="px-6 py-2">
                        Previous
                    </Button>
                    <Typography placeholder="" className="py-2 text-gray-700">
                        Page {products.meta.page} of {products.meta.pages}
                    </Typography>
                    <Button placeholder="" disabled={products.meta.next === null} onClick={handleNextPage} className="px-6 py-2">
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
} 