import axios from "axios"

const getTopProduct = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/top-product/`)
        return response.data.products
    } catch (error) {
        console.error("Error fetching top product:", error);
        throw error;
    }
}

export {
    getTopProduct
}