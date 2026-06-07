import { useState } from "react";
import { Heart, ShoppingCart, Star, Zap } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Sac à main en cuir véritable",
    category: "Sacs & Maroquinerie",
    price: 28500,
    originalPrice: 47500,
    discount: 40,
    rating: 4.6,
    sold: 1240,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=533&fit=crop&auto=format",
  },
  {
    id: 2,
    name: "Montre homme luxe acier",
    category: "Montres",
    price: 65000,
    originalPrice: 95000,
    discount: 32,
    rating: 4.8,
    sold: 863,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=533&fit=crop&auto=format",
  },
  {
    id: 3,
    name: "Parfum Oud Royal 50ml",
    category: "Parfumerie",
    price: 42000,
    originalPrice: 60000,
    discount: 30,
    rating: 4.7,
    sold: 2100,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&h=533&fit=crop&auto=format",
  },
  {
    id: 4,
    name: "Lunettes de soleil polarisées",
    category: "Accessoires",
    price: 12500,
    originalPrice: 20000,
    discount: 38,
    rating: 4.4,
    sold: 3450,
    image: "https://images.unsplash.com/photo-1473496169904-658ba7574b0d?w=400&h=533&fit=crop&auto=format",
  },
];

function formatHTG(price: number) {
  return price.toLocaleString("fr-HT") + " HTG";
}

function Card({ product }: { product: typeof products[0] }) {
  const [liked, setLiked] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative flex flex-col rounded-xl overflow-hidden cursor-pointer"
      style={{ background: "#161616", border: "1px solid #222" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image zone */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500"
          style={{ transform: hovered ? "scale(1.06)" : "scale(1)" }}
        />

        {/* Discount badge top-left */}
        <div
          className="absolute top-2 left-2 text-white text-xs font-black px-2 py-0.5 rounded-md"
          style={{ background: "#E53935", fontSize: "11px", letterSpacing: "0.5px" }}
        >
          -{product.discount}%
        </div>

        {/* Wishlist top-right */}
        <button
          onClick={() => setLiked(!liked)}
          className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all"
          style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
        >
          <Heart
            size={14}
            fill={liked ? "#E53935" : "transparent"}
            stroke={liked ? "#E53935" : "white"}
          />
        </button>

        {/* Sold count overlay bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 flex items-center gap-1 px-2 py-1.5"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75), transparent)" }}
        >
          <Zap size={10} fill="#FFB300" stroke="#FFB300" />
          <span className="text-white font-semibold" style={{ fontSize: "10px" }}>
            {product.sold.toLocaleString()}+ vendus
          </span>
        </div>

        {/* Hover buy overlay */}
        <div
          className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-1.5 py-2 transition-all duration-300"
          style={{
            background: "linear-gradient(135deg, #C9A84C, #9E7B2F)",
            transform: hovered ? "translateY(0)" : "translateY(100%)",
          }}
        >
          <ShoppingCart size={13} color="#000" />
          <span className="text-black font-bold" style={{ fontSize: "11px" }}>
            Ajouter au panier
          </span>
        </div>
      </div>

      {/* Info section — ultra compact */}
      <div className="px-2 py-2 flex flex-col gap-0.5">
        <p className="text-gray-400 truncate" style={{ fontSize: "9px", letterSpacing: "0.5px", textTransform: "uppercase" }}>
          {product.category}
        </p>
        <p className="text-white font-medium leading-snug line-clamp-1" style={{ fontSize: "12px" }}>
          {product.name}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <Star size={9} fill="#C9A84C" stroke="#C9A84C" />
          <span style={{ fontSize: "10px", color: "#A0A0A0" }}>{product.rating}</span>
        </div>

        {/* Price row */}
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className="font-black text-white" style={{ fontSize: "14px", lineHeight: 1 }}>
            {formatHTG(product.price)}
          </span>
          <span className="text-gray-500 line-through" style={{ fontSize: "10px" }}>
            {formatHTG(product.originalPrice)}
          </span>
        </div>
      </div>
    </div>
  );
}

export function TemuStyle() {
  return (
    <div className="min-h-screen p-6 flex flex-col gap-4" style={{ background: "#0A0A0A", fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-white font-bold text-lg">Nouveautés</h2>
        <span style={{ color: "#C9A84C", fontSize: "12px", fontWeight: 600 }}>Voir tout →</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {products.map((p) => (
          <Card key={p.id} product={p} />
        ))}
      </div>
      <div className="text-center mt-2" style={{ color: "#555", fontSize: "10px" }}>
        Style Temu · Prix dominant · Compact portrait
      </div>
    </div>
  );
}
