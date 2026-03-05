import prisma from '../prismaClient.js';

export class CartPrismaRepository {
  async getOrCreateCart(userId: string) {
    const existing = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    if (existing) return existing;

    return prisma.cart.create({
      data: { userId },
      include: { items: { include: { product: true } } },
    });
  }

  async getCart(userId: string) {
    return prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });
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