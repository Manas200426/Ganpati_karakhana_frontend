import api from "./axios";

export const getCustomers =
  async () => {
    const response =
      await api.get("/customers");

    return response.data.data;
  };

  export const createCustomer =
  async (data) => {
    const response =
      await api.post(
        "/customers",
        data
      );

    return response.data.data;
  };