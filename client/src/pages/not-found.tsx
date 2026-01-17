import { Link } from "wouter";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#222222] flex items-center justify-center px-4 pt-20">
      <div className="text-center">
        <h1 className="text-8xl font-black text-[#f36e27] mb-4">404</h1>
        <h2 className="text-3xl font-bold text-[#f5e6c7] mb-4">Page Not Found</h2>
        <p className="text-[#606161] mb-8 max-w-md mx-auto">
          Looks like you've wandered off the menu. Let's get you back to something delicious.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button
              data-testid="go-home"
              className="bg-[#f36e27] hover:bg-[#e05d1a] px-6"
            >
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Button>
          </Link>
          <Link href="/menu">
            <Button
              variant="outline"
              data-testid="view-menu"
              className="border-[#f5e6c7] text-[#f5e6c7] hover:bg-[#f5e6c7] hover:text-[#222222] px-6"
            >
              View Menu
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
