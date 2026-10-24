const MONEY_FIELDS = `
  amount
  currencyCode
`;

const IMAGE_FIELDS = `
  id
  url
  altText
  width
  height
`;

/** Kept as one reusable selection so every cart mutation returns checkout-ready state. */
export const CART_FIELDS = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      totalAmount { ${MONEY_FIELDS} }
      subtotalAmount { ${MONEY_FIELDS} }
    }
    discountCodes {
      applicable
      code
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              availableForSale
              price { ${MONEY_FIELDS} }
              product { title handle }
              image { ${IMAGE_FIELDS} }
            }
          }
        }
      }
    }
  }
`;

const PRODUCT_FIELDS = `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    descriptionHtml
    availableForSale
    tags
    vendor
    productType
    priceRange {
      minVariantPrice { ${MONEY_FIELDS} }
      maxVariantPrice { ${MONEY_FIELDS} }
    }
    featuredImage { ${IMAGE_FIELDS} }
    images(first: 10) { edges { node { ${IMAGE_FIELDS} } } }
    options { id name values }
    variants(first: 50) {
      edges {
        node {
          id
          title
          availableForSale
          price { ${MONEY_FIELDS} }
          compareAtPrice { ${MONEY_FIELDS} }
          selectedOptions { name value }
          image { ${IMAGE_FIELDS} }
        }
      }
    }
  }
`;

const MUTATION_FEEDBACK_FIELDS = `
  userErrors { code field message }
  warnings { code message target }
`;

export const GET_SHOP_INFO_QUERY = `
  query GetShopInfo {
    shop {
      name
      description
      primaryDomain { url host }
      paymentSettings { currencyCode }
    }
  }
`;

export const GET_PRODUCTS_QUERY = `
  ${PRODUCT_FIELDS}
  query GetProducts($first: Int = 20) {
    products(first: $first) { edges { node { ...ProductFields } } }
  }
`;

/** Uses the collection's merchant-defined/default ordering. */
export const GET_COLLECTION_BY_HANDLE_QUERY = `
  ${PRODUCT_FIELDS}
  query GetCollectionByHandle($handle: String!, $first: Int = 4) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      image { ${IMAGE_FIELDS} }
      products(first: $first) { edges { node { ...ProductFields } } }
    }
  }
`;

export const GET_PRODUCT_BY_HANDLE_QUERY = `
  ${PRODUCT_FIELDS}
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) { ...ProductFields }
  }
`;

export const GET_CART_QUERY = `
  ${CART_FIELDS}
  query GetCart($cartId: ID!) {
    cart(id: $cartId) { ...CartFields }
  }
`;

export const CART_CREATE_MUTATION = `
  ${CART_FIELDS}
  mutation CartCreate($input: CartInput) {
    cartCreate(input: $input) {
      cart { ...CartFields }
      ${MUTATION_FEEDBACK_FIELDS}
    }
  }
`;

export const CART_LINES_ADD_MUTATION = `
  ${CART_FIELDS}
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { ...CartFields }
      ${MUTATION_FEEDBACK_FIELDS}
    }
  }
`;

export const CART_LINES_UPDATE_MUTATION = `
  ${CART_FIELDS}
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { ...CartFields }
      ${MUTATION_FEEDBACK_FIELDS}
    }
  }
`;

export const CART_LINES_REMOVE_MUTATION = `
  ${CART_FIELDS}
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { ...CartFields }
      ${MUTATION_FEEDBACK_FIELDS}
    }
  }
`;

export const CART_DISCOUNT_CODES_UPDATE_MUTATION = `
  ${CART_FIELDS}
  mutation CartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]!) {
    cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
      cart { ...CartFields }
      ${MUTATION_FEEDBACK_FIELDS}
    }
  }
`;

// Customer operations intentionally remain independent from cart buyer identity.
export const CUSTOMER_CREATE_MUTATION = `
  mutation CustomerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer { id email firstName lastName }
      customerUserErrors { code field message }
    }
  }
`;

export const CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION = `
  mutation CustomerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken { accessToken expiresAt }
      customerUserErrors { code field message }
    }
  }
`;

export const GET_CUSTOMER_QUERY = `
  query GetCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      email
      firstName
      lastName
    }
  }
`;
