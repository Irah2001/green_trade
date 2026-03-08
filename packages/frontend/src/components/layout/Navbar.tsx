'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  ShoppingCart,
  User as UserIcon,
  Menu,
  Leaf,
  Apple,
  Carrot,
  ShoppingBasket,
  Plus,
  LogOut,
  Settings,
  LayoutDashboard,
} from 'lucide-react';

const categories = [
  { id: 'fruits', label: 'Fruits', icon: Apple },
  { id: 'vegetables', label: 'Légumes', icon: Carrot },
  { id: 'baskets', label: 'Paniers', icon: ShoppingBasket },
];

export default function Navbar() {
  const router = useRouter();
  const { cart, getCartCount, user, isAuthenticated, logout, searchProducts, setCurrentPage } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const cartCount = getCartCount();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchProducts(searchQuery);
      setCurrentPage('products');
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    useAppStore.getState().filterByCategory(categoryId);
    setCurrentPage('products');
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center gap-2 text-[#4A7C59] hover:text-[#3a6349] transition-colors"
              onClick={() => setCurrentPage('home')}
            >
              <Leaf className="h-8 w-8" />
              <span className="text-xl font-bold">Green Trade</span>
            </Link>

            {/* Search Bar - Hidden on mobile */}
            <form action={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Rechercher un produit, un lieu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full rounded-full border-gray-300 focus:border-[#4A7C59] focus:ring-[#4A7C59]"
                />
              </div>
            </form>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              {/* Categories */}
              <div className="flex items-center gap-2">
                {categories.map((cat) => (
                  <Button
                    key={cat.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCategoryClick(cat.id)}
                    className="text-gray-700 hover:text-[#4A7C59] hover:bg-[#A8D5BA]/20"
                  >
                    <cat.icon className="h-4 w-4 mr-1" />
                    {cat.label}
                  </Button>
                ))}
              </div>

              {/* Publish Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage('publish')}
                className="border-[#4A7C59] text-[#4A7C59] hover:bg-[#4A7C59] hover:text-white"
              >
                <Plus className="h-4 w-4 mr-1" />
                Publier
              </Button>

              {/* Cart */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage('cart')}
                className="relative text-gray-700 hover:text-[#4A7C59]"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-[#E88D67] text-white text-xs rounded-full">
                    {cartCount}
                  </Badge>
                )}
              </Button>

              {/* User Menu */}
              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#A8D5BA] flex items-center justify-center">
                        <span className="text-sm font-medium text-[#4A7C59]">
                          {user.firstName[0]}{user.lastName[0]}
                        </span>
                      </div>
                      <span className="hidden lg:inline">{user.firstName}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {user.role === 'admin' && (
                      <DropdownMenuItem onClick={() => setCurrentPage('admin')}>
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Tableau de bord Admin
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => router.push('/settings/profile')}>
                      <Settings className="h-4 w-4 mr-2" />
                      Paramètres
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Déconnexion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => router.push('/login')}
                  >
                    Connexion
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => router.push('/signup')}
                    className="bg-[#4A7C59] hover:bg-[#3a6349] text-white"
                  >
                    Inscription
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle className="text-[#4A7C59]">Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-6">
                  {/* Mobile Search */}
                  <form action={handleSearch}>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="search"
                        placeholder="Rechercher..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full rounded-full"
                      />
                    </div>
                  </form>

                  {/* Categories */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">Catégories</p>
                    {categories.map((cat) => (
                      <Button
                        key={cat.id}
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => handleCategoryClick(cat.id)}
                      >
                        <cat.icon className="h-4 w-4 mr-2" />
                        {cat.label}
                      </Button>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      className="w-full justify-start border-[#4A7C59] text-[#4A7C59]"
                      onClick={() => setCurrentPage('publish')}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Publier une annonce
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => setCurrentPage('cart')}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Panier ({cartCount})
                    </Button>
                  </div>

                  {/* Auth */}
                  <div className="space-y-2 pt-4 border-t">
                    {isAuthenticated && user ? (
                      <>
                        <div className="flex items-center gap-2 px-4 py-2">
                          <div className="w-8 h-8 rounded-full bg-[#A8D5BA] flex items-center justify-center">
                            <span className="text-sm font-medium text-[#4A7C59]">
                              {user.firstName[0]}{user.lastName[0]}
                            </span>
                          </div>
                          <span>{user.firstName} {user.lastName}</span>
                        </div>
                        {user.role === 'admin' && (
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => setCurrentPage('admin')}
                          >
                            <LayoutDashboard className="h-4 w-4 mr-2" />
                            Tableau de bord Admin
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => router.push('/settings/profile')}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Paramètres
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-red-600"
                          onClick={logout}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Déconnexion
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          className="w-full"
                          onClick={() => router.push('/login')}
                        >
                          Connexion
                        </Button>
                        <Button
                          className="w-full bg-[#4A7C59] hover:bg-[#3a6349] text-white"
                          onClick={() => router.push('/signup')}
                        >
                          Inscription
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </>
  );
}
