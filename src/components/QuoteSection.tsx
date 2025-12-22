import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const QuoteSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30%" });

  const words = "El problema da origen a la forma, nuestro gesto la respuesta hablando a través del material".split(" ");

  return (
    <div
      ref={ref}
      className="relative w-full h-screen bg-quote-bg flex items-center justify-center section-padding"
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.blockquote className="font-serif text-2xl md:text-4xl lg:text-5xl text-foreground leading-relaxed md:leading-relaxed lg:leading-relaxed">
          {words.map((word, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
                ease: "easeOut",
              }}
              className="inline-block mr-[0.3em]"
            >
              {word}
            </motion.span>
          ))}
        </motion.blockquote>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-12 mx-auto w-16 h-px bg-foreground/30"
        />
      </div>
    </div>
  );
};

export default QuoteSection;
