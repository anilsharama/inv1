



const BASE_URL = "https://bcc-v6gz.onrender.com/api/invoice";



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
const API_URL = "https://bcc-v6gz.onrender.com/api";

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
