import "../app/css/MedicalEquipment.css";

export default function MedicalEquipment() {
  return (
    <section className="medical-equipment">
      <h1 className="medical-title">
        New & Used Medical Equipment <br className="hide-mobile" /> and Accessories
      </h1>

      <div className="medical-features">
        
        <div className="medical-feature">
          <div className="medical-icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="medical-icon">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </div>
          <div className="medical-text">
            <strong>Trusted</strong> Marketplace for <br />
            <strong>MRI & CT Parts</strong>
          </div>
        </div>

        <div className="medical-feature">
          <div className="medical-icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="medical-icon">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <div className="medical-text">
            <strong>Trade in</strong> your <br />
            <strong>old</strong> equipment
          </div>
        </div>

        <div className="medical-feature">
          <div className="medical-icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="medical-icon">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </div>
          <div className="medical-text">
            <strong>120 500+</strong> products <br />
            <strong>listed</strong>
          </div>
        </div>

        <div className="medical-feature">
          <div className="medical-icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="medical-icon">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <div className="medical-text">
            The <strong>#1 platform</strong> for <strong>the sale</strong> 
            of <strong>medical equipment</strong>
          </div>
        </div>

      </div>
    </section>
  );
}