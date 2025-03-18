export enum Civility {
    Society = 'Société',
    Mr = 'Monsieur',
    Mrs = 'Madame',
}

export type Contact = {
    number: string;
    civility: Civility;
    firstName: string;
    lastName: string;
    companyName: string;
    postalCode: string;
    city: string;
    country: string;
    customerPriceGroup: string;
    customerDiscountGroup: string;
    customerPaymentTerms: string;
    customerVatGroup: string;
    customerDeliveryTerms: string;
    customerDeliveryMethod: string;
    customerDeliveryAddress: string;
    customerDeliveryCity: string;
    customerDeliveryPostalCode: string;
    customerDeliveryCountry: string;
    customerDeliveryContact: string;
};