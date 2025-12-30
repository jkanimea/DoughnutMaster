export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12 px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-lg font-serif font-bold mb-4">DonutMaster Pro</h3>
            <p className="text-sm text-muted-foreground">
              Premium bakery management system delivering fresh happiness daily.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>All Products</li>
              <li>Donuts</li>
              <li>Pastries</li>
              <li>Catering</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>About Us</li>
              <li>Careers</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>hello@donutmaster.com</li>
              <li>0800 DONUTS</li>
              <li>123 Bakery Lane, Auckland</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          © 2024 DonutMaster Pro. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
