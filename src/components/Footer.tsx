

const Footer = () => {
  return (
    <footer className="bg-background text-foreground py-12 px-6 min-h-screen md:min-h-0 flex items-center">
      <div className="max-w-6xl mx-auto w-full">
        <div>
          <h2 className="font-bold text-2xl md:text-3xl mb-6">BRUTO ATELIER</h2>
          <div className="mb-6 space-y-1 text-base md:text-lg">
            <p>Vitacura 4747</p>
            <p>7560801 Vitacura</p>
            <p>Santiago, Chile</p>
            <p>
              <a
                href="https://wa.me/56949569887"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                +56 9 4956 9887
              </a>
            </p>
            <p>
              <a 
                href="mailto:hola@brutoatelier.com"
                className="underline"
              >
                hola@brutoatelier.com
              </a>
            </p>
          </div>
          <hr className="my-6 border-foreground/30" />
          <h3 className="font-bold mb-2 text-sm md:text-base">PUBLICACIONES</h3>
          <p className="mb-2 text-sm md:text-base">
            Para publicaciones escríbenos a{" "}
            <a 
              href="mailto:hola@brutoatelier.com"
              className="underline"
            >
              hola@brutoatelier.com
            </a>
          </p>
          <hr className="my-6 border-foreground/30" />
          <p className="mb-2 text-sm">Diseño sitio web: Bruto Atelier x DROPE — Design System International</p>
          <p className="mb-2 text-sm">Retratos equipo: Bruto Atelier</p>
          <hr className="my-6 border-foreground/30" />
          <p className="font-bold text-sm md:text-base">© 2026 BRUTO ATELIER</p>
          <p className="mt-2 text-xs md:text-sm">Este sitio web y su contenido son propiedad intelectual de BRUTO ATELIER, reservados todos los derechos.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
