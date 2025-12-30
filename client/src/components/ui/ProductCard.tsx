import { Product } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useStore();
  const [quantity, setQuantity] = useState(1);

  const increment = () => setQuantity(q => q + 1);
  const decrement = () => setQuantity(q => Math.max(1, q - 1));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md"
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
        <img 
          src={product.image} 
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
            {product.category}
          </span>
          <span className="font-bold text-lg text-primary">${product.price.toFixed(2)}</span>
        </div>
        <h3 className="font-serif text-xl font-bold leading-tight mb-2">{product.name}</h3>
        <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-md border bg-background">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-none" onClick={decrement} disabled={quantity <= 1}>
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm font-medium">{quantity}</span>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-none" onClick={increment}>
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <Button 
            className="flex-1" 
            onClick={() => {
              addToCart(product, quantity);
              setQuantity(1);
            }}
            data-testid={`add-to-cart-${product.id}`}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
