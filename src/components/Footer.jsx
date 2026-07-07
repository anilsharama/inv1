import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AppFooter() {
  const [footerData, setFooterData] = useState({
    departmentNumber: '011-23456789',
    email: 'support@dayton.gov.in',
    year: new Date().getFullYear()
  });

  const [loading, setLoading] = useState(true);

  // Fetch footer / contact data from backend
  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/footer'); // Adjust endpoint as needed
        if (res.data) {
          setFooterData({
            departmentNumber: res.data.departmentNumber || '011-23456789',
            email: res.data.email || 'support@dayton.gov.in',
            year: new Date().getFullYear()
          });
        }
      } catch (error) {
        console.error("Failed to fetch footer data, using defaults", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFooterData();
  }, []);

  return (
    <footer style={{
      background: 'linear-gradient(135deg, #0f2942 0%, #1e3a5f 100%)',
      color: '#cbd5e1',
      padding: '20px 28px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '13px',
      borderTop: '3px solid #3b82f6',
      boxShadow: '0 -4px 15px rgba(15, 41, 66, 0.6)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Left Side - Copyright with 3D Effect */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          padding: '6px 12px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '8px',
          backdropFilter: 'blur(10px)',
          boxShadow: 'inset 0 2px 6px rgba(255,255,255,0.1), 0 4px 12px rgba(0,0,0,0.4)',
          transform: 'perspective(400px) rotateX(8deg)'
        }}>
          © {footerData.year} Dayton Natural Resources
        </div>
        <span style={{ opacity: 0.7 }}>All rights reserved.</span>
      </div>

      {/* Center - Department Contact (Dynamic) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        fontSize: '13px',
        opacity: 0.9
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255,255,255,0.08)',
          padding: '6px 14px',
          borderRadius: '30px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}>
          📞 <strong>Dept No:</strong> {footerData.departmentNumber}
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255,255,255,0.08)',
          padding: '6px 14px',
          borderRadius: '30px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}>
          ✉️ <strong>Email:</strong> 
          <a 
            href={`mailto:${footerData.email}`} 
            style={{ color: '#60a5fa', textDecoration: 'none' }}
          >
            {footerData.email}
          </a>
        </div>
      </div>

      {/* Right Side - Links + Version */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
      }}>
        <a href="#" style={{ color: '#cbd5e1', textDecoration: 'none', transition: '0.2s' }}>
          Privacy Policy
        </a>
        <a href="#" style={{ color: '#cbd5e1', textDecoration: 'none', transition: '0.2s' }}>
          Terms of Use
        </a>
        <a href="#" style={{ color: '#cbd5e1', textDecoration: 'none', transition: '0.2s' }}>
          Support
        </a>
        
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
        }}>
          v1.0.0
        </div>
      </div>

      {/* 3D Shine Overlay */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-30%',
        width: '80%',
        height: '200%',
        background: 'linear-gradient(120deg, transparent, rgba(255,255,255,0.15), transparent)',
        transform: 'rotate(25deg)',
        pointerEvents: 'none',
        zIndex: 1
      }} />
    </footer>
  );
}