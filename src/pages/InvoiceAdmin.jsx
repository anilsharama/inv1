import React, { useEffect, useState } from "react";

const BASE_URL = "http://localhost:5000/api/invoice";

export default function InvoicePage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("June");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [showReprocessModal, setShowReprocessModal] = useState(false);
  const [reprocessIdInput, setReprocessIdInput] = useState("");

  const [form, setForm] = useState({
    designation: "",
    description: "",
    process: "Pending",
    month: "jun",
    year: "2025",
  });

  const validMonths = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getProcessDisplay = (row) => {
    const status = (row.process || "").toString().toLowerCase().trim();
    if (status.includes("complete")) 
      return { text: "Complete", style: { ...td, backgroundColor: "#22c55e", color: "#fff", fontWeight: "bold", borderRadius: "6px" } };
    
    if (status.includes("reject")) 
      return { text: "Reject", style: { ...td, backgroundColor: "#ef4444", color: "#fff", fontWeight: "bold", borderRadius: "6px" } };
    
    if (status.includes("pending")) 
      return { text: "Pending", style: { ...td, backgroundColor: "#eab308", color: "#fff", fontWeight: "bold", borderRadius: "6px" } };
    
    return { text: row.process || "—", style: td };
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}?month=${selectedMonth}&year=${selectedYear}`);
      const result = await res.json();
      setData(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("Fetch Error:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear]);

  const canEdit = (row, index) => {
    if (index === 0) return true;
    const prevRow = data[index - 1];
    const prevStatus = (prevRow?.process || "").toString().toLowerCase().trim();
    return prevStatus === "complete";
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const openAdd = () => {
    setEditingId(null);
    setForm({ 
      designation: "", 
      description: "", 
      process: "Pending", 
      month: selectedMonth, 
      year: selectedYear 
    });
    setShowModal(true);
  };

  const openEdit = (row) => {
    setEditingId(row.id);
    setForm({
      designation: row.designation || "",
      description: row.description || "",
      process: row.process || "",
      month: row.month || selectedMonth,
      year: row.year || selectedYear,
    });
    setShowModal(true);
  };

  const saveRecord = async () => {
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${BASE_URL}/${editingId}` : BASE_URL;
      
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error("Save Error:", err);
      alert("Failed to save");
    }
  };

  const reprocessRecord = async (id) => {
    if (!window.confirm("Reprocess this rejected invoice?")) return;
    try {
      await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ process: "Pending" }),
      });
      fetchData();
    } catch (err) {
      console.error("Reprocess Error:", err);
      alert("Failed to reprocess");
    }
  };

  const handleReprocessById = async () => {
    if (!reprocessIdInput.trim()) {
      alert("Please enter an Invoice ID");
      return;
    }

    const id = parseInt(reprocessIdInput.trim());
    if (isNaN(id) || id <= 0) {
      alert("Please enter a valid Invoice ID");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/reprocess/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      let result;
      const contentType = res.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        result = await res.json();
      } else {
        result = { message: await res.text() };
      }

      if (!res.ok) {
        alert(result.message || "Invoice ID not found");
        return;
      }

      alert("Successfully reprocessed invoices!");
      setShowReprocessModal(false);
      setReprocessIdInput("");
      fetchData();
    } catch (err) {
      console.error("Reprocess by ID Error:", err);
      alert("Failed to reprocess. Please check if backend is running.");
    }
  };

  const deleteRecord = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    try {
      await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
      fetchData();
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  const downloadCSV = () => {
    const headers = ["ID", "Designation", "Remark", "Process", "Month", "Year"];
    const rows = data.map(item => [
      item.id, 
      item.designation, 
      item.description || "", 
      item.process, 
      item.month, 
      item.year
    ]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedMonth}-${selectedYear}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const handleView = () => {
    window.location.href = "/InvoiceFlowPage";
  };

  return (
    <div style={page}>
      <div style={card}>
        <div style={actionBar}>
          <div style={{ display: "flex", gap: 8 }}>
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} style={input}>
              {validMonths.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} style={input}>
              {["2024", "2025", "2026"].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={openAdd} style={btnBlue}>+ ADD NEW INVOICE</button>
            <button onClick={handleView} style={btnView}>👁 View</button>
            <button onClick={fetchData} style={btnGreen}>Refresh</button>
            <button onClick={downloadCSV} style={btnGray}>CSV</button>
            <button onClick={handleLogout} style={btnLogout}>Logout</button>
          </div>
        </div>

        {/* ==================== DYNAMIC PROGRESS TIMELINE ==================== */}
        <WorkflowTimeline data={data} />

        <div style={tableWrapper}>
          {loading ? <h4>Loading...</h4> : (
            <table style={table}>
              <thead style={thead}>
                <tr>
                  <th style={th}>ID</th>
                  <th style={th}>Designation</th>
                  <th style={th}>Remark</th>
                  <th style={th}>Process</th>
                  <th style={th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr><td colSpan="5" style={td}>No data found</td></tr>
                ) : (
                  data.map((row, index) => {
                    const display = getProcessDisplay(row);
                    const isRejected = (row.process || "").toString().toLowerCase().trim().includes("reject");
                    const editable = canEdit(row, index);

                    return (
                      <tr key={row.id} style={row.process?.toLowerCase() === "pending" ? { backgroundColor: "#fefce8" } : {}}>
                        <td style={td}>{row.id}</td>
                        <td style={td}>{row.designation}</td>
                        <td style={td}>{row.description || "—"}</td>
                        <td style={display.style}>{display.text}</td>
                        <td style={td}>
                          {editable && <button onClick={() => openEdit(row)} style={btnEdit}>Edit</button>}{" "}
                          <button onClick={() => deleteRecord(row.id)} style={btnDelete}>Delete</button>
                          
                          {isRejected && (
                            <>
                              {" "}
                              <button onClick={() => reprocessRecord(row.id)} style={btnReprocess}>Restart</button>
                              {" "}
                              <button onClick={() => setShowReprocessModal(true)} style={btnReprocess}>Restart-ID</button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div style={overlay}>
            <div style={modal}>
              <h3>{editingId ? "Edit Invoice" : "Add Invoice"}</h3>
              <input name="designation" value={form.designation} onChange={handleChange} placeholder="Designation" style={input} />
              <input name="description" value={form.description} onChange={handleChange} placeholder="Remark" style={input} />
              <select name="process" value={form.process} onChange={handleChange} style={input}>
                <option value="Pending">Pending</option>
                <option value="Complete">Complete</option>
                <option value="Reject">Reject</option>
              </select>
              <select name="month" value={form.month} onChange={handleChange} style={input}>
                {validMonths.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <input name="year" value={form.year} onChange={handleChange} style={input} />
              <div style={{ marginTop: 15 }}>
                <button onClick={saveRecord} style={btnBlue}>Save</button>{" "}
                <button onClick={() => setShowModal(false)} style={btnGray}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Reprocess by ID Modal */}
        {showReprocessModal && (
          <div style={overlay}>
            <div style={modal}>
              <h3>Restart by ID</h3>
              <input
                type="number"
                value={reprocessIdInput}
                onChange={(e) => setReprocessIdInput(e.target.value)}
                placeholder="Enter Invoice ID"
                style={input}
              />
              <div style={{ marginTop: 15 }}>
                <button onClick={handleReprocessById} style={btnBlue}>Reprocess</button>{" "}
                <button onClick={() => { setShowReprocessModal(false); setReprocessIdInput(""); }} style={btnGray}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= DYNAMIC PROGRESS TIMELINE ================= */
const WorkflowTimeline = ({ data }) => {
  if (!data || data.length === 0) return null;

  const currentIndex = data.findIndex(row => {
    const status = (row.process || "").toString().toLowerCase().trim();
    return !status.includes("complete");
  });

  const isAllComplete = currentIndex === -1;

  return (
    <div style={timelineCard}>
      <h3 style={timelineTitle}>Current Processing</h3>

      {isAllComplete ? (
        <div style={allCompleteStyle}>
          🎉 All processing completed.
        </div>
      ) : (
        <div style={timelineContainer}>
          {data.map((row, index) => {
            const status = (row.process || "").toLowerCase();
            const isComplete = status.includes("complete");
            const isPending = status.includes("pending");
            const isReject = status.includes("reject");
            const isActive = index === currentIndex;

            return (
              <React.Fragment key={row.id}>
                <div style={stepWrapper}>
                  <div style={{
                    ...stepCircle,
                    backgroundColor: isComplete ? "#22c55e" : 
                                     isPending ? "#eab308" : 
                                     isReject ? "#ef4444" : "#e2e8f0",
                    color: isComplete || isPending ? "#fff" : "#64748b",
                    animation: isActive && isPending ? "pulse 2s infinite" : "none"
                  }}>
                    {isComplete ? "✔" : isReject ? "✖" : index + 1}
                  </div>
                  <div style={stepDesignation}>{row.designation}</div>
                  <div style={{
                    ...stepStatus,
                    color: isComplete ? "#22c55e" : isPending ? "#eab308" : isReject ? "#ef4444" : "#94a3b8"
                  }}>
                    {isComplete ? "Complete" : isPending ? "Pending" : isReject ? "Rejected" : ""}
                  </div>
                </div>

                {index < data.length - 1 && (
                  <div style={{
                    ...connectorLine,
                    backgroundColor: index < currentIndex ? "#22c55e" : "#e2e8f0"
                  }} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ================= STYLES ================= */
const page = { minHeight: "100vh", background: "#425796", padding: 10, fontFamily: "Segoe UI" };

const card = { 
  background: "#748ec2", 
  borderRadius: 15, 
  padding: 12, 
  boxShadow: "0 5px 15px rgba(0,0,0,.1)" 
};

const actionBar = { 
  display: "flex", 
  justifyContent: "space-between", 
  alignItems: "center", 
  gap: 10, 
  marginBottom: 12, 
  flexWrap: "wrap" 
};

const tableWrapper = { 
  overflow: "auto", 
  border: "3px solid #000000", 
  borderRadius: 12 
};

const table = { width: "100%", borderCollapse: "collapse", fontSize: "12.5px" };
const thead = { background: "#2563eb", color: "#fff" };
const th = { padding: "8px 6px", textAlign: "center" };
const td = { padding: "6px 5px", textAlign: "center", borderBottom: "1px solid #ddd" };

const input = { 
  padding: 8, 
  borderRadius: 8, 
  border: "1px solid #ccc", 
  fontSize: "13px", 
  width: "100%", 
  marginBottom: 8 
};

const overlay = { 
  position: "fixed", 
  inset: 0, 
  background: "rgba(0,0,0,.45)", 
  display: "flex", 
  justifyContent: "center", 
  alignItems: "center", 
  zIndex: 1000 
};

const modal = { 
  background: "#27225a", 
  padding: 22, 
  borderRadius: 15, 
  width: 340, 
  color: "#fff" 
};

/* Buttons */
const btnBlue = { background: "#2563eb", color: "#fff", padding: "6px 14px", border: 0, borderRadius: 8 };
const btnGreen = { background: "#47b491", color: "#fff", padding: "6px 14px", border: 0, borderRadius: 8 };
const btnGray = { background: "#e5e7eb", color: "#333", padding: "6px 14px", border: 0, borderRadius: 8 };
const btnLogout = { background: "#dc2626", color: "#fff", padding: "8px 14px", border: 0, borderRadius: 8 };
const btnView = { background: "#2e4770", color: "#fff", padding: "6px 14px", border: 0, borderRadius: 8 };

const btnEdit = { background: "#f59e0b", color: "#fff", padding: "4px 9px", border: 0, borderRadius: 6, fontSize: "12px" };
const btnDelete = { background: "#dc2626", color: "#fff", padding: "4px 9px", border: 0, borderRadius: 6, fontSize: "12px" };
const btnReprocess = { 
  background: "#d204fb", 
  color: "#fff", 
  padding: "4px 9px", 
  border: 0, 
  borderRadius: 6, 
  fontWeight: "bold", 
  fontSize: "12px" 
};

/* ================= TIMELINE STYLES (Reduced Text Size) ================= */
const timelineCard = {
  background: "#fff",
  borderRadius: "12px",
  padding: "14px 16px",
  marginBottom: "14px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  border: "1px solid #e2e8f0"
};

const timelineTitle = {
  margin: "0 0 12px 0",
  color: "#1e40af",
  fontSize: "16px",           // Smaller title
  fontWeight: "700"
};

const timelineContainer = {
  display: "flex",
  alignItems: "flex-start",
  overflowX: "auto",
  paddingBottom: "6px",
  gap: "6px"
};

const stepWrapper = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  minWidth: "78px"
};

const stepCircle = {
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "16px",
  fontWeight: "bold",
  boxShadow: "0 3px 8px rgba(0,0,0,0.12)",
  transition: "all 0.3s ease"
};

const stepDesignation = {
  marginTop: "5px",
  fontSize: "11.5px",         // Reduced text size
  fontWeight: "600",
  textAlign: "center",
  color: "#1e2937",
  lineHeight: "1.2"
};

const stepStatus = {
  marginTop: "2px",
  fontSize: "11px",           // Reduced
  fontWeight: "500"
};

const connectorLine = {
  height: "3.5px",
  flex: 1,
  marginTop: "17px",
  transition: "all 0.4s ease"
};

const allCompleteStyle = {
  background: "#ecfdf5",
  color: "#166534",
  padding: "12px",
  borderRadius: "10px",
  textAlign: "center",
  fontSize: "15px",
  fontWeight: "500"
};

/* Pulse Animation */
const style = document.createElement('style');
style.innerHTML = `
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.15); }
    100% { transform: scale(1); }
  }
`;
document.head.appendChild(style);