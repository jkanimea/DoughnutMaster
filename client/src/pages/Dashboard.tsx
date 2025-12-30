import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { CreditCard, Package, User as UserIcon } from "lucide-react";

export default function Dashboard() {
  const { user, login } = useStore();
  const [, setLocation] = useLocation();

  if (!user) {
     return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
           <h1 className="text-2xl font-bold">Please Login to view Dashboard</h1>
           <Button onClick={login}>Login Mock User</Button>
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container flex-1 py-10 px-4 md:px-6">
         <div className="flex items-center justify-between mb-8">
            <div>
               <h1 className="text-3xl font-serif font-bold">Welcome, {user.name}</h1>
               <p className="text-muted-foreground">Manage your orders and account settings.</p>
            </div>
         </div>

         <Tabs defaultValue="orders" className="space-y-8">
            <TabsList>
               <TabsTrigger value="orders">Orders</TabsTrigger>
               <TabsTrigger value="payment">Payment Methods</TabsTrigger>
               <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>
            
            <TabsContent value="orders">
               <Card>
                  <CardHeader>
                     <CardTitle>Order History</CardTitle>
                     <CardDescription>View your recent purchases.</CardDescription>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-4">
                        {user.orders.map(order => (
                           <div key={order.id} className="flex items-center justify-between rounded-lg border p-4">
                              <div className="space-y-1">
                                 <div className="flex items-center gap-2">
                                    <span className="font-bold">{order.id}</span>
                                    <Badge variant={order.status === 'delivered' ? 'secondary' : 'default'}>
                                       {order.status}
                                    </Badge>
                                 </div>
                                 <p className="text-sm text-muted-foreground">{order.items}</p>
                                 <p className="text-xs text-muted-foreground">{order.date}</p>
                              </div>
                              <div className="text-right">
                                 <p className="font-bold">${order.total.toFixed(2)}</p>
                                 <Button variant="ghost" size="sm" className="h-8">View Receipt</Button>
                              </div>
                           </div>
                        ))}
                     </div>
                  </CardContent>
               </Card>
            </TabsContent>

            <TabsContent value="payment">
               <Card>
                  <CardHeader>
                     <CardTitle>Saved Cards</CardTitle>
                     <CardDescription>Manage your saved payment methods securely via Stripe.</CardDescription>
                  </CardHeader>
                  <CardContent>
                     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {user.savedCards.map(card => (
                           <div key={card.id} className="relative rounded-xl border bg-card p-6 shadow-sm">
                              <div className="mb-4 flex items-center justify-between">
                                 <CreditCard className="h-6 w-6 text-primary" />
                                 <Button variant="ghost" size="icon" className="h-6 w-6"><span className="sr-only">Delete</span>×</Button>
                              </div>
                              <div className="mb-1 text-2xl font-mono">•••• •••• •••• {card.last4}</div>
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                 <span className="uppercase">{card.brand}</span>
                                 <span>EXP {card.expMonth}/{card.expYear}</span>
                              </div>
                           </div>
                        ))}
                        <div className="flex h-[140px] flex-col items-center justify-center rounded-xl border border-dashed bg-muted/50 hover:bg-muted/80 cursor-pointer transition-colors">
                           <div className="h-8 w-8 rounded-full bg-background border flex items-center justify-center mb-2">
                              <span className="text-xl">+</span>
                           </div>
                           <span className="text-sm font-medium">Add New Card</span>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </TabsContent>

             <TabsContent value="profile">
               <Card>
                  <CardHeader>
                     <CardTitle>Profile Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="grid gap-2">
                        <Label>Full Name</Label>
                        <Input defaultValue={user.name} />
                     </div>
                     <div className="grid gap-2">
                        <Label>Email</Label>
                        <Input defaultValue={user.email} disabled />
                     </div>
                     <Button>Save Changes</Button>
                  </CardContent>
               </Card>
            </TabsContent>
         </Tabs>
      </div>
    </div>
  );
}
