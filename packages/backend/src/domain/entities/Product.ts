export type ProductProps = {
  id?: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  currency?: string;
  category: string;
  condition: 'neuf' | 'excellent' | 'bon' | 'acceptable';
  images?: string[];
  location?: {
    type: 'Point';
    coordinates: [number, number];
    address?: string;
    city?: string;
    postalCode?: string;
  };
  status?: 'active' | 'sold' | 'reserved' | 'archived';
  tags?: string[];
  views?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Product {
  private props: ProductProps;

  constructor(props: ProductProps) {
    if (!props.title || props.title.length < 3) {
      throw new Error('Title too short');
    }
    if (props.price <= 0) {
      throw new Error('Price must be positive');
    }
    this.props = {
      ...props,
      status: props.status ?? 'active',
      views: props.views ?? 0,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    };
  }

  get id() {
    return this.props.id;
  }

  get sellerId() {
    return this.props.sellerId;
  }

  get title() {
    return this.props.title;
  }

  get description() {
    return this.props.description;
  }

  get price() {
    return this.props.price;
  }

  get currency() {
    return this.props.currency ?? 'EUR';
  }

  get category() {
    return this.props.category;
  }

  get condition() {
    return this.props.condition;
  }

  get images() {
    return this.props.images ?? [];
  }

  get location() {
    return this.props.location;
  }

  get status() {
    return this.props.status!;
  }

  get views() {
    return this.props.views ?? 0;
  }

  toJSON() {
    return { ...this.props };
  }
}