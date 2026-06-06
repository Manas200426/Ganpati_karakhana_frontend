import api from "./axios";

export const getOrders = async () => {
  const response = await api.get("/orders");

  return response.data.data;
};
export const createOrder = async (data) => {
  const response = await api.post("/orders", data);

  return response.data.data;
};

export const updateOrderStatus = async ({ orderId, status }) => {
  const response = await api.patch(`/orders/${orderId}/status`, {
    status,
  });

  return response.data.data;
};

export const getOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);

  return response.data.data;
};
