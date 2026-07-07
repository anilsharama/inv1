import axios from "axios";

// Backend URL
const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ================= LOGIN =================
export const loginUser = async (data) => {
  try {
    const response = await API.post("/login", data);
    return response.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// ================= GET INVOICES =================
export const getInvoices = async (month, year) => {
  const response = await API.get("/invoice", {
    params: { month, year },
  });
  return response.data;
};

// ================= ADD INVOICE =================
export const addInvoice = async (data) => {
  const response = await API.post("/invoice", data);
  return response.data;
};

// ================= UPDATE INVOICE =================
export const updateInvoice = async (id, data) => {
  const response = await API.put(`/invoice/${id}`, data);
  return response.data;
};

// ================= DELETE INVOICE =================
export const deleteInvoice = async (id) => {
  const response = await API.delete(`/invoice/${id}`);
  return response.data;
};

// ================= REPROCESS =================
export const reprocessInvoice = async (id) => {
  const response = await API.put(`/reprocess/${id}`);
  return response.data;
};







// const API_BASE_URL = "http://localhost:5000/api";

// export const api = {
//   // Get Invoice Flow Data
//   async getInvoiceFlow() {
//     try {
//       const response = await fetch(`${API_BASE_URL}/invoice-flow`);

//       if (!response.ok) {
//         throw new Error("Failed to fetch invoice flow data");
//       }

//       return await response.json();
//     } catch (error) {
//       console.error("API Error:", error);
//       throw error;
//     }
//   },

//   // Get Invoice Flow By Month
//   async getInvoiceFlowByMonth(month) {
//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/invoice-flow?month=${encodeURIComponent(month)}`
//       );

//       if (!response.ok) {
//         throw new Error("Failed to fetch month data");
//       }

//       return await response.json();
//     } catch (error) {
//       console.error("API Error:", error);
//       throw error;
//     }
//   },

//   // Refresh Data
//   async refreshData() {
//     try {
//       const response = await fetch(`${API_BASE_URL}/invoice-flow`);

//       if (!response.ok) {
//         throw new Error("Refresh failed");
//       }

//       return await response.json();
//     } catch (error) {
//       console.error(error);
//       throw error;
//     }
//   },
// };




const BASE_URL = "http://localhost:5000/api/invoice";



////////////////////////////////////////////////

export const getInvoices = async () => {
  try {
    const response = await fetch(BASE_URL);

    if (!response.ok) {
      throw new Error("Failed to fetch invoices");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

// GET SINGLE
export const getInvoiceById = async (id) => {
  try {
    const response = await fetch(
      `${BASE_URL}/${id}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch invoice");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

// ADD


export const addInvoice = async (data) => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to add invoice");
  }

  return await response.json();
};

// UPDATE
export const updateInvoice = async (
  id,
  data
) => {
  try {
    const response = await fetch(
      `${BASE_URL}/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(
        "Failed to update invoice"
      );
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

// DELETE
export const deleteInvoice = async (
  id
) => {
  try {
    const response = await fetch(
      `${BASE_URL}/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error(
        "Failed to delete invoice"
      );
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};




////////////////login.///
const API_URL = "http://localhost:5000/api";

export const loginUser = async (data) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Login Failed"
    );
  }

  return result;
};





///////////////////////new .........//
