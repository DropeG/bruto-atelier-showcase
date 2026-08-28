import React from "react";
import NewsletterModal, { NewsletterModalProps } from "./NewsletterModal";

/**
 * Canonical AuthModal - Re-exports NewsletterModal ("Círculo Privado Bruto")
 * to maintain unified authentication architecture across the application.
 */
const AuthModal: React.FC<NewsletterModalProps> = (props) => {
  return <NewsletterModal {...props} />;
};

export default AuthModal;
export { NewsletterModal as CirculoPrivadoModal };
export type { NewsletterModalProps };


