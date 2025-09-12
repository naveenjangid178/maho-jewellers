import axios from "axios"

const getAllCatalogues = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/catalouge/`)
        return response.data.catalogues
    } catch (error) {
        console.error("Error fetching catalogues:", error);
        throw error;
    }
}

export {
    getAllCatalogues
}