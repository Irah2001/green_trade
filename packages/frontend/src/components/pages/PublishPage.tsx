'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
  ImagePlus, 
  MapPin, 
  DollarSign, 
  Tag, 
  Package, 
  Leaf, 
  X, 
  CheckCircle,
  AlertCircle 
} from 'lucide-react';

// UI components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

import { useAppStore } from '@/store/useAppStore';
import { useToast } from '@/hooks/use-toast';


export default function PublishPage() {
  const { isAuthenticated, createProduct } = useAppStore();
  const { toast } = useToast();
  const [createdId, setCreatedId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    unit: 'kg',
    category: '',
    quantity: '',
    organic: true,
    city: '',
    postalCode: '',
  });
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const categories = [
    { value: 'fruits', label: 'Fruits', icon: '🍎' },
    { value: 'vegetables', label: 'Légumes', icon: '🥕' },
    { value: 'baskets', label: 'Paniers', icon: '🧺' },
  ];

  const units = ['kg', 'pièce', 'botte', 'panier', 'lot'];

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageAdd = () => {
    // Mock image URLs for demo
    const mockImages = [
      'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1724128239194-4bde5d240555?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1563252722-6434563a985d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800&h=600&fit=crop',
    ];
    const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];
    if (images.length < 5) {
      setImages((prev) => [...prev, randomImage]);
    }
  };

  const handleImageRemove = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {

    if (!isAuthenticated) {
      toast({
        title: 'Connexion requise',
        description: 'Veuillez vous connecter pour publier une annonce',
        variant: 'destructive',
      });
      return;
    }

    // Validation
    if (!formData.title || !formData.price || !formData.category || !formData.quantity) {
      toast({
        title: 'Formulaire incomplet',
        description: 'Veuillez remplir tous les champs obligatoires',
        variant: 'destructive',
      });
      return;
    }

    if (images.length === 0) {
      toast({
        title: 'Images requises',
        description: 'Ajoutez au moins une photo de votre produit',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    const { success, id, message } = await createProduct({
      title: formData.title,
      description: formData.description,
      price: Number(formData.price),
      category: formData.category,
      images,
      quantity: Number(formData.quantity),
      unit: formData.unit,
      location: formData.city
        ? { type: 'Point', coordinates: [0, 0], city: formData.city, postalCode: formData.postalCode }
        : undefined,
    });

    setIsSubmitting(false);

    if (success) {
      setCreatedId(id ?? null);
      setIsSuccess(true);
      toast({
        title: 'Annonce publiée !',
        description: 'Votre annonce a été publiée avec succès',
      });
    } else {
      toast({
        title: 'Erreur',
        description: message || 'Une erreur est survenue',
        variant: 'destructive',
      });
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-light-green flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-olive" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Annonce publiée !
        </h1>
        <p className="text-gray-600 mb-8">
          Votre produit est maintenant visible par les acheteurs de votre région.
          Vous serez notifié dès qu&apos;un acheteur sera intéressé.
        </p>
        <div className="flex flex-col gap-3">
          {createdId && (
            <Button
              onClick={() => {
                useAppStore.getState().setSelectedProduct(createdId);
                useAppStore.getState().setCurrentPage('product-detail');
              }}
              className="bg-olive hover:bg-olive-dark text-white"
            >
              Voir mon annonce
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => useAppStore.getState().setCurrentPage('products')}
            className="border-olive text-olive"
          >
            Voir tous les produits
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setIsSuccess(false);
              setCreatedId(null);
              setFormData({
                title: '',
                description: '',
                price: '',
                unit: 'kg',
                category: '',
                quantity: '',
                organic: true,
                city: '',
                postalCode: '',
              });
              setImages([]);
            }}
            className="text-gray-500"
          >
            Publier une autre annonce
          </Button>
          <Button
            onClick={() => useAppStore.getState().setCurrentPage('home')}
            className="bg-olive hover:bg-olive-dark text-white"
          >
            Retour à l&apos;accueil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Publier une annonce
        </h1>
        <p className="text-gray-600">
          Mettez en vente vos produits frais en quelques minutes
        </p>
      </div>

      {!isAuthenticated && (
        <Card className="mb-6 border-yellow-200 bg-yellow-50">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <p className="text-yellow-800">
              Connectez-vous pour publier une annonce
            </p>
          </CardContent>
        </Card>
      )}

      <form action={handleSubmit} className="space-y-6">
        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ImagePlus className="h-5 w-5 text-olive" />
              Photos du produit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
              {images.map((img, index) => (
                <div
                  key={`${img}-${index}`}
                  className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
                >
                  <Image
                    src={img}
                    alt={`Product ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 33vw, 20vw"
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleImageRemove(index)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <button
                  type="button"
                  onClick={handleImageAdd}
                  className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-olive hover:text-olive transition-colors"
                >
                  <ImagePlus className="h-6 w-6 mb-1" />
                  <span className="text-xs">Ajouter</span>
                </button>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Ajoutez jusqu&apos;à 5 photos. Première photo = photo principale.
            </p>
          </CardContent>
        </Card>

        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Tag className="h-5 w-5 text-olive" />
              Informations générales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre de l&apos;annonce *</Label>
              <Input
                id="title"
                placeholder="Ex: Pommes Golden Bio du verger"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Décrivez votre produit : variété, goût, conseils de préparation..."
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="rounded-lg min-h-24"
              />
            </div>

            <div className="space-y-2">
              <Label>Catégorie *</Label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Button
                    key={cat.value}
                    type="button"
                    variant={formData.category === cat.value ? 'default' : 'outline'}
                    onClick={() => handleChange('category', cat.value)}
                    className={
                      formData.category === cat.value
                        ? 'bg-olive hover:bg-olive-dark text-white'
                        : ''
                    }
                  >
                    {cat.icon} {cat.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-light-green/20 rounded-lg">
              <div className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-olive" />
                <Label htmlFor="organic" className="cursor-pointer">
                  Produit biologique
                </Label>
              </div>
              <Switch
                id="organic"
                checked={formData.organic}
                onCheckedChange={(checked) => handleChange('organic', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Price & Quantity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-olive" />
              Prix et disponibilité
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Prix *</Label>
                <div className="relative">
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => handleChange('price', e.target.value)}
                    className="rounded-lg pr-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    €
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unité</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(value) => handleChange('unit', value)}
                >
                  <SelectTrigger className="rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        par {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantité disponible *</Label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="quantity"
                  type="number"
                  placeholder="10"
                  value={formData.quantity}
                  onChange={(e) => handleChange('quantity', e.target.value)}
                  className="rounded-lg pl-10"
                />
              </div>
              <p className="text-sm text-gray-500">
                Nombre d&apos;unités disponibles à la vente
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-olive" />
              Localisation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Ville</Label>
                <Input
                  id="city"
                  placeholder="Nantes"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Code postal</Label>
                <Input
                  id="postalCode"
                  placeholder="44000"
                  value={formData.postalCode}
                  onChange={(e) => handleChange('postalCode', e.target.value)}
                  className="rounded-lg"
                />
              </div>
            </div>

            {/* Map placeholder */}
            <div className="relative h-40 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Carte interactive</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => useAppStore.getState().setCurrentPage('home')}
            className="flex-1"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !isAuthenticated}
            className="flex-1 bg-earth-orange hover:bg-earth-orange-dark text-white py-6"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                Publication...
              </>
            ) : (
              'Publier l\'annonce'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
