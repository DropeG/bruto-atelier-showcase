import React from "react";

const ContactSection: React.FC = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") || "");
    const email = String(formData.get("email") || "");
    const message = String(formData.get("message") || "");

    const subject = encodeURIComponent("Consulta desde el sitio web");
    const body = encodeURIComponent(`Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`);
    window.location.href = `mailto:hola@brutoatelier.com?subject=${subject}&body=${body}`;
  };

  return (
    <section className="bg-white text-gray-900 py-16 px-6" id="contacto">
      <div className="max-w-2xl mx-auto">
        <div>
          <h2 className="text-sm tracking-[0.3em] font-semibold mb-3">CONTACT US</h2>
          <p className="text-lg text-gray-700 mb-6">
            For wholesale inquiries, please contact us at <span className="underline">hola@brutoatelier.com</span>
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="sr-only" htmlFor="name">Full name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Full Name"
                className="w-full border border-gray-300 px-4 py-3 text-sm tracking-wide focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="sr-only" htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Email"
                className="w-full border border-gray-300 px-4 py-3 text-sm tracking-wide focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="sr-only" htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows={6}
                required
                placeholder="Message"
                className="w-full border border-gray-300 px-4 py-3 text-sm tracking-wide focus:outline-none focus:border-black"
              />
            </div>
            <button
              type="submit"
              className="border border-gray-900 px-10 py-3 text-sm tracking-[0.2em] uppercase hover:bg-gray-900 hover:text-white transition-colors duration-200"
            >
              Enviar
            </button>
            <p className="text-[11px] text-gray-500">
              Este formulario redirige a tu cliente de correo para enviar la información a hola@brutoatelier.com.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
