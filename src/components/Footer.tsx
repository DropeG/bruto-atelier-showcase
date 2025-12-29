import { useState } from "react";
import { motion } from "framer-motion";
import { Instagram, Mail, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const Footer = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast({
      title: "Mensaje enviado",
      description: "Nos pondremos en contacto contigo pronto.",
    });
    
    setFormData({ name: "", email: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <footer id="contacto" className="bg-foreground text-primary-foreground">
      <div className="section-padding py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Column - Info */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-serif text-4xl md:text-5xl lg:text-6xl mb-8"
            >
              Hablemos
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-primary-foreground/70 text-lg mb-12 max-w-md"
            >
              Cada pieza es única. Cuéntanos tu visión y crearemos algo extraordinario juntos.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <a
                href="mailto:hello@brutoatelier.com"
                className="flex items-center gap-4 text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span className="text-editorial">hello@brutoatelier.com</span>
              </a>
              <a
                href="https://instagram.com/brutoatelier"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              >
                <Instagram className="w-5 h-5" />
                <span className="text-editorial">@brutoatelier</span>
              </a>
              <div className="flex items-center gap-4 text-primary-foreground/70">
                <MapPin className="w-5 h-5" />
                <span className="text-editorial">Santiago de Chile</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Contact Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <label htmlFor="name" className="text-editorial text-primary-foreground/70 block mb-3">
                Nombre
              </label>
              <Input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-transparent border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 focus:border-primary-foreground/50 rounded-none"
                placeholder="Tu nombre"
              />
            </div>

            <div>
              <label htmlFor="email" className="text-editorial text-primary-foreground/70 block mb-3">
                Email
              </label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-transparent border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 focus:border-primary-foreground/50 rounded-none"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="text-editorial text-primary-foreground/70 block mb-3">
                Mensaje
              </label>
              <Textarea
                id="message"
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="bg-transparent border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 focus:border-primary-foreground/50 rounded-none min-h-[150px] resize-none"
                placeholder="Cuéntanos sobre tu proyecto..."
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-foreground text-foreground hover:bg-primary-foreground/90 rounded-none py-6 text-editorial"
            >
              {isSubmitting ? "Enviando..." : "Enviar mensaje"}
            </Button>
          </motion.form>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="font-serif text-lg">
            BRUTO <span className="italic">Atelier</span>
          </p>
          <p className="text-editorial text-primary-foreground/50">
            © {new Date().getFullYear()} Todos los derechos reservados
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
