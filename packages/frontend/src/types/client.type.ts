export type LoginFormData = {
  email: string;
  password: string;
};

export type ClientFormData = {
  accountType: 'buyer';
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  city: string;
  postalCode: string;
  acceptTerms: boolean;
  acceptNewsletter: boolean;
};
