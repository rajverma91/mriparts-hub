
import "../app/css/MedicalEquipment.css";


const VerifiedIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <path
      d="M24 3l5 3 6-1 2 6 5 4-2 6 2 6-5 4-2 6-6-1-5 3-5-3-6 1-2-6-5-4 2-6-2-6 5-4 2-6 6 1z"
      stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"
    />
    <circle cx="24" cy="23" r="13" stroke="currentColor" strokeWidth="2.5"/>
    <circle cx="24" cy="19" r="4" stroke="currentColor" strokeWidth="2.5"/>
    <path d="M16 32v-3a8 8 0 0116 0v3l-8 5z"
      stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
    <path d="M20 30l4 3 4-3" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const TradeIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <path d="M17 5l7-3-3 7" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 5A21 21 0 1028 5" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="18" cy="17" r="2.5" stroke="currentColor" strokeWidth="2.5"/>
    <circle cx="30" cy="31" r="2.5" stroke="currentColor" strokeWidth="2.5"/>
    <path d="M31 15L17 33" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round"/>
  </svg>
);

const CartIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <path d="M3 6h6l5 25h25l5-19H11"
      stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 17h27M17 25h22M21 12l2 19M32 12l-2 19"
      stroke="currentColor" strokeWidth="2"/>
    <circle cx="18" cy="38" r="3" stroke="currentColor" strokeWidth="2.5"/>
    <circle cx="35" cy="38" r="3" stroke="currentColor" strokeWidth="2.5"/>
  </svg>
);

const PlatformIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <path d="M23 3l2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5-3.6-3.5 5-.7z"
      fill="currentColor"/>
    <path d="M6 33h9v10H6zM20 22h9v21h-9zM34 28h9v15h-9z"
      fill="currentColor"/>
    <path d="M3 44h43" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

export default function MedicalEquipment() {
  return (
    <section className="medical-equipment">
      <h1>New &amp; Used Medical Equipment</h1>

      <div className="medical-features">
        <div className="medical-feature">
          <span className="medical-icon">
            <VerifiedIcon />
          </span>
          <p>
            <strong>Reliable</strong> and <strong>verified</strong>
            <br />
            sellers of <strong>BiMedis</strong>
          </p>
        </div>

        <div className="medical-feature">
          <span className="medical-icon">
            <TradeIcon />
          </span>
          <p>
            <strong>Trade in</strong> your
            <br />
            <strong>old</strong> equipment
          </p>
        </div>

        <div className="medical-feature">
          <span className="medical-icon">
            <CartIcon />
          </span>
          <p>
            <strong>520 138</strong> products
            <br />
            <strong>listed</strong>
          </p>
        </div>

        <div className="medical-feature">
          <span className="medical-icon">
            <PlatformIcon />
          </span>
          <p>
            The <strong>number 1 platform</strong> for <strong>the sale</strong>
            <br />
            of <strong>medical equipment</strong>
          </p>
        </div>
      </div>
    </section>
  );
}
