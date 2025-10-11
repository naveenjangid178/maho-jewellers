import axios from "axios"

const getFeaturedProduct = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/featured/`)
        return response.data.products
    } catch (error) {
        console.error("Error fetching top product:", error);
        throw error;
    }
}

export {
    getFeaturedProduct
}