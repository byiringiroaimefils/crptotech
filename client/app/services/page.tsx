import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Wrench, 
  Shield, 
  Truck, 
  RefreshCw, 
  Headphones, 
  Package,
  Camera,
  Video,
  Edit,
  Printer,
  Globe,
  Bitcoin,
  GraduationCap,
  Briefcase
} from "lucide-react"
import Link from "next/link"

export default function ServicesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight mb-6 text-balance md:text-5xl">Our Services</h1>
              <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
                We offer comprehensive services to meet all your technology and creative needs. From product support to professional training and creative services, we've got you covered.
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Original Services */}
              <Card>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <Truck className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>E-commerce and Fast Shipping</CardTitle>
                  <CardDescription>Get your products delivered quickly and safely</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Buy electronic Devices online</li>
                    <li>• Free shipping on orders over $100</li>
                    <li>• Standard delivery: 5-7 business days</li>
                    <li>• Express delivery: 2-3 business days</li>
                    <li>• Real-time tracking for all orders</li>
                    <li>• Secure packaging to prevent damage</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Government Services</CardTitle>
                  <CardDescription>We offer basic government services</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• RRA Tax Payment</li>
                    <li>• Rura services</li>
                    <li>• Building Design</li>
                    <li>• Construction Permit</li>
                    <li>• Building supervision</li>
                    <li>• Building Renovation Permit</li>
                  </ul>
                </CardContent>
              </Card>


              {/* New Services */}
              <Card>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Internship and digital skills</CardTitle>
                  <CardDescription>Hands-on training and real-world experience 1-3 month internship programs</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Software Development Internship</li>
                    <li>• Networking Internship</li>
                    <li>• Digital literacy training</li>
                    <li>• Multimedia production</li>
                    <li>• Graphic design training</li>
                    <li>• Mentorship from experienced developers</li>
                    <li>• Real project experience</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Networking Services</CardTitle>
                  <CardDescription>Professional network setup and support</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Network installation and configuration</li>
                    <li>• Wireless network setup</li>
                    <li>• Security and firewall implementation</li>
                    <li>• Network troubleshooting</li>
                    <li>• Business network solutions</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <Camera className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Photography Services</CardTitle>
                  <CardDescription>Professional photography for all occasions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Portrait and studio photography</li>
                    <li>• Event and wedding photography</li>
                    <li>• Commercial product photography</li>
                    <li>• Outdoor and landscape sessions</li>
                    <li>• Professional equipment available</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <Video className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Videography Services</CardTitle>
                  <CardDescription>High-quality video production and editing</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Wedding videography</li>
                    <li>• Graduation video production</li>
                    <li>• Event videography</li>
                    <li>• Commercial and promotional videos</li>
                    <li>• Anniversary video production</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <Edit className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Photo & Video Editing</CardTitle>
                  <CardDescription>Professional post-production services</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Photo retouching and enhancement</li>
                    <li>• Video color grading and correction</li>
                    <li>• Special effects and animations</li>
                    <li>• Audio mixing and synchronization</li>
                    <li>• Quick turnaround times</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <Printer className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Printing & Scanning Services</CardTitle>
                  <CardDescription>High-quality printing solutions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Document printing and Scanning</li>
                    <li>• Photo printing on various media</li>
                    <li>• Large format printing</li>
                    <li>• Business card and brochure printing</li>
                    <li>• Same-day service available</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Irembo Services</CardTitle>
                  <CardDescription>Government service facilitation</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Document processing assistance</li>
                    <li>• Government form submissions</li>
                    <li>• Online service registration</li>
                    <li>• Payment processing support</li>
                    <li>• Application status tracking</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <Bitcoin className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Cryptocurrency Training</CardTitle>
                  <CardDescription>Comprehensive crypto education</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Blockchain technology fundamentals</li>
                    <li>• Trading strategies and analysis</li>
                    <li>• Wallet setup and security</li>
                    <li>• Investment risk management</li>
                    <li>• Market trend analysis</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Original Technical Services */}
              <Card>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <Wrench className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Technical Support</CardTitle>
                  <CardDescription>Expert help when you need it</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Computer maintenance and installation</li>
                    <li>• Setup and installation guidance</li>
                    <li>• Troubleshooting assistance</li>
                    <li>• Product recommendations</li>
                    <li>• Software and firmware updates</li>
                    <li>• Remote support available</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Product Setup</CardTitle>
                  <CardDescription>Get started with ease</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Detailed setup guides included</li>
                    <li>• Video tutorials available</li>
                    <li>• Phone support for setup</li>
                    <li>• Data transfer assistance</li>
                    <li>• Configuration recommendations</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold mb-4">Need Help?</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Our team is ready to assist you with any questions or concerns about our wide range of services.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button size="lg" asChild>
                  <Link href="/contact">Contact Us</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/products">Browse Products</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}