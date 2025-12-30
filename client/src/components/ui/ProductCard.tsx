import { Product } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, checkAvailability, selectedOrderDate } = useStore();
  const [quantity, setQuantity] = useState(1);

  const increment = () => setQuantity(q => q + 1);
  const decrement = () => setQuantity(q => Math.max(1, q - 1));

  const isAvailable = checkAvailability(product.category);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`group relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md ${!isAvailable ? 'opacity-60 grayscale' : ''}`}
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-muted relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {!isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
            <span className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full font-bold text-sm transform -rotate-12">
              UNAVAILABLE
            </span>
          </div>
        )}
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
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-none" onClick={decrement} disabled={quantity <= 1 || !isAvailable}>
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm font-medium">{quantity}</span>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-none" onClick={increment} disabled={!isAvailable}>
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <Button 
            className="flex-1" 
            onClick={() => {
              addToCart(product, quantity);
              setQuantity(1);
            }}
            disabled={!isAvailable}
            data-testid={`add-to-cart-${product.id}`}
          >
            {isAvailable ? 'Add to Cart' : 'Unavailable'}
          </Button>
        </div>
        {!selectedOrderDate && isAvailable && (
           <p className="text-xs text-muted-foreground mt-2 text-center italic">Select a date to check specific availability</p>
        )}
      </div>
    </motion.div>
  );
}
