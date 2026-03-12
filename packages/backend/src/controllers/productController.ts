import { Response, Request } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import { Product } from '../domain/entities/Product.js';
import ProductPrismaRepository from '../repositories/ProductPrismaRepository.js';

const productRepository = new ProductPrismaRepository();

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { text, category, minPrice, maxPrice, page, limit } = req.query;
    const searchQuery: Parameters<typeof productRepository.search>[0] = {
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
    };
    if (typeof text === 'string') searchQuery.text = text;
    if (typeof category === 'string') searchQuery.category = category;
    if (minPrice) searchQuery.minPrice = Number(minPrice);
    if (maxPrice) searchQuery.maxPrice = Number(maxPrice);
    const result = await productRepository.search(searchQuery);
    return res.json({ items: result.items.map(p => p.toJSON()), total: result.total });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const product = await productRepository.findById(id);
    if (!product) return res.status(404).json({ message: 'Produit non trouvé.' });
    return res.json(product.toJSON());
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, price, category, condition, images, location, tags, status } = req.body;
    const product = new Product({
      sellerId: req.userId!,
      title,
      description,
      price: Number(price),
      category,
      condition: condition ?? 'bon',
      images: images ?? [],
      location,
      tags: tags ?? [],
      status: status ?? 'active',
    });
    const saved = await productRepository.save(product);
    return res.status(201).json(saved.toJSON());
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const existing = await productRepository.findById(id);
    if (!existing) return res.status(404).json({ message: 'Produit non trouvé.' });
    if (existing.sellerId !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé.' });
    }

    const { title, description, price, category, condition, images, location, tags, status } = req.body;
    const updated = new Product({
      id,
      sellerId: existing.sellerId,
      title: title ?? existing.title,
      description: description ?? existing.description,
      price: price !== undefined ? Number(price) : existing.price,
      category: category ?? existing.category,
      condition: condition ?? existing.condition,
      images: images ?? existing.images,
      location: location ?? existing.location,
      tags: tags ?? existing.toJSON().tags,
      status: status ?? existing.status,
      views: existing.views,
      ...(existing.toJSON().createdAt ? { createdAt: existing.toJSON().createdAt } : {}),
    });
    const saved = await productRepository.save(updated);
    return res.json(saved.toJSON());
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const getProductsBySeller = async (req: Request, res: Response) => {
  try {
    const id = req.params.sellerId as string;
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 20;
    const products = await productRepository.findBySellerId(id, page, limit);
    return res.json({ items: products.map(p => p.toJSON()), total: products.length });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const existing = await productRepository.findById(id);
    if (!existing) return res.status(404).json({ message: 'Produit non trouvé.' });
    if (existing.sellerId !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé.' });
    }
    await productRepository.delete(id);
    return res.status(204).send();
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
