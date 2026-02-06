

const Footer = () => {
  return (
    <footer className="bg-background text-foreground py-8 px-6 min-h-screen md:min-h-0 items-center">
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-3 gap-12 items-start">
          {/* Seccion BRUTO ATELIER */}
          <div>
            <h2 className="font-bold text-2xl md:text-4xl mb-2">BRUTO ATELIER</h2>
            <div className="space-y-1 text-base md:text-lg">
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
          </div>

          {/* Seccion PUBLICACIONES Y Diseño */}
          <div className="flex flex-col justify-between">
            <div>
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
            </div>  
            <div className="relative flex items-center my-6">
              <div className="flex-grow border-t border-foreground/20"></div>
              <div className="mx-4 w-2 h-2 rounded-full border border-foreground/40"></div>
              <div className="flex-grow border-t border-foreground/20"></div>
            </div>
            <div>      
              <p className="mb-2 text-sm">Diseño sitio web: BRUTO Atelier x DROPE — Design System International</p>
              <p className="mb-2 text-sm">Retratos equipo: BRUTO Atelier</p>
            </div>  
          </div>

          {/* Seccion COPYRIGHT */}
          <div>
            <p className="font-bold text-sm md:text-base">© 2026 BRUTO ATELIER</p>
            <p className="mt-2 text-xs md:text-sm">Este sitio web y su contenido son propiedad intelectual de BRUTO ATELIER, reservados todos los derechos.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
