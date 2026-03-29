import ContactForm from "@/components/ContactForm";

export default function Home() {
  return (
    <main>
      <div className="container">
        <div className="header">
          <h1>Formulaire de Contact</h1>
        </div>
        <div className="form-card">
          <ContactForm />
          <div className="divider">
            <span>OU</span>
          </div>
          <a href="#" className="facebook-login">
            <span>Se connecter avec Facebook</span>
          </a>
          <div className="forgot-password">
            <a href="#">Mot de passe oublié ?</a>
          </div>
        </div>
        <div className="export-section">
          <span>Vous n'avez pas de compte ? <a href="#">Inscrivez-vous</a></span>
        </div>
      </div>
    </main>
  );
}