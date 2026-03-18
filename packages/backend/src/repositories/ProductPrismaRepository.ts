import prisma from '../prismaClient.js';
import { Product, ProductProps } from '../domain/entities/Product.js';

function toDomain(prismaProduct: any): Product {
  const props: ProductProps = {
    id: prismaProduct.id,
    sellerId: prismaProduct.sellerId,
    title: prismaProduct.title,
    description: prismaProduct.description,
    price: Number(prismaProduct.price),
    currency: prismaProduct.currency ?? 'EUR',
    category: prismaProduct.category,
    condition: prismaProduct.condition,
    images: prismaProduct.images ?? [],
    location: prismaProduct.location ?? undefined,
    status: prismaProduct.status,
    quantity: prismaProduct.quantity ?? 0,
    unit: prismaProduct.unit ?? 'unité',
    tags: prismaProduct.tags ?? [],
    createdAt: prismaProduct.createdAt ? new Date(prismaProduct.createdAt) : new Date(),
    updatedAt: prismaProduct.updatedAt ? new Date(prismaProduct.updatedAt) : new Date(),
  };

  return new Product(props);
}

export class ProductPrismaRepository {
  async save(product: Product): Promise<Product> {
    const data = {
      title: product.title,
      description: product.description,
      price: product.price,
      currency: (product as any).currency,
      category: product.category,
      condition: product.condition,
      images: product.images,
      location: product.location ? (product.location as any) : null,
      status: product.status,
      quantity: product.quantity,
      unit: product.unit,
      tags: product.toJSON().tags ?? [],
      views: (product as any).views ?? 0,
    };

    let p;
    if (product.id) {
      p = await prisma.product.update({
        where: { id: product.id },
        data: { ...data, updatedAt: new Date() },
      });
    } else {
      p = await prisma.product.create({
        data: { ...data, sellerId: product.sellerId },
      });
    }

    return toDomain(p);
  }

  async findById(id: string): Promise<Product | null> {
    const p = await prisma.product.findUnique({ where: { id } });
    return p ? toDomain(p) : null;
  }

  async findBySellerId(sellerId: string, page = 1, limit = 20): Promise<Product[]> {
    const skip = (page - 1) * limit;
    const items = await prisma.product.findMany({
      where: { sellerId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });
    return items.map(toDomain);
  }

  async search(query: {
    text?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    location?: { coordinates: [number, number]; radiusKm?: number };
    page?: number;
    limit?: number;
  }): Promise<{ items: Product[]; total: number }> {
    const { text, category, minPrice, maxPrice, page = 1, limit = 20 } = query;
    const where: any = {};

    const and: any[] = [];

    if (text) {
      and.push({
        OR: [
          { title: { contains: text, mode: 'insensitive' } },
          { description: { contains: text, mode: 'insensitive' } },
        ],
      });
    }

    if (category) {
      and.push({ category });
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceCond: any = {};
      if (minPrice !== undefined) priceCond.gte = minPrice;
      if (maxPrice !== undefined) priceCond.lte = maxPrice;
      and.push({ price: priceCond });
    }

    if (and.length) where.AND = and;

    const skip = (page - 1) * limit;

    const [total, items] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { items: items.map(toDomain), total };
  }

  async delete(id: string): Promise<void> {
    await prisma.product.delete({ where: { id } });
  }
}

export default ProductPrismaRepository;