// @vitest-environment jsdom

import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import SellerIdentity from '@/components/shared/seller-identity';

describe('SellerIdentity', () => {
  it('renders the real seller name and city', () => {
    render(
      <SellerIdentity
        seller={{
          id: 'seller-1',
          displayName: 'Camille Durand',
          avatar: '/avatars/camille.png',
          city: 'Angers',
          profile: { bio: 'Productrice locale' },
        }}
        fallbackCity="Nantes"
      />,
    );

    expect(screen.getByText('Camille Durand')).toBeDefined();
    expect(screen.getByText('Angers')).toBeDefined();
    expect(screen.queryByText(/Producteur local/i)).toBeNull();
  });

  it('uses a neutral fallback instead of a generic producer label', () => {
    render(<SellerIdentity seller={null} fallbackCity="Nantes" />);

    expect(screen.getByText(/Vendeur indisponible/i)).toBeDefined();
    expect(screen.getByText('Nantes')).toBeDefined();
    expect(screen.queryByText(/Producteur local/i)).toBeNull();
  });
});
