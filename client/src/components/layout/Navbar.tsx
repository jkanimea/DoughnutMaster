import { Link, useLocation } from "wouter";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { ShoppingBag, User, Menu, LogIn } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { useState } from "react";

export function Navbar() {
  const { cart, isCartOpen, setIsCartOpen, user, login, logout } = useStore();
  const [location] = useLocation();
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-serif text-2xl font-bold tracking-tight text-primary">DonutMaster</span>
          <span className="hidden rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground sm:inline-block">PRO</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className={`text-sm font-medium transition-colors hover:text-primary ${location === '/' ? 'text-primary' : 'text-muted-foreground'}`}>
            Store
          </Link>
          <Link href="/about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Our Story
          </Link>
          {user?.role === 'customer' && (
            <Link href="/dashboard" className={`text-sm font-medium transition-colors hover:text-primary ${location === '/dashboard' ? 'text-primary' : 'text-muted-foreground'}`}>
              Dashboard
            </Link>
          )}
          {user?.role === 'admin' && (
             <Link href="/admin" className={`text-sm font-medium transition-colors hover:text-primary ${location === '/admin' ? 'text-primary' : 'text-muted-foreground'}`}>
               Admin Dashboard
             </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="hidden md:flex items-center gap-4">
               <span className="text-sm font-medium">Hi, {user.name.split(' ')[0]}</span>
               <Button variant="ghost" size="sm" onClick={logout}>Logout</Button>
            </div>
          ) : (
            <div className="hidden md:flex gap-2">
               <Button variant="ghost" size="sm" onClick={() => login(false)}>
                 <LogIn className="h-4 w-4 mr-2" /> Login
               </Button>
               <Button variant="outline" size="sm" onClick={() => login(true)}>
                 Admin Login
               </Button>
            </div>
          )}

          <Button 
            variant="outline" 
            size="icon" 
            className="relative" 
            onClick={() => setIsCartOpen(true)}
            data-testid="button-cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartItemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {cartItemCount}
              </span>
            )}
          </Button>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col gap-4 py-4">
                <Link href="/" className="text-lg font-medium">Store</Link>
                {user?.role === 'customer' && <Link href="/dashboard" className="text-lg font-medium">Dashboard</Link>}
                {user?.role === 'admin' && <Link href="/admin" className="text-lg font-medium">Admin Dashboard</Link>}
                {user ? (
                   <Button onClick={logout} variant="secondary">Logout</Button>
                ) : (
                   <div className="flex flex-col gap-2">
                      <Button onClick={() => login(false)}>Login as Customer</Button>
                      <Button variant="outline" onClick={() => login(true)}>Login as Admin</Button>
                   </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      <CartDrawer open={isCartOpen} onOpenChange={setIsCartOpen} />
    </nav>
  );
}
