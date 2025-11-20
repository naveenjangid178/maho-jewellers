import axios from "axios";

export const createOrder = async (userId) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/order/create`,
      { userId }
    );

    return response.data;

  } catch (error) {
    console.error("Order creation error:", error);
    throw error.response?.data || { message: "Failed to create order" };
  }
};
