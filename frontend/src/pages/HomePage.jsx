import { Link } from "react-router-dom";
import { FaShieldAlt, FaMobileAlt, FaMoneyCheckAlt } from "react-icons/fa";

const HomePage = () => {
  return (
    <section className="container">
      <div className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Modern Banking for Everyday Life</h1>
            <p>
              Manage accounts, transfer money, track transactions, and monitor users with a secure
              full-stack banking system.
            </p>
          </div>
          <div className="hero-actions">
            <Link to="/login" className="btn-primary btn-hero">
              Get Started
            </Link>
          </div>
        </div>
      </div>

      <div className="cards-grid">
        <article className="card">
          <FaShieldAlt className="feature-icon" />
          <h3>Secure Authentication</h3>
          <p>JWT-based login and protected user/admin routes.</p>
        </article>
        <article className="card">
          <FaMoneyCheckAlt className="feature-icon" />
          <h3>Smart Transactions</h3>
          <p>Transfer funds instantly with strict input validation.</p>
        </article>
        <article className="card">
          <FaMobileAlt className="feature-icon" />
          <h3>Mobile Ready</h3>
          <p>Responsive design optimized for desktop, tablet, and phone.</p>
        </article>
      </div>
    </section>
  );
};

export default HomePage;

