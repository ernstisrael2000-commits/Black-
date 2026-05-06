import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: number;
  showValue?: boolean;
  count?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

export default function StarRating({
  rating,
  max = 5,
  size = 16,
  showValue = false,
  count,
  interactive = false,
  onRate,
}: StarRatingProps) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <button
          key={i}
          onClick={() => interactive && onRate && onRate(i + 1)}
          className={interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}
          data-testid={`star-${i + 1}`}
        >
          <Star
            size={size}
            fill={i < Math.round(rating) ? '#C9A84C' : 'transparent'}
            color={i < Math.round(rating) ? '#C9A84C' : '#444'}
            strokeWidth={1.5}
          />
        </button>
      ))}
      {showValue && (
        <span className="text-sm text-gray-400 ml-1">
          {rating.toFixed(1)}{count !== undefined && ` (${count})`}
        </span>
      )}
    </div>
  );
}
