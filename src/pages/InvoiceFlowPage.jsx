import React, { useEffect, useState, useRef } from "react";

const BASE_URL = "https://bcc-v6gz.onrender.com/api/invoice";

export default function InvoicePage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("May");
  const [selectedYear, setSelectedYear] = useState("2025");
  
  const [isAnyNodeHovered, setIsAnyNodeHovered] = useState(false);
  const [activeTapNodeId, setActiveTapNodeId] = useState(null);

  const validMonths = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getProcessDisplay = (row) => {
    const status = (row.process || "").toString().toLowerCase().trim();
    
    // Core custom configurations for our status layouts
    let dotColor = "#94a3b8";
    let text = row.process || "—";
    let baseStyle = { ...td };

    if (status.includes("complete")) {
      text = "Complete";
      dotColor = "#22c55e"; // Bright green dot
      baseStyle = { 
        ...td, 
        backgroundColor: "rgba(34, 197, 94, 0.12)", 
        color: "#4ade80", 
        fontWeight: "bold", 
        border: "1px solid rgba(34, 197, 94, 0.2)", 
        borderRadius: "4px" 
      };
    } else if (status.includes("reject")) {
      text = "Reject";
      dotColor = "#ef4444"; // Flashing Red Dot
      baseStyle = { 
        ...td, 
        backgroundColor: "rgba(239, 68, 68, 0.12)", 
        color: "#f87171", 
        fontWeight: "bold", 
        border: "1px solid rgba(239, 68, 68, 0.2)", 
        borderRadius: "4px" 
      };
    } else if (status.includes("pending")) {
      text = "Pending";
      dotColor = "#eab308"; // Amber dot
      baseStyle = { 
        ...td, 
        backgroundColor: "rgba(234, 179, 8, 0.12)", 
        color: "#fbbf24", 
        fontWeight: "bold", 
        border: "1px solid rgba(234, 179, 8, 0.2)", 
        borderRadius: "4px" 
      };
    }

    return {
      style: baseStyle,
      // Wrap content to safely bundle the text beside the flashing dot inline element
      render: () => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "flex-start" }}>
          <span 
            className="blink-status-dot" 
            style={{ 
              width: "7px", 
              height: "7px", 
              borderRadius: "50%", 
              backgroundColor: dotColor,
              boxShadow: `0 0 8px ${dotColor}`
            }} 
          />
          <span>{text}</span>
        </div>
      )
    };
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

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest(".pipeline-node-interactive") && !e.target.closest(".central-popup-modal")) {
        setActiveTapNodeId(null);
        setIsAnyNodeHovered(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const downloadCSV = () => {
    const headers = ["ID", "Designation", "Description", "Process", "Month", "Year"];
    const rows = data.map(item => [
      item.id, item.designation, item.description || "", item.process, item.month, item.year
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

  const selectedNodeData = data.find(item => item.id === activeTapNodeId);
  const selectedNodeIndex = data.findIndex(item => item.id === activeTapNodeId);

  return (
    <div style={page}>
      <div style={{
        ...blurOverlay,
        opacity: isAnyNodeHovered ? 1 : 0,
        pointerEvents: isAnyNodeHovered ? "auto" : "none"
      }} />

      {selectedNodeData && (
        <CentralNodeModal 
          row={selectedNodeData} 
          index={selectedNodeIndex} 
          onClose={() => {
            setActiveTapNodeId(null);
            setIsAnyNodeHovered(false);
          }}
        />
      )}

      {/* PIPELINE AT THE TOP */}
      <div style={{ ...timelineWrapperOuter, zIndex: isAnyNodeHovered ? 100 : 2 }}>
         <WorkflowTimeline 
            data={data} 
            setGlobalHover={setIsAnyNodeHovered} 
            activeTapNodeId={activeTapNodeId}
            setActiveTapNodeId={setActiveTapNodeId}
         />
      </div>

      <div style={{
        ...card,
        filter: isAnyNodeHovered ? "blur(4px) brightness(0.55)" : "none",
        transform: isAnyNodeHovered ? "scale(0.985)" : "scale(1)",
        transition: "filter 0.4s ease, transform 0.4s ease"
      }}>
        <div style={actionBar}>
          <div style={neonHeaderContainer}>
            <h2 style={mainTitleText}>INVOICE ECOSYSTEM GATEWAY</h2>
            <div style={glowBar} />
          </div>

          {/* DYNAMIC 5D METRIC DIMENSION DIAGRAM */}
          <DataDimensionMatrix data={data} />
          
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} style={input}>
              {validMonths.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} style={input}>
              {["2024", "2025", "2026"].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <button onClick={fetchData} className="glow-btn-green" style={btnGreen}>Refresh Engine</button>
            <button onClick={downloadCSV} className="glow-btn-gray" style={btnGray}>Export CSV</button>
            <button onClick={handleLogout} className="glow-btn-red" style={btnLogout}>Login</button>
          </div>
        </div>

        <div style={tableWrapper}>
          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#fff" }}>
              <div className="spinner" style={{ margin: "0 auto 10px auto" }}></div>
              <h5 style={{ color: "#a5b4fc", letterSpacing: "0.5px", fontSize: "12px", margin: 0 }}>Synchronizing Multi-Dimensional Registers...</h5>
            </div>
          ) : (
            <table style={table}>
              <thead style={thead}>
                <tr>
                  <th style={th}>Node ID</th>
                  <th style={th}>Authorized Designation</th>
                  <th style={th}>Operational Remarks</th>
                  <th style={th}>State Status</th>
                </tr>
              </thead>
              <tbody style={{ perspective: "800px" }}>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ ...td, color: "rgba(255,255,255,0.4)", padding: "20px", fontSize: "12px", textAlign: "center" }}>
                      🕳️ No spatial logs mapped to selected time parameters.
                    </td>
                  </tr>
                ) : (
                  data.map((row) => (
                    <DimensionalTableRow 
                      key={row.id} 
                      row={row} 
                      getProcessDisplay={getProcessDisplay} 
                    />
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= 5D DATA DIMENSION MATRIX COMPONENT ================= */
const DataDimensionMatrix = ({ data }) => {
  const total = data.length;
  const complete = data.filter(item => (item.process || "").toLowerCase().includes("complete")).length;
  const pending = data.filter(item => (item.process || "").toLowerCase().includes("pending")).length;
  const reject = data.filter(item => (item.process || "").toLowerCase().includes("reject")).length;

  const metrics = [
    { label: "TOTAL NODES", value: total, color: "#60a5fa", glow: "rgba(96, 165, 250, 0.4)", angle: "rotateY(-15deg) rotateX(10deg)" },
    { label: "COMPLETED", value: complete, color: "#4ade80", glow: "rgba(74, 222, 128, 0.4)", angle: "rotateY(-5deg) rotateX(10deg)" },
    { label: "PENDING", value: pending, color: "#fbbf24", glow: "rgba(251, 191, 36, 0.4)", angle: "rotateY(5deg) rotateX(10deg)" },
    { label: "REJECTED", value: reject, color: "#f87171", glow: "rgba(248, 113, 113, 0.4)", angle: "rotateY(15deg) rotateX(10deg)" }
  ];

  return (
    <div style={matrixStage}>
      {metrics.map((m, idx) => {
        const depthScale = m.value === 0 ? 0.9 : 1 + Math.min(m.value * 0.03, 0.15);
        
        return (
          <div 
            key={idx} 
            className="matrix-node-5d"
            style={{
              ...matrixNode,
              transform: `${m.angle} scale(${depthScale})`,
              borderColor: m.color,
              boxShadow: `0 8px 32px rgba(0, 0, 0, 0.5), 0 0 14px ${m.glow}, inset 0 0 8px ${m.glow}`
            }}
          >
            <div style={{ ...nodeGlowRing, animationDelay: `${idx * 0.2}s`, border: `1px dashed ${m.color}` }} />
            <span style={matrixLabel}>{m.label}</span>
            <span style={{ ...matrixValue, color: m.color, textShadow: `0 0 8px ${m.glow}` }}>{m.value}</span>
          </div>
        );
      })}
    </div>
  );
};

/* ================= CENTRAL VIEWPORT POPUP COMPONENT ================= */
const CentralNodeModal = ({ row, index, onClose }) => {
  const status = (row.process || "").toLowerCase();
  const isComplete = status.includes("complete");
  const isPending = status.includes("pending");
  const isReject = status.includes("reject");

  let themeGlowColor = "rgba(148, 163, 184, 0.5)";
  let statusText = "Initialized Node";
  let badgeBackground = "rgba(148, 163, 184, 0.15)";
  let accentGradient = "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)";
  let instruction = "System compiling initialization structural phases safely.";

  if (isComplete) {
    themeGlowColor = "rgba(34, 197, 94, 0.6)";
    statusText = "Verification Complete";
    badgeBackground = "rgba(34, 197, 94, 0.2)";
    accentGradient = "linear-gradient(135deg, #22c55e 0%, #10b981 100%)";
    instruction = "Node requirements completely parsed and clearing verification channels.";
  } else if (isPending) {
    themeGlowColor = "rgba(234, 179, 8, 0.6)";
    statusText = "Awaiting Final Clearance";
    badgeBackground = "rgba(234, 179, 8, 0.2)";
    accentGradient = "linear-gradient(135deg, #eab308 0%, #f97316 100%)";
    instruction = "Engine staging parameters until cryptographic structural signature audits update.";
  } else if (isReject) {
    themeGlowColor = "rgba(239, 68, 68, 0.6)";
    statusText = "Pipeline Flagged / Halted";
    badgeBackground = "rgba(239, 68, 68, 0.2)";
    accentGradient = "linear-gradient(135deg, #ef4444 0%, #ec4899 100%)";
    instruction = "Halted deployment sequence metrics due to mismatched processing metadata logs.";
  }

  return (
    <div className="central-popup-modal" style={{ ...centerPopupCard, boxShadow: `0 30px 70px rgba(0,0,0,0.8), 0 0 30px ${themeGlowColor}` }}>
      <div style={{ height: "6px", width: "100%", background: accentGradient, position: "absolute", top: 0, left: 0 }} />
      <button onClick={onClose} style={closeModalBtn}>×</button>

      <div style={modalHeader}>
        <div style={{ ...nodeBadge, background: badgeBackground, color: isComplete ? "#4ade80" : isPending ? "#fbbf24" : isReject ? "#f87171" : "#cbd5e1" }}>
          NODE 0{index + 1}
        </div>
        <h3 style={modalTitleText}>{row.designation}</h3>
      </div>

      <div style={modalDivider} />

      <div style={modalInfoGrid}>
        <div style={modalGridRow}>
          <span style={gridLabel}>REGISTRY IDENTIFIER</span>
          <span style={{ ...gridValue, color: "#60a5fa", fontWeight: "800" }}>#{row.id}</span>
        </div>
        <div style={modalGridRow}>
          <span style={gridLabel}>CURRENT PIPELINE STATE</span>
          <span style={{ ...gridValue, color: isComplete ? "#4ade80" : isPending ? "#fbbf24" : isReject ? "#f87171" : "#cbd5e1", fontWeight: "700" }}>
            {statusText}
          </span>
        </div>
        <div style={modalGridRow}>
          <span style={gridLabel}>OPERATIONAL PARAMETERS</span>
          <span style={{ ...gridValue, color: "#f1f5f9", fontStyle: "italic" }}>
            "{row.description || "No operational logging remarks declared."}"
          </span>
        </div>
        <div style={modalGridRow}>
          <span style={gridLabel}>TEMPORAL RECORD INDEX</span>
          <span style={{ ...gridValue, color: "#a5b4fc" }}>{row.month} Calendar Cycle, {row.year}</span>
        </div>
      </div>

      <div style={{ ...modalDivider, margin: "16px 0 12px 0" }} />

      <div style={{ ...systemTipArea, borderLeft: `3px solid ${isComplete ? "#22c55e" : isPending ? "#eab308" : isReject ? "#ef4444" : "#94a3b8"}` }}>
        <span style={{ fontWeight: "700", color: "#38bdf8", marginRight: "4px" }}>LOGIC METRIC:</span>
        {instruction}
      </div>
    </div>
  );
};

/* ================= 3D TILT ISOLATED DATA TABLE ROW ================= */
const DimensionalTableRow = ({ row, getProcessDisplay }) => {
  const rowRef = useRef(null);
  const display = getProcessDisplay(row);
  const isPending = row.process?.toLowerCase() === "pending";

  const handleRowMove = (e) => {
    if (!rowRef.current) return;
    const box = rowRef.current.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    rowRef.current.style.transform = `rotateX(${-y / 12}deg) rotateY(${x / 80}deg) translateZ(4px)`;
    rowRef.current.style.boxShadow = "0 6px 12px rgba(0,0,0,0.3)";
  };

  const handleRowReset = () => {
    if (!rowRef.current) return;
    rowRef.current.style.transform = "rotateX(0deg) rotateY(0deg) translateZ(0px)";
    rowRef.current.style.boxShadow = "none";
  };

  return (
    <tr 
      ref={rowRef}
      onMouseMove={handleRowMove}
      onMouseLeave={handleRowReset}
      className="table-row interactive-3d-element" 
      style={{
        ...(isPending ? { backgroundColor: "rgba(234, 179, 8, 0.02)" } : {}),
        transformStyle: "preserve-3d",
        transition: "transform 0.1s ease-out, box-shadow 0.2s ease"
      }}
    >
      <td style={{ ...td, fontWeight: "700", color: "#60a5fa", transform: "translateZ(5px)" }}>#{row.id}</td>
      <td style={{ ...td, color: "#f1f5f9", fontWeight: "500" }}>{row.designation}</td>
      <td style={{ ...td, color: "#94a3b8" }}>{row.description || "—"}</td>
      <td style={{ ...display.style, transform: "translateZ(6px)" }}>
        {/* Render text along with the flashing blink indicator dot */}
        {display.render()}
      </td>
    </tr>
  );
};

/* ================= COMPREHENSIVE SEQUENTIAL TIMELINE ================= */
const WorkflowTimeline = ({ data, setGlobalHover, activeTapNodeId, setActiveTapNodeId }) => {
  if (!data || data.length === 0) return null;

  return (
    <div style={timelineCard}>
      <h3 style={timelineTitle}>
        <span style={{ marginRight: 6 }}>🔮</span>Live Node Pipeline State Mapping
      </h3>
      <div style={timelineContainer}>
        {data.map((row, index) => (
          <DimensionalPipelineNode 
            key={row.id}
            row={row}
            index={index}
            isLast={index === data.length - 1}
            nextRow={data[index + 1]}
            setGlobalHover={setGlobalHover}
            activeTapNodeId={activeTapNodeId}
            setActiveTapNodeId={setActiveTapNodeId}
          />
        ))}
      </div>
    </div>
  );
};

/* ================= 3D TILT ISOLATED PIPELINE NODE WITH STATE INFO POPUP ================= */
const DimensionalPipelineNode = ({ row, index, isLast, nextRow, setGlobalHover, activeTapNodeId, setActiveTapNodeId }) => {
  const nodeRef = useRef(null);
  const isCurrentlyTapped = activeTapNodeId === row.id;

  const status = (row.process || "").toLowerCase();
  const isComplete = status.includes("complete");
  const isPending = status.includes("pending");
  const isReject = status.includes("reject");

  let statusColor = "#a1a1aa";
  let customGlow = "none";
  
  if (isComplete) { 
    statusColor = "#4ade80"; 
  } else if (isPending) { 
    statusColor = "#fbbf24"; 
    customGlow = "0 0 10px rgba(234, 179, 8, 0.3)";
  } else if (isReject) { 
    statusColor = "#f87171"; 
    customGlow = "0 0 10px rgba(239, 68, 68, 0.3)";
  }

  const handleNodeMove = (e) => {
    if (!nodeRef.current) return;
    const box = nodeRef.current.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    nodeRef.current.style.transform = `rotateX(${-y / 3}deg) rotateY(${x / 3}deg) translateZ(10px)`;
  };

  const handleNodeReset = () => {
    if (!nodeRef.current) return;
    nodeRef.current.style.transform = "rotateX(0deg) rotateY(0deg) translateZ(0px)";
  };

  const handleNodeTap = (e) => {
    e.stopPropagation();
    if (isCurrentlyTapped) {
      setActiveTapNodeId(null);
      setGlobalHover(false);
    } else {
      setActiveTapNodeId(row.id);
      setGlobalHover(true);
    }
  };

  return (
    <React.Fragment>
      <div 
        ref={nodeRef}
        onMouseMove={handleNodeMove}
        onMouseLeave={handleNodeReset}
        onClick={handleNodeTap}
        className="pipeline-node-interactive"
        style={{
          ...stepWrapper,
          transformStyle: "preserve-3d",
          transition: "transform 0.1s ease-out",
          zIndex: isCurrentlyTapped ? 1000 : 5
        }}
      >
        <div style={{
          ...stepCircle,
          backgroundColor: "#0f172a",
          borderColor: isCurrentlyTapped ? "#38bdf8" : statusColor,
          boxShadow: isCurrentlyTapped ? "0 0 15px #38bdf8" : customGlow,
          color: isCurrentlyTapped ? "#38bdf8" : statusColor,
          transform: isCurrentlyTapped ? "scale(1.22) translateZ(15px)" : "scale(1) translateZ(0px)"
        }}>
          {isComplete ? "✔" : isReject ? "✖" : index + 1}
        </div>
        
        <div style={{
          ...stepDesignation,
          color: isCurrentlyTapped ? "#38bdf8" : "#cbd5e1",
          fontWeight: isCurrentlyTapped ? "800" : "600"
        }}>{row.designation}</div>
        
        <div style={{ ...stepStatus, color: statusColor }}>
          {isComplete ? "Success" : isPending ? "Pending" : isReject ? "Rejected" : "Active"}
        </div>
      </div>

      {!isLast && (
        <div style={{
          ...connectorLine,
          background: `linear-gradient(90deg, ${statusColor}, ${
            (nextRow?.process || "").toLowerCase().includes("complete") ? "#4ade80" : 
            (nextRow?.process || "").toLowerCase().includes("pending") ? "#fbbf24" : 
            (nextRow?.process || "").toLowerCase().includes("reject") ? "#f87171" : "rgba(255,255,255,0.08)"
          })`
        }} />
      )}
    </React.Fragment>
  );
};

/* ================= 5D DIAGRAM COMPONENT STYLES ================= */
const matrixStage = {
  display: "flex",
  gap: "16px",
  padding: "10px",
  perspective: "1000px",
  flexWrap: "wrap",
  justify: "center",
  alignItems: "center",
  margin: "0 auto"
};

const matrixNode = {
  position: "relative",
  background: "rgba(15, 23, 42, 0.65)",
  backdropFilter: "blur(12px)",
  border: "1px solid",
  borderRadius: "14px",
  padding: "10px 18px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "100px",
  transformStyle: "preserve-3d",
  transition: "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)"
};

const nodeGlowRing = {
  position: "absolute",
  top: "-4px",
  left: "-4px",
  right: "-4px",
  bottom: "-4px",
  borderRadius: "18px",
  opacity: 0.6,
  pointerEvents: "none",
  animation: "matrixOrbit 4s linear infinite"
};

const matrixLabel = {
  fontSize: "9px",
  fontWeight: "700",
  color: "#94a3b8",
  letterSpacing: "1px",
  marginBottom: "2px",
  transform: "translateZ(10px)"
};

const matrixValue = {
  fontSize: "20px",
  fontWeight: "900",
  transform: "translateZ(20px)"
};

/* ================= NEW CENTRAL SCREEN MODAL STYLES MAP ================= */
const centerPopupCard = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "460px",
  background: "linear-gradient(165deg, rgba(30, 41, 59, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%)",
  backdropFilter: "blur(25px)",
  borderRadius: "24px",
  padding: "24px",
  zIndex: 10000,
  border: "1px solid rgba(255, 255, 255, 0.12)",
  fontFamily: "system-ui, -apple-system, sans-serif",
  animation: "modalZoomPulse 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
  overflow: "hidden"
};

const closeModalBtn = {
  position: "absolute",
  top: "14px",
  right: "18px",
  background: "none",
  border: 0,
  color: "rgba(255, 255, 255, 0.4)",
  fontSize: "22px",
  cursor: "pointer",
  outline: "none",
  transition: "color 0.2s",
  zIndex: 2
};

const modalHeader = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "8px",
  marginTop: "6px"
};

const nodeBadge = {
  fontSize: "10px",
  fontWeight: "800",
  padding: "3px 10px",
  borderRadius: "20px",
  letterSpacing: "1px",
  border: "1px solid rgba(255,255,255,0.05)"
};

const modalTitleText = {
  color: "#ffffff",
  fontSize: "17px",
  fontWeight: "800",
  margin: 0,
  letterSpacing: "0.2px"
};

const modalDivider = {
  height: "1px",
  background: "linear-gradient(90deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.02) 100%)",
  margin: "14px 0"
};

const modalInfoGrid = {
  display: "flex",
  flexDirection: "column",
  gap: "12px"
};

const modalGridRow = {
  display: "flex",
  flexDirection: "column",
  gap: "3px"
};

const gridLabel = {
  fontSize: "9.5px",
  color: "#64748b",
  fontWeight: "700",
  letterSpacing: "0.8px"
};

const gridValue = {
  fontSize: "13px",
  lineHeight: "1.4",
  wordBreak: "break-word"
};

const systemTipArea = {
  background: "rgba(15, 23, 42, 0.5)",
  padding: "10px 14px",
  borderRadius: "10px",
  fontSize: "11px",
  color: "#cbd5e1",
  lineHeight: "1.45"
};

/* ================= BASIC SCALED STYLES MAP ================= */
const page = { 
  minHeight: "100vh", 
  background: "radial-gradient(circle at 50% 50%, #17153b 0%, #0f172a 75%, #020617 100%)", 
  padding: "20px 16px", 
  fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "center",
  overflowX: "hidden",
  position: "relative"
};

const blurOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(2, 6, 23, 0.55)",
  backdropFilter: "blur(6px)",
  transition: "opacity 0.3s ease",
  zIndex: 999
};

const timelineWrapperOuter = {
  width: "100%",
  maxWidth: "1100px",
  position: "relative",
  marginBottom: "16px"
};

const card = { 
  background: "rgba(15, 23, 42, 0.45)", 
  backdropFilter: "blur(20px)",
  borderRadius: "20px", 
  padding: "20px", 
  boxShadow: "0 20px 50px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.05)",
  border: "1px solid rgba(255, 255, 255, 0.05)",
  width: "100%",
  maxWidth: "1100px"
};

const neonHeaderContainer = {
  position: "relative"
};

const mainTitleText = {
  color: "#f8fafc",
  fontSize: "13px",
  fontWeight: "800",
  letterSpacing: "2px",
  margin: 0
};

const glowBar = {
  height: "2px",
  width: "60px",
  background: "linear-gradient(90deg, #3b82f6, transparent)",
  borderRadius: "2px",
  marginTop: "4px"
};

const actionBar = { 
  display: "flex", 
  justifyContent: "space-between", 
  alignItems: "center", 
  gap: 12, 
  marginBottom: 16, 
  flexWrap: "wrap" 
};

const tableWrapper = { 
  overflow: "auto", 
  background: "rgba(2, 6, 23, 0.3)",
  borderRadius: "12px",
  border: "1px solid rgba(255, 255, 255, 0.03)"
};

const table = { width: "100%", borderCollapse: "collapse", fontSize: "12px" };
const thead = { background: "rgba(30, 41, 59, 0.5)", borderBottom: "1px solid rgba(255,255,255,0.05)" };
const th = { padding: "12px 16px", textAlign: "left", color: "#60a5fa", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" };
const td = { padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.02)", transition: "all 0.15s ease", color: "#e2e8f0" };

const input = { 
  padding: "8px 14px", 
  borderRadius: "8px", 
  border: "1px solid rgba(255,255,255,0.06)", 
  background: "#0f172a", 
  color: "#38bdf8",
  fontSize: "12px",
  fontWeight: "600",
  outline: "none",
  cursor: "pointer"
};

const btnGreen = { background: "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)", color: "#fff", padding: "8px 14px", border: 0, borderRadius: "8px", fontWeight: "700", fontSize: "12px", cursor: "pointer", transition: "all 0.2s" };
const btnGray = { background: "rgba(255,255,255,0.04)", color: "#cbd5e1", padding: "8px 14px", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontWeight: "700", fontSize: "12px", cursor: "pointer", transition: "all 0.2s" };
const btnLogout = { background: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)", color: "#fff", padding: "8px 14px", border: 0, borderRadius: "8px", fontWeight: "700", fontSize: "12px", cursor: "pointer", transition: "all 0.2s" };

const timelineCard = {
  background: "rgba(15, 23, 42, 0.6)",
  backdropFilter: "blur(20px)",
  borderRadius: "20px",
  padding: "16px 20px",        
  border: "1px solid rgba(255, 255, 255, 0.08)",
  boxShadow: "0 15px 35px rgba(0,0,0,0.4)"
};

const timelineTitle = {
  margin: "0 0 14px 0",        
  color: "#94a3b8",
  fontSize: "11px",            
  fontWeight: "700",
  letterSpacing: "0.8px",
  textTransform: "uppercase"
};

const timelineContainer = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexWrap: "wrap",
  gap: "12px 0px",
  overflowX: "hidden", 
  padding: "20px 5px 10px 5px",
  perspective: "800px"
};

const stepWrapper = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  flex: "1 1 95px",
  maxWidth: "140px",
  position: "relative",
  cursor: "pointer"
};

const stepCircle = {
  width: "34px",               
  height: "34px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "12px",
  fontWeight: "800",
  border: "2px solid",
  transition: "transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.2s ease, border-color 0.2s"
};

const stepDesignation = {
  marginTop: "8px",
  fontSize: "11px",            
  fontWeight: "600",
  textAlign: "center",
  lineHeight: "1.3",
  transition: "color 0.2s ease",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  width: "100%",
  padding: "0 4px"
};

const stepStatus = {
  marginTop: "3px",
  fontSize: "9px",
  fontWeight: "600",
  textTransform: "uppercase",
  letterSpacing: "0.3px"
};

const connectorLine = {
  height: "2px",
  flex: "1 1 20px",
  minWidth: "15px",
  maxWidth: "50px",
  alignSelf: "center",
  marginBottom: "26px",
  zIndex: 1,
  opacity: 0.5
};

// Inject critical 5D keyframe orbits and status animations into document safely
const style = document.createElement('style');
style.innerHTML = `
  @keyframes modalZoomPulse {
    from { opacity: 0; transform: translate(-50%, -45%) scale(0.92); }
    to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  }
  @keyframes matrixOrbit {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  /* Continuous smooth heartbeat-style blinking animation for data indicators */
  @keyframes blinkDotAnimation {
    0%, 100% { opacity: 0.35; transform: scale(0.9); }
    50% { opacity: 1; transform: scale(1.15); }
  }
  .blink-status-dot {
    animation: blinkDotAnimation 1.2s ease-in-out infinite;
  }
  .matrix-node-5d:hover {
    transform: rotateY(0deg) rotateX(0deg) scale(1.18) translateZ(30px) !important;
    background: rgba(30, 41, 59, 0.9);
    cursor: crosshair;
  }
  .interactive-3d-element {
    transform-style: preserve-3d;
    backface-visibility: hidden;
  }
  .table-row {
    transition: background-color 0.15s ease, transform 0.1s ease-out, box-shadow 0.15s ease !important;
  }
  .table-row:hover {
    background-color: rgba(56, 189, 248, 0.04) !important;
    z-index: 10;
  }
  .spinner {
    border: 2px solid rgba(255,255,255,0.05);
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border-left-color: #60a5fa;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  .glow-btn-green:hover { transform: translateY(-0.5px); box-shadow: 0 3px 8px rgba(34,197,94,0.25); }
  .glow-btn-gray:hover { transform: translateY(-0.5px); background: rgba(255,255,255,0.06); }
  .glow-btn-red:hover { transform: translateY(-0.5px); box-shadow: 0 3px 8px rgba(220,38,38,0.25); }
  .central-popup-modal button:hover { color: #ffffff !important; }
`;
document.head.appendChild(style);