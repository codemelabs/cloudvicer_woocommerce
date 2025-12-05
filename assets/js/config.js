export const API_DOMAIN = "http://127.0.0.1:8087";

export const API_URLS = {
  featuredCategories: `${API_DOMAIN}/api/featured-categories`,
  categoriesWithSubcategories: `${API_DOMAIN}/api/categories-with-subcategories`,
  current_deals: `${API_DOMAIN}/api/current-deals`,
  google_register: `${API_DOMAIN}/api/auth/google-register`,
  google_verify: `${API_DOMAIN}/api/auth/google-verify`,
  google_login: `${API_DOMAIN}/api/auth/google/login`,
  get_category: `${API_DOMAIN}/api/categories-with-subcategories`,
  load_products: `${API_DOMAIN}/api/product/geo`,
  serach_products: `${API_DOMAIN}/api/search/products/search?search=`,
  set_product: `${API_DOMAIN}/api/product/wooget/`,
};
