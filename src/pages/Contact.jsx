import React from 'react'
export default function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    const textArea = document.querySelector('.text-area');
    const textareaField = textArea?.querySelector('textarea');
    if (textareaField) textareaField.value = ''; // clear textarea
    if (textArea) textArea.style.display = 'none';
    alert('Form submitted!');
  };
  return (
    <div className="form-card contact-form">
      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit}>
        <div className="text-area">
          <label className="field-label">Name</label>
          <input className="field-input" type="text" placeholder="Your Name" required="required" />

          <label className="field-label">Email</label>
          <input className="field-input" type="email" placeholder="Your Email" required="required" />

          <label className="field-label">Message</label>
          <textarea className="field-textarea" rows={4} placeholder="Type your message..." />
        </div>
        <button type="submit" className="btn btn--add btn--block">Send</button>
      </form>
    </div>
  )
}
