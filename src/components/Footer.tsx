

const Footer = () => {
  return (
    <footer className="bg-background text-foreground py-16">
      <div className="max-w-6xl mx-auto">
        <div>
          <h2 className="font-bold text-3xl mb-6">BRUTO ATELIER</h2>
          <div className="mb-6 space-y-1 text-lg">
            <p>Vitacura 4747</p>
            <p>7560801 Vitacura</p>
            <p>Santiago, Chile</p>
            <p>+56 9 4956 9887</p>
            <p><span className="underline">hola@brutoatelier.com</span></p>
          </div>
          <hr className="my-4 border-foreground/30" />
          <h3 className="font-bold mb-2">PUBLICACIONES</h3>
          <p className="mb-2">Para publicaciones escríbenos a <span className="underline">hola@brutoatelier.com</span></p>
          <hr className="my-4 border-foreground/30" />
          <p className="mb-2">Diseño sitio web: Mladen Marinovic — Design System International</p>
          <p className="mb-2">Retratos equipo: Mladen Marinovic</p>
          <hr className="my-4 border-foreground/30" />
          <p className="font-bold">© 2026 BRUTO ATELIER</p>
          <p className="mt-2 text-sm">Este sitio web y su contenido son propiedad intelectual de BRUTO ATELIER, reservados todos los derechos.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
