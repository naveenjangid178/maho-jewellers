import axios from "axios";

export const requestAccess = async (payload) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/request-access/`, payload);

        return {
            success: true,
            message: response.data.message,
            data: response.data.data,
        };
    } catch (error) {
        console.error("Request Access Error:", error);
        return {
            success: false,
            message: error.response?.data?.message || "Something went wrong.",
        };
    }
};