import axios from "axios"

const getBlog = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/blog/`)
        return response.data.blogs
    } catch (error) {
        console.error("Error fetching top product:", error);
        throw error;
    }
}

export {
    getBlog
}