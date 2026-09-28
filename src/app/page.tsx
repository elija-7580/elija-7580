"use client";

import { useState } from "react";
import {
  Beaker,
  BookOpen,
  Handshake,
  Mail,
  MessageCircle,
  Sparkles,
} from "lucide-react";

const highlights = [
  {
    icon: Beaker,
    text: "Working on my bachelor's thesis — adaptive laboratory evolution of E. coli for industrial wastewater treatment (EcoCoat).",
  },
  {
    icon: BookOpen,
    text: "Learning bioinformatics, scientific writing, and lab automation.",
  },
  {
    icon: Handshake,
    text: "Open to collaborating on biotech, environmental biotech, or applied microbiology projects.",
  },
  {
    icon: MessageCircle,
    text: "Ask me about biotechnology, lab work, or PARA-based knowledge management.",
  },
  {
    icon: Sparkles,
    text: "Fun fact: I'm evolving bacteria to eat industrial paint waste.",
  },
];

export default function HomePage() {
  const [status, setStatus] = useState<{
    type: "idle" | "ok" | "err";
    message: string;
  }>({ type: "idle", message: "" });
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: "idle", message: "" });

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to send message.");
      }

      form.reset();
      setStatus({ type: "ok", message: "Message sent. I'll get back to you soon." });
    } catch (error) {
      setStatus({
        type: "err",
        message: error instanceof Error ? error.message : "Something went wrong.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main>
      <section className="hero">
        <div className="eyebrow">
          <Mail size={16} />
          Portfolio
        </div>
        <h1>Elija F.-U.</h1>
        <p className="lead">
          Biotechnology student focused on applied microbiology, laboratory evolution,
          and building practical tools at the intersection of science and software.
        </p>
        <div className="links">
          <a href="mailto:elija.sfu@icloud.com">elija.sfu@icloud.com</a>
          <a href="https://github.com/elija-7580" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </section>

      <div className="grid">
        <section className="card">
          <h2>About</h2>
          <ul className="list">
            {highlights.map((item) => (
              <li key={item.text}>
                <item.icon size={18} />
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card">
          <h2>Contact</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Name
              <input name="name" required autoComplete="name" />
            </label>
            <label>
              Email
              <input name="email" type="email" required autoComplete="email" />
            </label>
            <label>
              Message
              <textarea name="message" required />
            </label>
            <button type="submit" disabled={submitting}>
              {submitting ? "Sending..." : "Send message"}
            </button>
            <p
              className={`status ${status.type === "ok" ? "ok" : status.type === "err" ? "err" : ""}`}
            >
              {status.message}
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}
