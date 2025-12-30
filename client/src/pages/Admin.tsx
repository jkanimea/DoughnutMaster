import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOCK_ADMIN_STATS } from "@/lib/mock-data";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import { DollarSign, ShoppingBag, TrendingUp, Users } from "lucide-react";

const salesData = [
  { name: "Mon", total: 1200 },
  { name: "Tue", total: 1800 },
  { name: "Wed", total: 2200 },
  { name: "Thu", total: 1600 },
  { name: "Fri", total: 3200 },
  { name: "Sat", total: 4500 },
  { name: "Sun", total: 1100 },
];

const paymentData = [
  { name: "Stripe", value: 65, color: "hsl(32 90% 55%)" },
  { name: "Bank Transfer", value: 25, color: "hsl(340 70% 60%)" },
  { name: "Pay Later", value: 10, color: "hsl(200 60% 55%)" },
];

export default function Admin() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container flex-1 py-10 px-4 md:px-6">
        <div className="mb-8 flex items-center justify-between">
           <h1 className="text-3xl font-serif font-bold">Admin Dashboard</h1>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
           <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                 <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                 <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                 <div className="text-2xl font-bold">${MOCK_ADMIN_STATS.revenue.toLocaleString()}</div>
                 <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
           </Card>
           <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                 <CardTitle className="text-sm font-medium">Orders</CardTitle>
                 <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                 <div className="text-2xl font-bold">+{MOCK_ADMIN_STATS.orders}</div>
                 <p className="text-xs text-muted-foreground">+180.1% from last month</p>
              </CardContent>
           </Card>
           <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                 <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                 <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                 <div className="text-2xl font-bold">${MOCK_ADMIN_STATS.profit.toLocaleString()}</div>
                 <p className="text-xs text-muted-foreground">+19% from last month</p>
              </CardContent>
           </Card>
           <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                 <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                 <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                 <div className="text-2xl font-bold">+573</div>
                 <p className="text-xs text-muted-foreground">+201 since last hour</p>
              </CardContent>
           </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
           {/* Chart */}
           <Card className="col-span-4">
              <CardHeader>
                 <CardTitle>Weekly Sales</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                 <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={salesData}>
                          <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                          <Tooltip 
                            cursor={{ fill: 'transparent' }} 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                          />
                          <Bar dataKey="total" fill="hsl(32 90% 55%)" radius={[4, 4, 0, 0]} />
                       </BarChart>
                    </ResponsiveContainer>
                 </div>
              </CardContent>
           </Card>
           
           {/* Recent Sales */}
           <Card className="col-span-3">
              <CardHeader>
                 <CardTitle>Recent Orders</CardTitle>
                 <CardDescription>Latest transactions from the store.</CardDescription>
              </CardHeader>
              <CardContent>
                 <div className="space-y-8">
                    {MOCK_ADMIN_STATS.recentOrders.map(order => (
                       <div key={order.id} className="flex items-center">
                          <div className="space-y-1">
                             <p className="text-sm font-medium leading-none">{order.customer}</p>
                             <p className="text-xs text-muted-foreground">{order.id} • {order.status}</p>
                          </div>
                          <div className="ml-auto font-medium">+${order.total.toFixed(2)}</div>
                       </div>
                    ))}
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
