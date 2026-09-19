import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Contact = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Thanks -- we will get back to you within a day.", {
      position: "bottom-left",
      autoClose: 2000,
      theme: "dark",
    });
    setEmail("");
  };

  return (
    <div className="contact-page-wrapper" id="Contact">
      <div className="contact-copy">
        <p className="primary-subheading">Get in touch</p>
        <h2>Questions about an order?</h2>
        <p className="primary-text">
          Write to us and someone at the counter &mdash; not a bot &mdash; replies
          within a day.
        </p>
      </div>
      <form className="contact-form-container" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="primary-button" type="submit">Send</button>
      </form>
    </div>
  );
};

export default Contact;
