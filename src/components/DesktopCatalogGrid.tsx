import React from 'react';

const mockProducts = {
  hero: {
    id: '1',
    name: 'Lámpara Luz',
    material: 'Madera de nogal',
    price: '$850.000 CLP',
    imageUrl: '/images/mock/lamp.jpg',
  },
  bottomLeft: {
    id: '2',
    name: 'Taza Verde',
    imageUrl: '/images/mock/cup.jpg',
  },
  bottomRight: {
    id: '3',
    name: 'Fundas de Cuero',
    imageUrl: '/images/mock/sleeves.jpg',
  }
};

export const DesktopCatalogGrid: React.FC = () => {
  return (
    <div className="hidden lg:flex flex-col w-full h-full bg-stone-100 overflow-hidden">
      {/* Top Row / Hero (60%) */}
      <div className="flex w-full h-[60%]">
        {/* Left: Image (60%) */}
        <div className="w-[60%] h-full relative">
          <img 
            src={mockProducts.hero.imageUrl} 
            alt={mockProducts.hero.name}
            className="w-full h-full object-cover"
          />
        </div>
        {/* Right: Solid Color Block (40%) */}
        <div className="w-[40%] h-full flex flex-col justify-center px-12 xl:px-16 bg-[#987a67] text-[#f4efe8]">
          <h2 className="text-4xl xl:text-5xl font-serif mb-3 leading-tight tracking-wide">
            {mockProducts.hero.name}
          </h2>
          <p className="text-base xl:text-lg font-light opacity-90 mb-4 xl:mb-6">
            {mockProducts.hero.material}
          </p>
          <p className="text-sm xl:text-md tracking-wider mb-6 xl:mb-8">
            {mockProducts.hero.price}
          </p>
          <div>
            <a 
              href="#" 
              className="inline-flex items-center text-xs xl:text-sm uppercase tracking-widest border-b border-[#f4efe8]/50 pb-1 hover:border-[#f4efe8] transition-colors"
            >
              Ver producto
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Row (40%) */}
      <div className="flex w-full h-[40%]">
        {/* Left Bottom */}
        <div className="w-1/2 h-full relative group cursor-pointer overflow-hidden">
          <img 
            src={mockProducts.bottomLeft.imageUrl} 
            alt={mockProducts.bottomLeft.name}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20 transition-colors duration-500 group-hover:bg-black/10" />
          <h3 className="absolute bottom-8 left-8 text-3xl font-serif text-[#f4efe8] tracking-wide">
            {mockProducts.bottomLeft.name}
          </h3>
        </div>
        
        {/* Right Bottom */}
        <div className="w-1/2 h-full relative group cursor-pointer overflow-hidden">
          <img 
            src={mockProducts.bottomRight.imageUrl} 
            alt={mockProducts.bottomRight.name}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20 transition-colors duration-500 group-hover:bg-black/10" />
          <h3 className="absolute bottom-8 left-8 text-3xl font-serif text-[#f4efe8] tracking-wide">
            {mockProducts.bottomRight.name}
          </h3>
        </div>
      </div>
    </div>
  );
};
