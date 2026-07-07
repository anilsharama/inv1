import logo from '../assets/dayton-logo.png';
import { Building2 } from "lucide-react";

export default function AppHeader() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #0f2942 0%, #1e3a5f 50%, #162d4a 100%)',
      color: 'white',
      padding: '12px 28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '4px solid #3b82f6',
      boxShadow: '0 4px 20px rgba(15, 41, 66, 0.6)',
      position: 'relative',
      overflow: 'hidden',
      borderRadius : 20,
    }}>
      
      {/* Left Side - Logo + 3D Company Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        
        {/* Logo with 3D Effect */}
        <div style={{
          padding: '6px',
          background: 'white',
          borderRadius: '10px',
          boxShadow: '0 8px 16px rgba(0,0,0,0.3), inset 0 -4px 6px rgba(0,0,0,0.1)',
          transform: 'perspective(400px) rotateX(8deg)',
        }}>
          <img 
            src={logo} 
            alt="Dayton" 
            style={{ 
              height: 42, 
              borderRadius: '6px'
            }} 
          />
        </div>

        {/* 3D Company Name */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '2px'
          }}>
            <Building2 size={28} color="#60a5fa" />
            
            <h1 style={{
              margin: 0,
              fontSize: '26px',
              fontWeight: '900',
              letterSpacing: '-0.5px',
              background: 'linear-gradient(135deg, #e0f2fe, #bae6fd, #ffffff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: `
                3px 3px 0 #1e40af,
                -2px -2px 0 #1e40af,
                4px 6px 8px rgba(0, 0, 0, 0.5)
              `,
              transform: 'perspective(500px) rotateX(12deg)',
              lineHeight: '1.1'
            }}>
              DAYTON
            </h1>
          </div>

          <div style={{
            fontSize: '15px',
            fontWeight: '700',
            color: '#bae6fd',
            marginLeft: '38px',
            textShadow: '0 2px 4px rgba(0,0,0,0.4)'
          }}>
            NATURAL RESOURCES
          </div>

          <div style={{
            fontSize: '11px',
            opacity: 0.85,
            marginLeft: '38px',
            marginTop: '2px',
            letterSpacing: '0.5px'
          }}>
            INVOICE PAYMENT & WORKFLOW MANAGEMENT
          </div>
        </div>
      </div>

      {/* Right Side - Government Tag */}
      <div style={{
        textAlign: 'right',
        fontSize: '13px',
        opacity: 0.9,
        lineHeight: '1.4'
      }}>
        <div style={{ fontWeight: 600 }}>Government of India</div>
        <div style={{ fontSize: '12px', opacity: 0.8 }}>Finance Division</div>
      </div>

      {/* Subtle 3D Shine Effect */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-20%',
        width: '60%',
        height: '300%',
        background: 'linear-gradient(120deg, transparent, rgba(255,255,255,0.25), transparent)',
        transform: 'rotate(25deg)',
        pointerEvents: 'none'
      }} />
    </div>
  );
}