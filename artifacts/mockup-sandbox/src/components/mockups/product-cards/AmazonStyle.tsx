import { useState } from "react";
import { Heart, ShoppingCart, Star, Truck, ShieldCheck } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Sac à main en cuir véritable Italian premium",
    category: "Sacs",
    price: 28500,
    originalPrice: 47500,
    discount: 40,
    rating: 4.6,
    reviews: 234,
    stock: 7,
    delivery: "Livraison rapide",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop&auto=format",
  },
  {
    id: 2,
    name: "Montre homme luxe acier brossé",
    category: "Montres",
    price: 65000,
    originalPrice: 95000,
    discount: 32,
    rating: 4.8,
    reviews: 891,
    stock: 3,
    delivery: "Livraison rapide",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&auto=format",
  },
  {
    id: 3,
    name: "Parfum Oud Royal Intense 50ml",
    category: "Parfums",
    price: 42000,
    originalPrice: 60000,
    discount: 30,
    rating: 4.7,
    reviews: 412,
    stock: 15,
    delivery: "Standard 3-5j",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&h=400&fit=crop&auto=format",
  },
  {
    id: 4,
    name: "Lunettes soleil polarisées UV400",
    category: "Accessoires",
    price: 12500,
    originalPrice: 20000,
    discount: 38,
    rating: 4.4,
    reviews: 1820,
    stock: 22,
    delivery: "Livraison rapide",
    image: "https://images.unsplash.com/photo-1473496169904-658ba7574b0d?w=400&h=400&fit=crop&auto=format",
  },
];

function formatHTG(price: number) {
  return price.toLocaleString("fr-HT") + " HTG";
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={11}
            fill={star <= Math.floor(rating) ? "#C9A84C" : star - 0.5 <= rating ? "#E2C97E" : "transparent"}
            stroke={star <= rating ? "#C9A84C" : "#ccc"}
          />
        ))}
      </div>
      <span style={{ color: "#C9A84C", fontSize: "11px", fontWeight: 500 }}>
        {rating}
      </span>
      <span style={{ color: "#888", fontSize: "10px" }}>({count})</span>
    </div>
  );
}

function Card({ product }: { product: typeof products[0] }) {
  const [liked, setLiked] = useState(false);

  return (
    <div
      className="flex flex-col rounded-lg overflow-hidden"
      style={{ background: "#fff", border: "1px solid #E8E5DE", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}
    >
      {/* Image - square */}
      <div className="relative bg-gray-50" style={{ aspectRatio: "1/1" }}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {/* Discount top-left */}
        <div
          className="absolute top-2 left-2 text-white text-xs font-bold px-2 py-0.5 rounded"
          style={{ background: "#E53935", fontSize: "10px" }}
        >
          -{product.discount}%
        </div>
        {/* Wishlist */}
        <button
          onClick={() => setLiked(!liked)}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm"
        >
          <Heart
            size={14}
            fill={liked ? "#E53935" : "transparent"}
            stroke={liked ? "#E53935" : "#999"}
          />
        </button>
        {/* Low stock warning */}
        {product.stock <= 10 && (
          <div
            className="absolute bottom-2 left-2 text-xs font-semibold px-2 py-0.5 rounded"
            style={{ background: "#FFF3CD", color: "#856404", fontSize: "9px" }}
          >
            Plus que {product.stock} en stock
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-2.5 flex flex-col gap-1.5">
        <p style={{ fontSize: "9px", color: "#888", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          {product.category}
        </p>
        <p className="font-medium leading-snug line-clamp-2" style={{ fontSize: "12px", color: "#111", lineHeight: "1.3" }}>
          {product.name}
        </p>

        <StarRating rating={product.rating} count={product.reviews} />

        {/* Prices */}
        <div className="flex items-baseline gap-2">
          <span className="font-black" style={{ fontSize: "15px", color: "#E53935" }}>
            {formatHTG(product.price)}
          </span>
          <span className="text-gray-400 line-through" style={{ fontSize: "10px" }}>
            {formatHTG(product.originalPrice)}
          </span>
        </div>

        {/* Delivery */}
        <div className="flex items-center gap-1">
          <Truck size={10} color="#2E7D32" />
          <span style={{ fontSize: "10px", color: "#2E7D32", fontWeight: 500 }}>
            {product.delivery}
          </span>
        </div>

        {/* Add to cart */}
        <button
          className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-semibold transition-all mt-0.5"
          style={{ background: "linear-gradient(135deg, #E2C97E, #C9A84C)", color: "#000", fontSize: "11px" }}
        >
          <ShoppingCart size={12} />
          Ajouter au panier
        </button>
      </div>
    </div>
  );
}

export function AmazonStyle() {
  return (
    <div className="min-h-screen p-5 flex flex-col gap-4" style={{ background: "#F5F4F0", fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center gap-2 mb-1">
        <ShieldCheck size={16} color="#2E7D32" />
        <span style={{ color: "#2E7D32", fontSize: "12px", fontWeight: 600 }}>Produits vérifiés · Livraison rapide</span>
      </div>
      <h2 className="font-bold text-lg" style={{ color: "#111", marginBottom: "-4px" }}>Meilleures ventes</h2>
      <div className="grid grid-cols-2 gap-3">
        {products.map((p) => (
          <Card key={p.id} product={p} />
        ))}
      </div>
      <div className="text-center mt-2" style={{ color: "#999", fontSize: "10px" }}>
        Style Amazon · Informations denses · Carré
      </div>
    </div>
  );
}
