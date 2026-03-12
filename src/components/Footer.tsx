

const Footer = () => {
  return (
    <footer className="md:snap-start md:snap-always bg-background text-foreground py-8 px-6 min-h-auto md:h-screen md:flex md:items-center md:justify-center">
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-12 items-start">
          {/* Seccion BRUTO ATELIER */}
          <div className="flex flex-col">
            <div>
              <h2 className="font-bold text-lg md:text-4xl mb-2">BRUTO ATELIER</h2>
              <div className="space-y-1 text-xs md:text-lg">
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
                    href="mailto:hola@bruto-atelier.com"
                    className="underline"
                  >
                    hola@bruto-atelier.com
                  </a>
                </p>
              </div>
            </div>

            {/* Seccion COPYRIGHT - aparece debajo en mobile */}
            <div className="md:hidden mt-6">
              <p className="font-bold text-xs">© 2026 BRUTO ATELIER</p>
              <p className="pt-2 text-xs">Todos los derechos reservados.</p>
            </div>
          </div>

          {/* Seccion PUBLICACIONES Y Diseño */}
          <div className="flex flex-col justify-between md:row-span-1">
            <div className="pb-6">
              <h3 className="font-bold mb-2 text-xs md:text-base">PUBLICACIONES</h3>
              <p className="mb-2 text-xs md:text-base">
                Para publicaciones escríbenos a{" "}
                <a 
                  href="mailto:hola@bruto-atelier.com"
                  className="underline"
                >
                  hola@bruto-atelier.com
                </a>
              </p>
            </div>  
            <div>   
              <h3 className="font-bold mb-2 text-xs md:text-base">DISEÑO</h3>   
              <p className="mb-2 text-xs">Diseño sitio web: BRUTO Atelier x DROPE — Design System International</p>
              <p className="mb-2 text-xs">Imagenes: BRUTO Atelier</p>
            </div>  
          </div>

          {/* Seccion COPYRIGHT - solo en desktop */}
          <div className="hidden md:block">
            <p className="font-bold text-xs md:text-base">© 2026 BRUTO ATELIER</p>
            <p className="mt-2 text-xs">Este sitio web y su contenido son propiedad intelectual de BRUTO ATELIER, reservados todos los derechos.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
