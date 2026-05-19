export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/10 pt-20 pb-10">
      <div className="container mx-auto px-6 md:px-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-1">
            <div className="font-serif italic text-2xl tracking-tight leading-none mb-4">OBSIDIAN MOTO</div>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Hand-built custom motorcycles for those who demand the absolute pinnacle of design, performance, and craftsmanship.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-medium mb-6">Shop</h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li><a href="#" className="hover:text-white transition-colors">All Models</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Apparel</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Parts & Accessories</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Gift Cards</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-medium mb-6">Custom</h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li><a href="#" className="hover:text-white transition-colors">Start a Build</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Gallery</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Process</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-medium mb-6">Follow</h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors">YouTube</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pinterest</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-xs text-white/40">
          <p>© {new Date().getFullYear()} Obsidian Moto. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
