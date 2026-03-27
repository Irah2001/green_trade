'use client';

import { useState, useEffect } from 'react';
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
  Loader2,
  Search,
  Ban,
  UserCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { useAppStore } from '@/store/useAppStore';
import { adminService } from '@/services/admin.service';
import type { 
  AdminStats, 
  AdminUser, 
  AdminOrder, 
  AdminProduct 
} from '@/services/admin.service';


export default function AdminDashboard() {
  const { user, isAuthenticated, setCurrentPage } = useAppStore();
  const [activeTab, setActiveTab] = useState('overview');

  // State management
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [usersPage, setUsersPage] = useState(1);
  const [ordersPage, setOrdersPage] = useState(1);
  const [productsPage, setProductsPage] = useState(1);
  const [usersTotalPages, setUsersTotalPages] = useState(1);
  const [ordersTotalPages, setOrdersTotalPages] = useState(1);
  const [productsTotalPages, setProductsTotalPages] = useState(1);

  // Filters
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Ban user dialog
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [banReason, setBanReason] = useState('');
  const [isBanning, setIsBanning] = useState(false);

  // Get token from localStorage
  const [token, setToken] = useState('');

  // Initialize token from localStorage on client side
  useEffect(() => {
    const storedToken = localStorage.getItem('gt_token'); // Correction: le token est stocké sous 'gt_token'
    if (storedToken) {
      setToken(storedToken);
      console.log('[DEBUG] Token récupéré du localStorage');
    } else {
      console.log('[DEBUG] Aucun token trouvé dans localStorage');
    }
  }, []);

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

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log('[DEBUG] Fetching stats with token:', token ? 'Token présent' : 'Pas de token');
        setLoading(true);
        const data = await adminService.getStats(token);
        console.log('[DEBUG] Stats reçues:', data);
        setStats(data);
        setError(null);
      } catch (err) {
        console.error('[ERROR] Error fetching stats:', err);
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des statistiques');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchStats();
    }
  }, [token]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const options: any = { page: usersPage, limit: 10 };
        if (roleFilter !== 'all') options.role = roleFilter;
        if (searchQuery.trim()) options.search = searchQuery.trim();

        const data = await adminService.getUsers(token, options);
        setUsers(data.users);
        setUsersTotalPages(data.pagination.totalPages);
        setError(null);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des utilisateurs');
      }
    };

    if (token && activeTab === 'users') {
      fetchUsers();
    }
  }, [token, activeTab, usersPage, roleFilter, searchQuery]);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const options: any = { page: ordersPage, limit: 10 };
        if (statusFilter !== 'all') options.status = statusFilter;

        const data = await adminService.getOrders(token, options);
        setOrders(data.orders);
        setOrdersTotalPages(data.pagination.totalPages);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des commandes');
      }
    };

    if (token && (activeTab === 'orders' || activeTab === 'overview')) {
      fetchOrders();
    }
  }, [token, activeTab, ordersPage, statusFilter]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await adminService.getProducts(token, { page: productsPage, limit: 10 });
        setProducts(data.products);
        setProductsTotalPages(data.pagination.totalPages);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des produits');
      }
    };

    if (token && activeTab === 'products') {
      fetchProducts();
    }
  }, [token, activeTab, productsPage]);

  // Handle ban/unban user
  const handleBanUser = async () => {
    if (!selectedUser) return;

    setIsBanning(true);
    try {
      await adminService.banUser(
        token,
        selectedUser.id,
        !selectedUser.isBanned,
        selectedUser.isBanned ? '' : banReason
      );
      
      // Refresh users list
      const options: any = { page: usersPage, limit: 10 };
      if (roleFilter !== 'all') options.role = roleFilter;
      if (searchQuery.trim()) options.search = searchQuery.trim();
      const data = await adminService.getUsers(token, options);
      setUsers(data.users);
      
      setBanDialogOpen(false);
      setBanReason('');
      setSelectedUser(null);
    } catch (err) {
      console.error('Error banning user:', err);
      alert(err instanceof Error ? err.message : 'Erreur lors du bannissement de l\'utilisateur');
    } finally {
      setIsBanning(false);
    }
  };

  const openBanDialog = (user: AdminUser) => {
    setSelectedUser(user);
    setBanDialogOpen(true);
  };

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

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}

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
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#4A7C59]" />
            </div>
          ) : stats ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Utilisateurs</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-[#A8D5BA]/30 flex items-center justify-center">
                        <Users className="h-6 w-6 text-[#4A7C59]" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Produits</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-[#A8D5BA]/30 flex items-center justify-center">
                        <Package className="h-6 w-6 text-[#4A7C59]" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Commandes</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-[#E88D67]/30 flex items-center justify-center">
                        <ShoppingCart className="h-6 w-6 text-[#E88D67]" />
                      </div>
                    </div>
                    <p className="text-xs text-yellow-600 mt-2">
                      {stats.ordersByStatus.pending || 0} en attente
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Revenus</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.totalRevenue.toFixed(2)}€</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-[#4A7C59]/30 flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-[#4A7C59]" />
                      </div>
                    </div>
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
                        <Badge className="bg-yellow-100 text-yellow-800">
                          {stats.ordersByStatus.pending || 0}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-blue-600" />
                          <span>Payées</span>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">
                          {stats.ordersByStatus.paid || 0}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Truck className="h-5 w-5 text-green-600" />
                          <span>Livrées</span>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          {stats.ordersByStatus.delivered || 0}
                        </Badge>
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
                      {stats.recentOrders.slice(0, 4).map((order) => (
                        <div
                          key={order.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-sm">
                              {order.buyer.firstName} {order.buyer.lastName}
                            </p>
                            <p className="text-xs text-gray-500">{order.product.title}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-[#4A7C59]">{order.totalPrice.toFixed(2)}€</p>
                            {getStatusBadge(order.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : null}
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Toutes les commandes</CardTitle>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="paid">Payée</SelectItem>
                    <SelectItem value="shipped">Expédiée</SelectItem>
                    <SelectItem value="delivered">Livrée</SelectItem>
                    <SelectItem value="cancelled">Annulée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucune commande trouvée</p>
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Acheteur</TableHead>
                        <TableHead>Vendeur</TableHead>
                        <TableHead>Produit</TableHead>
                        <TableHead>Quantité</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>
                            {order.buyer.firstName} {order.buyer.lastName}
                          </TableCell>
                          <TableCell>
                            {order.seller.firstName} {order.seller.lastName}
                          </TableCell>
                          <TableCell>{order.product.title}</TableCell>
                          <TableCell>{order.quantity}</TableCell>
                          <TableCell className="font-medium">{order.totalPrice.toFixed(2)}€</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {formatDate(order.createdAt)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-gray-600">
                      Page {ordersPage} sur {ordersTotalPages}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setOrdersPage((p) => Math.max(1, p - 1))}
                        disabled={ordersPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setOrdersPage((p) => Math.min(ordersTotalPages, p + 1))}
                        disabled={ordersPage === ordersTotalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <CardTitle>Utilisateurs actifs</CardTitle>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-initial">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher..."
                      className="pl-9 w-full sm:w-[200px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-full sm:w-[150px]">
                      <SelectValue placeholder="Rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les rôles</SelectItem>
                      <SelectItem value="buyer">Acheteur</SelectItem>
                      <SelectItem value="farmer">Producteur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {users.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun utilisateur trouvé</p>
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Utilisateur</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Rôle</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Inscription</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-[#A8D5BA] flex items-center justify-center text-sm font-medium text-[#4A7C59]">
                                {(u.firstName?.[0] || '?')}{(u.lastName?.[0] || '?')}
                              </div>
                              <span>{u.firstName || ''} {u.lastName || ''}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">{u.email}</TableCell>
                          <TableCell>
                            <Badge variant={u.role === 'admin' ? 'default' : 'secondary'}>
                              {u.role === 'farmer' ? 'Producteur' : u.role === 'buyer' ? 'Acheteur' : 'Admin'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {u.isBanned ? (
                              <Badge variant="destructive" className="bg-red-100 text-red-800">
                                Banni
                              </Badge>
                            ) : (
                              <Badge className="bg-green-100 text-green-800">
                                Actif
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {formatDate(u.createdAt)}
                          </TableCell>
                          <TableCell>
                            {u.role !== 'admin' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openBanDialog(u)}
                                className={u.isBanned ? 'text-green-600 hover:text-green-700' : 'text-red-600 hover:text-red-700'}
                              >
                                {u.isBanned ? (
                                  <>
                                    <UserCheck className="h-4 w-4 mr-1" />
                                    Débannir
                                  </>
                                ) : (
                                  <>
                                    <Ban className="h-4 w-4 mr-1" />
                                    Bannir
                                  </>
                                )}
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-gray-600">
                      Page {usersPage} sur {usersTotalPages}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setUsersPage((p) => Math.max(1, p - 1))}
                        disabled={usersPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setUsersPage((p) => Math.min(usersTotalPages, p + 1))}
                        disabled={usersPage === usersTotalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
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
              {products.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun produit trouvé</p>
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produit</TableHead>
                        <TableHead>Vendeur</TableHead>
                        <TableHead>Catégorie</TableHead>
                        <TableHead>Prix</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Vues</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {product.images && product.images.length > 0 && (
                                <img
                                  src={product.images[0]}
                                  alt={product.title}
                                  className="w-10 h-10 rounded-lg object-cover"
                                />
                              )}
                              <span className="font-medium">{product.title}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {product.seller.firstName || ''} {product.seller.lastName || ''}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {product.category === 'fruits' ? '🍎' : product.category === 'vegetables' ? '🥕' : '🧺'} {product.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">{product.price.toFixed(2)}€</TableCell>
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
                      ))}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-gray-600">
                      Page {productsPage} sur {productsTotalPages}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setProductsPage((p) => Math.max(1, p - 1))}
                        disabled={productsPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setProductsPage((p) => Math.min(productsTotalPages, p + 1))}
                        disabled={productsPage === productsTotalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Ban User Dialog */}
      <AlertDialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedUser?.isBanned ? 'Débannir l\'utilisateur' : 'Bannir l\'utilisateur'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedUser?.isBanned ? (
                <>
                  Êtes-vous sûr de vouloir débannir{' '}
                  <strong>{selectedUser?.firstName} {selectedUser?.lastName}</strong> ?
                  <br />
                  L'utilisateur pourra à nouveau accéder à la plateforme.
                </>
              ) : (
                <>
                  Êtes-vous sûr de vouloir bannir{' '}
                  <strong>{selectedUser?.firstName} {selectedUser?.lastName}</strong> ?
                  <br />
                  L'utilisateur ne pourra plus accéder à la plateforme.
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Raison du bannissement *
                    </label>
                    <Input
                      placeholder="Ex: Violation des conditions d'utilisation"
                      value={banReason}
                      onChange={(e) => setBanReason(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBanUser}
              disabled={isBanning || (!selectedUser?.isBanned && !banReason.trim())}
              className={
                selectedUser?.isBanned
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }
            >
              {isBanning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Traitement...
                </>
              ) : selectedUser?.isBanned ? (
                'Débannir'
              ) : (
                'Bannir'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
