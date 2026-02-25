'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Users,
  ShoppingCart,
  Package,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  Truck,
  Eye,
} from 'lucide-react';

import { useAppStore } from '@/store/useAppStore';
import { mockUsers, mockOrders, mockProducts } from '@/data/mockData';


export default function AdminDashboard() {
  const { user, isAuthenticated, setCurrentPage } = useAppStore();
  const [activeTab, setActiveTab] = useState('overview');

  // Check if user is admin
  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h1>
        <p className="text-gray-600 mb-6">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>
        <Button
          onClick={() => setCurrentPage('home')}
          className="bg-[#4A7C59] hover:bg-[#3a6349] text-white"
        >
          Retour à l'accueil
        </Button>
      </div>
    );
  }

  // Calculate stats
  const totalUsers = mockUsers.filter((u) => u.role !== 'admin').length;
  const totalProducts = mockProducts.length;
  const totalOrders = mockOrders.length;
  const totalRevenue = mockOrders.reduce((sum, o) => sum + o.amount, 0);

  const pendingOrders = mockOrders.filter((o) => o.status === 'pending').length;
  const paidOrders = mockOrders.filter((o) => o.status === 'paid').length;
  const deliveredOrders = mockOrders.filter((o) => o.status === 'delivered').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'paid':
        return <Badge className="bg-blue-100 text-blue-800">Payée</Badge>;
      case 'delivered':
        return <Badge className="bg-green-100 text-green-800">Livrée</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Annulée</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tableau de bord Admin
        </h1>
        <p className="text-gray-600">
          Bienvenue, {user?.firstName} ! Voici un aperçu de votre marketplace.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-[#F8F9FA] p-1 rounded-lg">
          <TabsTrigger value="overview" className="rounded-md">
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="orders" className="rounded-md">
            Commandes
          </TabsTrigger>
          <TabsTrigger value="users" className="rounded-md">
            Utilisateurs
          </TabsTrigger>
          <TabsTrigger value="products" className="rounded-md">
            Produits
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Utilisateurs</p>
                    <p className="text-3xl font-bold text-gray-900">{totalUsers}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-[#A8D5BA]/30 flex items-center justify-center">
                    <Users className="h-6 w-6 text-[#4A7C59]" />
                  </div>
                </div>
                <p className="text-xs text-green-600 mt-2">+12% ce mois</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Produits</p>
                    <p className="text-3xl font-bold text-gray-900">{totalProducts}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-[#A8D5BA]/30 flex items-center justify-center">
                    <Package className="h-6 w-6 text-[#4A7C59]" />
                  </div>
                </div>
                <p className="text-xs text-green-600 mt-2">+8 actifs aujourd'hui</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Commandes</p>
                    <p className="text-3xl font-bold text-gray-900">{totalOrders}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-[#E88D67]/30 flex items-center justify-center">
                    <ShoppingCart className="h-6 w-6 text-[#E88D67]" />
                  </div>
                </div>
                <p className="text-xs text-yellow-600 mt-2">{pendingOrders} en attente</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Revenus</p>
                    <p className="text-3xl font-bold text-gray-900">{totalRevenue.toFixed(2)}€</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-[#4A7C59]/30 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-[#4A7C59]" />
                  </div>
                </div>
                <p className="text-xs text-green-600 mt-2">+24% ce mois</p>
              </CardContent>
            </Card>
          </div>

          {/* Order Status Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Statut des commandes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-yellow-600" />
                      <span>En attente</span>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">{pendingOrders}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                      <span>Payées</span>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">{paidOrders}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Truck className="h-5 w-5 text-green-600" />
                      <span>Livrées</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">{deliveredOrders}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dernières commandes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockOrders.slice(0, 4).map((order) => {
                    const buyer = mockUsers.find((u) => u.id === order.buyerId);
                    const product = mockProducts.find((p) => p.id === order.productId);
                    return (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-sm">
                            {buyer?.firstName} {buyer?.lastName}
                          </p>
                          <p className="text-xs text-gray-500">{product?.title}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-[#4A7C59]">{order.amount.toFixed(2)}€</p>
                          {getStatusBadge(order.status)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Toutes les commandes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Acheteur</TableHead>
                    <TableHead>Produit</TableHead>
                    <TableHead>Quantité</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockOrders.map((order) => {
                    const buyer = mockUsers.find((u) => u.id === order.buyerId);
                    const product = mockProducts.find((p) => p.id === order.productId);
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-xs">{order.id}</TableCell>
                        <TableCell>
                          {buyer?.firstName} {buyer?.lastName}
                        </TableCell>
                        <TableCell>{product?.title}</TableCell>
                        <TableCell>{order.quantity}</TableCell>
                        <TableCell className="font-medium">{order.amount.toFixed(2)}€</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Utilisateurs actifs</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Localisation</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead>Inscription</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockUsers.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#A8D5BA] flex items-center justify-center text-sm font-medium text-[#4A7C59]">
                            {u.firstName[0]}{u.lastName[0]}
                          </div>
                          <span>{u.firstName} {u.lastName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">{u.email}</TableCell>
                      <TableCell>
                        <Badge variant={u.role === 'admin' ? 'default' : 'secondary'}>
                          {u.role === 'admin' ? 'Admin' : u.role === 'producer' ? 'Producteur' : 'Client'}
                        </Badge>
                      </TableCell>
                      <TableCell>{u.location?.city}</TableCell>
                      <TableCell>★ {u.rating?.toFixed(1)}</TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {formatDate(u.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Produits en vente</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produit</TableHead>
                    <TableHead>Vendeur</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Vues</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockProducts.map((product) => {
                    const seller = mockUsers.find((u) => u.id === product.sellerId);
                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <span className="font-medium">{product.title}</span>
                          </div>
                        </TableCell>
                        <TableCell>{seller?.firstName} {seller?.lastName}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {product.category === 'fruits' ? '🍎' : product.category === 'vegetables' ? '🥕' : '🧺'} {product.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{product.price.toFixed(2)}€/{product.unit}</TableCell>
                        <TableCell>{product.quantity} {product.unit}</TableCell>
                        <TableCell>
                          <Badge className={product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {product.status === 'active' ? 'Actif' : 'Inactif'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-gray-500">
                            <Eye className="h-4 w-4" />
                            {product.views}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
