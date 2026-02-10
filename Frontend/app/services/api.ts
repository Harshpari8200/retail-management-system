

const BASE_URL = "http://localhost:8080/api";

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    skuCode: string;
    stockQuantity: number;
    unit: string;
    wholesalerId: number;
    wholesalerName?: string;
    imageUrl: string | null;
    isActive: boolean;
}

export interface PaginatedResponse<T> {
    products: T[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
}

export interface SpringPage<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    empty: boolean;
}

class ApiService {
    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        // Handle empty responses (e.g. DELETE)
        if (response.status === 204) {
            return {} as unknown as T;
        }

        // Check if there is content to parse
        const text = await response.text();
        return text ? JSON.parse(text) : ({} as unknown as T);
    }

    // Products
    async getProducts(
        wholesalerId: number = 1,
        page: number = 0,
        size: number = 10,
        sortBy: string = "name",
        sortDir: string = "asc"
    ): Promise<PaginatedResponse<Product>> {
        return this.request<PaginatedResponse<Product>>(
            `/wholesalers/${wholesalerId}/products?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`
        );
    }

    async getProduct(wholesalerId: number, productId: number): Promise<Product> {
        return this.request<Product>(`/wholesalers/${wholesalerId}/products/${productId}`);
    }

    async createProduct(wholesalerId: number, data: Partial<Product>): Promise<Product> {
        return this.request<Product>(`/wholesalers/${wholesalerId}/products`, {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async updateProduct(wholesalerId: number, productId: number, data: Partial<Product>): Promise<Product> {
        return this.request<Product>(`/wholesalers/${wholesalerId}/products/${productId}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    }

    async deleteProduct(wholesalerId: number, productId: number): Promise<{ message: string }> {
        return this.request<{ message: string }>(`/wholesalers/${wholesalerId}/products/${productId}`, {
            method: "DELETE",
        });
    }

    async searchProducts(wholesalerId: number, keyword: string, page: number = 0, size: number = 10): Promise<SpringPage<Product>> {
        return this.request<SpringPage<Product>>(
            `/wholesalers/${wholesalerId}/products/search?query=${encodeURIComponent(keyword)}&page=${page}&size=${size}`
        );
    }

    async getProductsByCategory(wholesalerId: number, category: string, page: number = 0, size: number = 10): Promise<SpringPage<Product>> {
        return this.request<SpringPage<Product>>(
            `/wholesalers/${wholesalerId}/products/category/${encodeURIComponent(category)}?page=${page}&size=${size}`
        );
    }

    async toggleProductStatus(wholesalerId: number, productId: number, status: boolean): Promise<Product> {
        return this.request<Product>(`/wholesalers/${wholesalerId}/products/${productId}/status?status=${status}`, {
            method: "PATCH",
        });
    }

    async getCategories(wholesalerId: number = 1): Promise<string[]> {
        return this.request<string[]>(`/wholesalers/${wholesalerId}/products/categories`);
    }
}

export const api = new ApiService();
