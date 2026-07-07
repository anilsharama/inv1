import React, { useState } from "react";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { loginUser } from "../api/client";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      const response = await loginUser({
        username,
        password,
      });

      localStorage.setItem(
        "user",
        JSON.stringify(response.user)
      );

      localStorage.setItem(
        "role",
        response.role
      );

      // alert(response.message);

      if (response.role === "admin") {
        window.location.href = "/InvoiceAdmin";
      } else {
        window.location.href = "/invoiceFlowPage";
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="blue-light"></div>
      <div className="pink-light"></div>

      <div className="login-card">
        <div className="logo-section">
          <h1>
            {/* DAYTON  and <span>TCIl</span> */}
          </h1>
         
        </div>

        <h2>
          Welcome <span>Back</span>
        </h2>

        <p className="subtitle">
          IN DAYTON AND TCIL
        </p>

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="input-box">
            <User size={20} />

            <input
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              required
            />
          </div>

          <div className="input-box">
            <Lock size={20} />

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Enter Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading
              ? "Please Wait..."
              : "Login"}
          </button>
        </form>

        <div className="footer-text">
          Glad to see you again!
        </div>
      </div>

      <style>{`
        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
        }

        .login-page{
          min-height:100vh;
          display:flex;
          justify-content:center;
          align-items:center;
          background:#03071d;
          position:relative;
          overflow:hidden;
          font-family:'Segoe UI',sans-serif;
        }

        .blue-light{
          position:absolute;
          left:-120px;
          top:50%;
          transform:translateY(-50%);
          width:280px;
          height:280px;
          background:#0d6efd;
          filter:blur(130px);
          opacity:.4;
        }

        .pink-light{
          position:absolute;
          right:-120px;
          top:50%;
          transform:translateY(-50%);
          width:280px;
          height:280px;
          background:#ff3ef7;
          filter:blur(130px);
          opacity:.4;
        }

        .login-card{
          width:400px;
          padding:30px;
          border-radius:28px;
          background:rgba(10,15,40,.45);
          backdrop-filter:blur(25px);
          border:1px solid rgba(255,255,255,.1);
          box-shadow:
            0 0 25px rgba(0,0,0,.5),
            0 0 15px rgba(52,152,255,.25);
          color:white;
          z-index:2;
        }

        .logo-section{
          text-align:center;
          margin-bottom:18px;
        }

        .logo-section h1{
          font-size:28px;
          font-weight:800;
        }

        .logo-section span{
          color:#d946ef;
        }

        .logo-section p{
          margin-top:5px;
          font-size:13px;
          color:#bdbdbd;
          letter-spacing:1px;
        }

        h2{
          text-align:center;
          font-size:34px;
          font-weight:700;
        }

        h2 span{
          background:linear-gradient(
            90deg,
            #00aaff,
            #ff4df5
          );
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
        }

        .subtitle{
          text-align:center;
          margin-top:8px;
          margin-bottom:25px;
          color:#bdbdbd;
          font-size:15px;
        }

        .error-box{
          background:rgba(255,0,0,.15);
          color:#ff7d7d;
          padding:10px;
          border-radius:10px;
          text-align:center;
          margin-bottom:15px;
          font-size:14px;
        }

        .input-box{
          display:flex;
          align-items:center;
          gap:10px;
          height:58px;
          padding:0 16px;
          margin-bottom:16px;
          border-radius:16px;
          border:1px solid rgba(255,255,255,.1);
          background:rgba(255,255,255,.03);
        }

        .input-box svg{
          color:#6ea8ff;
        }

        .input-box input{
          flex:1;
          border:none;
          outline:none;
          background:none;
          color:white;
          font-size:15px;
        }

        .eye-btn{
          border:none;
          background:none;
          color:white;
          cursor:pointer;
        }

        .login-btn{
          width:100%;
          height:60px;
          border:none;
          border-radius:16px;
          margin-top:10px;
          font-size:20px;
          font-weight:700;
          color:white;
          cursor:pointer;
          background:linear-gradient(
            90deg,
            #008cff,
            #ff4df5
          );
          transition:.3s;
        }

        .login-btn:hover{
          transform:translateY(-2px);
        }

        .login-btn:disabled{
          opacity:.7;
          cursor:not-allowed;
        }

        .footer-text{
          text-align:center;
          margin-top:20px;
          color:#bdbdbd;
          font-size:14px;
        }

        @media(max-width:480px){
          .login-card{
            width:92%;
            padding:22px;
          }

          h2{
            font-size:28px;
          }
        }
      `}</style>
    </div>
  );
}