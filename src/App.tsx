import { useEffect, useState } from 'react';

interface ProductVariant {
  price: number;
  color: string;
  size: string;
  qtyAvailable: number;
}

interface VariantDetails {
  sizeGuidance: string;
  thickness: string;
  care: string;
  materials: string[];
}

interface Product {
  name: string;
  packSize?: number;
  variants: {
    [key: string]: ProductVariant;
  };
}

interface ProductResponse {
  products: Product[];
  meta: {
    prev: number | null;
    page: number;
    next: number | null;
    count: number;
    pages: number;
  };
}

interface VariantDetailsResponse {
  variants: {
    [key: string]: VariantDetails;
  };
  meta: {
    prev: number | null;
    page: number;
    next: number | null;
    count: number;
    pages: number;
  };
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [variantDetails, setVariantDetails] = useState<{ [key: string]: VariantDetails }>({});
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/products/core?page=${currentPage}`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data: ProductResponse = await response.json();
        setProducts(data.products);
        setTotalPages(data.meta.pages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage]);

  const fetchVariantDetails = async (variantId: string) => {
    if (variantDetails[variantId]) {
      setSelectedVariant(variantId);
      return;
    }

    setLoadingDetails(true);
    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/products/data?page=1`;
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch variant details');
      }
      const data: VariantDetailsResponse = await response.json();
      setVariantDetails(prev => ({ ...prev, ...data.variants }));
      setSelectedVariant(variantId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setLoading(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{product.name}</h2>
              {product.packSize && (
                <p className="text-gray-600 mb-4">Pack Size: {product.packSize}</p>
              )}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Available Variants:</h3>
                {Object.entries(product.variants).map(([variantId, variant]) => (
                  <div key={variantId} className="border rounded-lg p-4 bg-gray-50">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Size</p>
                        <p className="text-sm text-gray-600 capitalize">{variant.size}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Color</p>
                        <p className="text-sm text-gray-600 capitalize">{variant.color}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Price</p>
                        <p className="text-sm text-gray-600">${(variant.price / 100).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Stock</p>
                        <p className="text-sm text-gray-600">{variant.qtyAvailable} units</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <button
                        onClick={() => fetchVariantDetails(variantId)}
                        className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        Variant ID: {variantId}
                      </button>
                    </div>
                    {selectedVariant === variantId && variantDetails[variantId] && (
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Additional Details:</h4>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Size Guidance:</span> {variantDetails[variantId].sizeGuidance}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Thickness:</span> {variantDetails[variantId].thickness}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Care Instructions:</span> {variantDetails[variantId].care}
                          </p>
                          <div>
                            <p className="text-sm font-medium text-gray-900 mb-1">Materials:</p>
                            <ul className="list-disc list-inside text-sm text-gray-600">
                              {variantDetails[variantId].materials.map((material, idx) => (
                                <li key={idx}>{material}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                    {selectedVariant === variantId && loadingDetails && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm text-gray-600">Loading details...</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="mt-8 flex justify-center items-center space-x-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md ${currentPage === 1
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-gray-500  hover:bg-blue-700'
              }`}
          >
            Previous
          </button>

          <div className="flex items-center space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 rounded-md ${currentPage === page
                  ? 'bg-blue-600 text-blue'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md ${currentPage === totalPages
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-gray-500  hover:bg-blue-700'
              }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
