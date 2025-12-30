import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { CalendarIcon, CreditCard, Landmark, Clock, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function Checkout() {
  const { cart, cartTotal, clearCart, user } = useStore();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [date, setDate] = useState<Date>();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);

  // Disable Fridays (5) and Saturdays (6)
  const isDateDisabled = (date: Date) => {
    const day = date.getDay();
    return day === 5 || day === 6 || date < new Date();
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      toast({ title: "Date Required", description: "Please select a delivery/pickup date.", variant: "destructive" });
      return;
    }
    
    setIsProcessing(true);
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    clearCart();
    toast({ 
      title: "Order Confirmed!", 
      description: `Your order for ${format(date, "PPP")} has been placed.` 
    });
    setLocation("/dashboard");
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <h1 className="text-3xl font-serif font-bold mb-4">Your cart is empty</h1>
          <Button onClick={() => setLocation("/")}>Go to Store</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="container flex-1 py-10 px-4 md:px-6">
        <h1 className="text-3xl font-serif font-bold mb-8">Checkout</h1>
        
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. Date Selection */}
            <Card>
              <CardHeader>
                <CardTitle>1. Choose Date</CardTitle>
                <CardDescription>We are closed Fridays & Saturdays.</CardDescription>
              </CardHeader>
              <CardContent>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={`w-full justify-start text-left font-normal ${!date && "text-muted-foreground"}`}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={isDateDisabled}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </CardContent>
            </Card>

            {/* 2. Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>2. Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="Jane" defaultValue={user?.name.split(' ')[0]} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" defaultValue={user?.name.split(' ')[1]} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="jane@example.com" defaultValue={user?.email} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" placeholder="021 123 4567" />
                </div>
              </CardContent>
            </Card>

            {/* 3. Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>3. Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <RadioGroupItem value="card" id="card" className="peer sr-only" />
                    <Label
                      htmlFor="card"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer h-full"
                    >
                      <CreditCard className="mb-3 h-6 w-6" />
                      Credit Card
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="bank" id="bank" className="peer sr-only" />
                    <Label
                      htmlFor="bank"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer h-full"
                    >
                      <Landmark className="mb-3 h-6 w-6" />
                      Bank Transfer
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="credit" id="credit" className="peer sr-only" />
                    <Label
                      htmlFor="credit"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer h-full"
                    >
                      <Clock className="mb-3 h-6 w-6" />
                      Pay Later
                    </Label>
                  </div>
                </RadioGroup>

                <div className="mt-6">
                  {paymentMethod === 'card' && (
                    <div className="space-y-4 rounded-md border p-4 bg-muted/20">
                      <div className="space-y-2">
                         <Label>Card Number</Label>
                         <div className="relative">
                            <Input placeholder="0000 0000 0000 0000" />
                            <CreditCard className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Expiry</Label>
                          <Input placeholder="MM/YY" />
                        </div>
                        <div className="space-y-2">
                          <Label>CVC</Label>
                          <Input placeholder="123" />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                         <div className="h-4 w-4 rounded border border-primary bg-primary text-primary-foreground flex items-center justify-center">
                            <CheckCircle2 className="h-3 w-3" />
                         </div>
                         <Label className="font-normal text-muted-foreground">Save card for future purchases</Label>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'bank' && (
                    <div className="space-y-4 rounded-md border p-4 bg-muted/20">
                      <p className="text-sm text-muted-foreground">
                        Please transfer the total amount to the following account using your Order ID as reference.
                      </p>
                      <div className="grid gap-2 text-sm font-medium">
                        <div className="flex justify-between"><span>Account Name:</span> <span>DonutMaster Pro</span></div>
                        <div className="flex justify-between"><span>Bank:</span> <span>ANZ New Zealand</span></div>
                        <div className="flex justify-between"><span>Account Number:</span> <span className="font-mono">06-0000-0000000-00</span></div>
                      </div>
                      <div className="rounded bg-yellow-100 p-3 text-sm text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200">
                        Your order will be processed once payment is confirmed by our admin.
                      </div>
                    </div>
                  )}

                   {paymentMethod === 'credit' && (
                    <div className="space-y-4 rounded-md border p-4 bg-muted/20">
                      <p className="text-sm text-muted-foreground">
                        Request to pay later. Subject to approval.
                      </p>
                       <div className="space-y-2">
                          <Label>Reason for credit request</Label>
                          <Input placeholder="e.g. Corporate Event, Regular Customer" />
                        </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-start justify-between p-4">
                        <div className="grid gap-1">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-sm text-muted-foreground">{item.quantity} x ${item.price.toFixed(2)}</span>
                        </div>
                        <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 space-y-2 bg-muted/50">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Delivery</span>
                      <span>$0.00</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex items-center justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4">
                  <Button className="w-full h-12 text-lg" onClick={handlePlaceOrder} disabled={isProcessing}>
                    {isProcessing ? "Processing..." : `Pay $${cartTotal.toFixed(2)}`}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
