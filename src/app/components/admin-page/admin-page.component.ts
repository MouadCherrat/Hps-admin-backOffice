import { Component, OnInit } from '@angular/core';
import { BrandService } from '../../services/brand.service';
import { ProductService } from '../../services/product.service';
import { UserService } from '../../services/user.service';
import { KeycloakService } from '../../services/keycloak/keycloak.service';
import { OrderService } from '../../services/order.service';
import { PaymentService } from '../../services/payment.service';
import { Brand, BrandRequest, BrandResponse } from '../../interfaces/brand';
import { Product, ProductRequest, ProductResponse } from '../../interfaces/product';
import { Client } from '../../interfaces/client';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Order, OrderLineItemResponse } from '../../interfaces/order';
import { Bill } from '../../interfaces/bill';
@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('300ms ease-out', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ height: 0, opacity: 0 }))
      ])
    ])
  ]
})
export class AdminPageComponent implements OnInit {
  activeTab: 'brands-products' | 'clients' | 'orders' | 'payments' = 'brands-products';
  clients: Client[] = [];
  brands: BrandResponse[] = [];
  products: ProductResponse[] = [];
  orders: Order[] = [];
  bills: Bill[] = [];
  showBrandModal = false;
  showProductModal = false;
  currentBrand: BrandRequest = {} as BrandRequest;
  currentProduct: ProductRequest = {} as ProductRequest;
  editingBrand = false;
  editingProduct = false;
  editingBrandId: number | null = null;
  editingProductId: number | null = null;
  visibleProductsBrandId: number | null = null;
  visibleOrderItemsId: number | null = null;
  orderLineItems: { [orderId: number]: OrderLineItemResponse[] } = {};

  constructor(
    private brandService: BrandService,
    private productService: ProductService,
    private userService: UserService,
    private orderService: OrderService,
    private paymentService: PaymentService,
    private keycloakService: KeycloakService
  ) {}

  ngOnInit(): void {
    this.loadBrands();
    this.loadProducts();
    this.loadClients();
    this.loadOrders();
    this.loadBills();
  }
  loadOrders(): void {
    this.orderService.getAllOrders().subscribe(
      (orders: Order[]) => this.orders = orders,
      (error: any) => console.error('Error loading orders:', error)
    );
  }

  loadBills(): void {
    this.paymentService.getAllBills().subscribe(
      (bills: Bill[]) => this.bills = bills,
      (error: any) => console.error('Error loading bills:', error)
    );
  }
  toggleOrderItemsVisibility(orderId: number): void {
    if (this.visibleOrderItemsId === orderId) {
      this.visibleOrderItemsId = null;
    } else {
      this.visibleOrderItemsId = orderId;
      this.loadOrderLineItems(orderId);
    }
  }

  loadOrderLineItems(orderId: number): void {
    if (!this.orderLineItems[orderId]) {
      this.orderService.getOrderLineItems(orderId).subscribe(
        (items: OrderLineItemResponse[]) => this.orderLineItems[orderId] = items,
        (error: any) => console.error('Error loading order line items:', error)
      );
    }
  }

  isOrderItemsVisible(orderId: number): boolean {
    return this.visibleOrderItemsId === orderId;
  }


  loadBrands(): void {
    this.brandService.getAllBrands().subscribe(
      (brands: BrandResponse[]) => this.brands = brands,
      (error: any) => console.error('Error loading brands:', error)
    );
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe(
      (products: ProductResponse[]) => this.products = products,
      (error: any) => console.error('Error loading products:', error)
    );
  }

  loadClients(): void {
    this.userService.getAllUsers().subscribe(
      (users: Client[]) => {
        this.clients = users.map(user => ({
          ...user,
          userName: user.userName || this.keycloakService.profile?.username || '',
          lastName: user.lastName || '',
          email: user.email || '',
          role: user.role || this.keycloakService.profile?.role || '',
          sexe: user.sexe || '',
          phone: user.phone || ''
        }));
      },
      (error: any) => console.error('Error loading clients:', error)
    );
  }

  openAddBrandModal(): void {
    this.currentBrand = {} as BrandRequest;
    this.editingBrand = false;
    this.showBrandModal = true;
  }

  openUpdateBrandModal(brand: BrandResponse): void {
    this.currentBrand = { 
      name: brand.name, 
      description: brand.description, 
      imageUrl: brand.imageUrl 
    };
    this.editingBrand = true;
    this.editingBrandId = brand.id;
    this.showBrandModal = true;
  }

  closeBrandModal(): void {
    this.showBrandModal = false;
  }

  saveBrand(): void {
    if (this.editingBrand && this.editingBrandId) {
      this.brandService.updateBrand(this.editingBrandId, this.currentBrand).subscribe(
        () => {
          this.loadBrands();
          this.closeBrandModal();
        },
        (error: any) => console.error('Error updating brand:', error)
      );
    } else {
      this.brandService.createBrand(this.currentBrand).subscribe(
        () => {
          this.loadBrands();
          this.closeBrandModal();
        },
        (error: any) => console.error('Error creating brand:', error)
      );
    }
  }

  deleteBrand(id: number): void {
    if (confirm('Are you sure you want to delete this brand?')) {
      this.brandService.deleteBrand(id).subscribe(
        () => this.loadBrands(),
        (error: any) => console.error('Error deleting brand:', error)
      );
    }
  }

  openAddProductModal(): void {
    this.currentProduct = {} as ProductRequest;
    this.editingProduct = false;
    this.showProductModal = true;
  }

  openUpdateProductModal(product: ProductResponse): void {
    this.currentProduct = { 
      name: product.name,
      description: product.description,
      availableQuantity: product.availableQuantity,
      price: product.price,
      imageUrl: product.imageUrl,
      sexe: product.sexe,
      brandId: product.brandId
    };
    this.editingProduct = true;
    this.editingProductId = product.id;
    this.showProductModal = true;
  }

  closeProductModal(): void {
    this.showProductModal = false;
  }

  saveProduct(): void {
    if (this.editingProduct && this.editingProductId) {
      this.productService.updateProduct(this.editingProductId, this.currentProduct).subscribe(
        () => {
          this.loadProducts();
          this.closeProductModal();
        },
        (error: any) => console.error('Error updating product:', error)
      );
    } else {
      this.productService.createProduct(this.currentProduct).subscribe(
        () => {
          this.loadProducts();
          this.closeProductModal();
        },
        (error: any) => console.error('Error creating product:', error)
      );
    }
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe(
        () => this.loadProducts(),
        (error: any) => console.error('Error deleting product:', error)
      );
    }
  }

  toggleProductsVisibility(brandId: number): void {
    this.visibleProductsBrandId = this.visibleProductsBrandId === brandId ? null : brandId;
  }

  isProductsVisible(brandId: number): boolean {
    return this.visibleProductsBrandId === brandId;
  }

  getProductsForBrand(brandId: number): ProductResponse[] {
    return this.products.filter(product => product.brandId === brandId);
  }
}