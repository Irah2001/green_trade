import prisma from '../prismaClient.js';
import { toPublicSellerSummary } from '../domain/entities/Product.js';

const productSelect = {
  seller: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      city: true,
      postalCode: true,
      profile: true,
    },
  },
} as const;

const cartSelect = {
  items: {
    include: {
      product: {
        include: productSelect,
      },
    },
  },
} as const;

const serializeProduct = (product: any) => ({
  ...product,
  seller: toPublicSellerSummary(product?.seller),
});

const serializeCart = (cart: any) => ({
  ...cart,
  items: Array.isArray(cart?.items)
    ? cart.items.map((item: any) => ({
        ...item,
        product: serializeProduct(item.product),
      }))
    : [],
});

export class CartPrismaRepository {
  async getOrCreateCart(userId: string) {
    const existing = await prisma.cart.findUnique({
      where: { userId },
      include: cartSelect,
    });

    if (existing) return serializeCart(existing);

    const created = await prisma.cart.create({
      data: { userId },
      include: cartSelect,
    });

    return serializeCart(created);
  }

  async getCart(userId: string) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: cartSelect,
    });

    return cart ? serializeCart(cart) : null;
  }

  async addItem(userId: string, productId: string, quantity: number, unitPriceSnapshot: number) {
    const cart = await this.getOrCreateCart(userId);

    const existingItem = await prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId } },
    });

    if (existingItem) {
      return prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    }

    return prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
        unitPriceSnapshot,
      },
    });
  }

  async updateQuantity(userId: string, productId: string, quantity: number) {
    const cart = await this.getOrCreateCart(userId);
    const existingItem = await prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId } },
    });

    if (!existingItem) {
      return null;
    }

    if (quantity <= 0) {
      return prisma.cartItem.delete({
        where: { cartId_productId: { cartId: cart.id, productId } },
      });
    }

    return prisma.cartItem.update({
      where: { cartId_productId: { cartId: cart.id, productId } },
      data: { quantity },
    });
  }

  async removeItem(userId: string, productId: string) {
    const cart = await this.getOrCreateCart(userId);
    const existingItem = await prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId } },
    });

    if (!existingItem) {
      return null;
    }
    return prisma.cartItem.delete({
      where: { cartId_productId: { cartId: cart.id, productId } },
    });
  }

  async clearCart(userId: string) {
    const cart = await this.getOrCreateCart(userId);
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }
}
