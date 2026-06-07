import { useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Sac cuir premium",
    category: "Maroquinerie",
    price: 28500,
    originalPrice: 47500,
    discount: 40,
    likes: 1240,
    isNew: false,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=600&fit=crop&auto=format&q=85",
  },
  {
    id: 2,
    name: "Montre acier luxe",
    category: "Montres",
    price: 65000,
    originalPrice: 95000,
    discount: 32,
    likes: 863,
    isNew: true,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=600&fit=crop&auto=format&q=85",
  },
  {
    id: 3,
    name: "Oud Royal 50ml",
    category: "Parfumerie",
    price: 42000,
    originalPrice: 60000,
    discount: 30,
    likes: 2100,
    isNew: true,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&h=600&fit=crop&auto=format&q=85",
  },
  {
    id: 4,
    name: "Lunettes UV400",
    category: "Accessoires",
    price: 12500,
    originalPrice: 20000,
    discount: 38,
    likes: 3450,
    isNew: false,
    image: "https://images.unsplash.com/photo-1473496169904-658ba7574b0d?w=400&h=600&fit=crop&auto=format&q=85",
  },
];

function formatHTG(price: number) {
  return price.toLocaleString("fr-HT");
}

function Card({ product }: { product: typeof products[0] }) {
  const [liked, setLiked] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex flex-col rounded-xl overflow-hidden cursor-pointer"
      style={{ background: "#111111" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image zone — ultra portrait (2:3) */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "2/3" }}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700"
          style={{ transform: hovered ? "scale(1.08)" : "scale(1)" }}
        />

        {/* Gradient overlay bottom — price & name on image */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.2) 45%, transparent 65%)",
          }}
        />

        {/* NEW badge top-left */}
        {product.isNew && (
          <div
            className="absolute top-2.5 left-2.5 text-black text-xs font-black px-2 py-0.5 rounded-sm"
            style={{ background: "#C9A84C", fontSize: "9px", letterSpacing: "1px" }}
          >
            NOUVEAU
          </div>
        )}

        {/* Wishlist top-right */}
        <button
          onClick={() => setLiked(!liked)}
          className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all"
          style={{
            background: liked ? "rgba(201,168,76,0.9)" : "rgba(0,0,0,0.4)",
            backdropFilter: "blur(6px)",
            border: liked ? "none" : "1px solid rgba(255,255,255,0.15)"
          }}
        >
          <Heart
            size={14}
            fill={liked ? "#000" : "transparent"}
            stroke={liked ? "#000" : "white"}
          />
        </button>

        {/* Bottom overlay — price info on image */}
        <div className="absolute bottom-0 left-0 right-0 p-2.5">
          <p className="text-white font-semibold leading-tight line-clamp-1 mb-1" style={{ fontSize: "12px" }}>
            {product.name}
          </p>
          <div className="flex items-center gap-2">
            <span className="font-black" style={{ color: "#C9A84C", fontSize: "14px" }}>
              {formatHTG(product.price)} <span style={{ fontSize: "9px", fontWeight: 500 }}>HTG</span>
            </span>
            <span
              className="text-gray-400 line-through"
              style={{ fontSize: "10px" }}
            >
              {formatHTG(product.originalPrice)}
            </span>
            <span
              className="ml-auto text-xs font-bold px-1.5 py-0.5 rounded"
              style={{ background: "rgba(229,57,53,0.85)", color: "#fff", fontSize: "9px" }}
            >
              -{product.discount}%
            </span>
          </div>

          {/* Hover — quick shop button */}
          <div
            className="overflow-hidden transition-all duration-300"
            style={{ maxHeight: hovered ? "36px" : "0px", opacity: hovered ? 1 : 0 }}
          >
            <button
              className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-semibold mt-2"
              style={{ background: "#C9A84C", color: "#000", fontSize: "11px" }}
            >
              <ShoppingBag size={11} />
              Acheter maintenant
            </button>
          </div>
        </div>
      </div>

      {/* Footer — minimal category only */}
      <div className="px-2.5 py-1.5 flex items-center justify-between">
        <span style={{ fontSize: "9px", color: "#555", textTransform: "uppercase", letterSpacing: "0.8px" }}>
          {product.category}
        </span>
        <div className="flex items-center gap-0.5">
          <Heart size={8} fill="#C9A84C" stroke="#C9A84C" />
          <span style={{ fontSize: "9px", color: "#555" }}>{(product.likes / 1000).toFixed(1)}k</span>
        </div>
      </div>
    </div>
  );
}

export function SheinStyle() {
  return (
    <div
      className="min-h-screen p-4 flex flex-col gap-3"
      style={{ background: "#0A0A0A", fontFamily: "Inter, sans-serif" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between py-1">
        <div>
          <h2
            className="font-bold"
            style={{ color: "#fff", fontSize: "18px", fontFamily: "Playfair Display, serif" }}
          >
            Tendances
          </h2>
          <p style={{ color: "#555", fontSize: "10px" }}>Collection exclusive Black Store</p>
        </div>
        <span style={{ color: "#C9A84C", fontSize: "11px", fontWeight: 600 }}>Tout voir →</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {products.map((p) => (
          <Card key={p.id} product={p} />
        ))}
      </div>

      <div className="text-center mt-1" style={{ color: "#333", fontSize: "10px" }}>
        Style Shein · Portrait ultra · Prix sur image · Brand Gold
      </div>
    </div>
  );
}
