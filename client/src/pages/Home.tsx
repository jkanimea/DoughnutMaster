import { PRODUCTS } from "@/lib/mock-data";
import { ProductCard } from "@/components/ui/ProductCard";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarIcon } from "lucide-react";
import heroImage from "@assets/generated_images/hero_image_of_delicious_glazed_donuts.png";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

export default function Home() {
  const { selectedOrderDate, setSelectedOrderDate } = useStore();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary/5 pb-20 pt-10 lg:pt-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-serif text-primary-foreground">
                Fresh <span className="text-primary">Donuts</span><br/> 
                Made Daily.
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Premium handcrafted donuts, cinnamon buns, and pastries delivered straight to your door or ready for pickup.
              </p>
              
              <div className="rounded-lg border bg-card p-4 shadow-sm max-w-md">
                 <p className="text-sm font-medium mb-2">Check availability for your date:</p>
                 <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={`w-full justify-start text-left font-normal ${!selectedOrderDate && "text-muted-foreground"}`}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedOrderDate ? format(selectedOrderDate, "PPP") : <span>Select Order Date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedOrderDate}
                      onSelect={setSelectedOrderDate}
                      initialFocus
                      disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" className="h-12 px-8 text-base" onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}>
                  Order Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                  View Menu
                </Button>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative mx-auto w-full max-w-[500px] lg:max-w-none"
            >
              <div className="aspect-square overflow-hidden rounded-full border-8 border-background shadow-2xl">
                <img 
                  src={heroImage} 
                  alt="Delicious Donuts" 
                  className="h-full w-full object-cover scale-110 hover:scale-105 transition-transform duration-700"
                />
              </div>
              
              {/* Floating Badge */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute -bottom-6 -left-6 rounded-xl bg-card p-4 shadow-xl border"
              >
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="h-8 w-8 rounded-full bg-muted border-2 border-background" /> 
                    ))}
                  </div>
                  <div className="text-sm">
                    <p className="font-bold">1k+ Happy Customers</p>
                    <div className="flex text-primary text-xs">★★★★★</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section id="products" className="py-20">
        <div className="container px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-serif">Our Signature Treats</h2>
            <p className="mt-4 text-muted-foreground md:text-lg">Hand-rolled, fresh-fried, and glazed to perfection.</p>
            {selectedOrderDate && (
                <div className="mt-4 inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
                    Showing availability for: {format(selectedOrderDate, "PPP")}
                </div>
            )}
          </div>
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Features / Info */}
      <section className="bg-secondary/50 py-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-xl bg-background p-8 shadow-sm text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="mb-2 text-xl font-bold">Fresh Daily</h3>
              <p className="text-muted-foreground">We bake every single morning. No leftovers, ever.</p>
            </div>
            <div className="rounded-xl bg-background p-8 shadow-sm text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
              </div>
              <h3 className="mb-2 text-xl font-bold">Secure Payment</h3>
              <p className="text-muted-foreground">Pay safely with Card or direct Bank Transfer.</p>
            </div>
            <div className="rounded-xl bg-background p-8 shadow-sm text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="mb-2 text-xl font-bold">Easy Ordering</h3>
              <p className="text-muted-foreground">Order online and schedule your pickup or delivery.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
