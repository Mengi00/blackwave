import {
  categories,
  products,
  inventory,
  customers,
  staff,
  schedules,
  attendance,
  orders,
  orderItems,
  transactions,
  invoices,
  type Category,
  type InsertCategory,
  type Product,
  type InsertProduct,
  type Inventory,
  type InsertInventory,
  type Customer,
  type InsertCustomer,
  type Staff,
  type InsertStaff,
  type Schedule,
  type InsertSchedule,
  type Attendance,
  type InsertAttendance,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type Transaction,
  type InsertTransaction,
  type Invoice,
  type InsertInvoice,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<void>;

  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<void>;

  // Inventory
  getInventory(): Promise<Inventory[]>;
  getInventoryByProduct(productId: string): Promise<Inventory | undefined>;
  updateInventory(id: string, quantity: number): Promise<Inventory | undefined>;
  createInventory(inv: InsertInventory): Promise<Inventory>;

  // Customers
  getCustomers(): Promise<Customer[]>;
  getCustomer(id: string): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: string, customer: Partial<InsertCustomer>): Promise<Customer | undefined>;

  // Staff
  getStaff(): Promise<Staff[]>;
  getStaffMember(id: string): Promise<Staff | undefined>;
  createStaff(staff: InsertStaff): Promise<Staff>;
  updateStaff(id: string, staff: Partial<InsertStaff>): Promise<Staff | undefined>;

  // Schedules
  getSchedules(): Promise<Schedule[]>;
  getSchedule(id: string): Promise<Schedule | undefined>;
  createSchedule(schedule: InsertSchedule): Promise<Schedule>;
  updateSchedule(id: string, schedule: Partial<InsertSchedule>): Promise<Schedule | undefined>;
  deleteSchedule(id: string): Promise<void>;

  // Attendance
  getAttendance(): Promise<Attendance[]>;
  getAttendanceRecord(id: string): Promise<Attendance | undefined>;
  createAttendance(attendance: InsertAttendance): Promise<Attendance>;

  // Orders
  getOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;

  // Transactions
  getTransactions(): Promise<Transaction[]>;
  getTransaction(id: string): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;

  // Invoices
  getInvoice(orderId: string): Promise<Invoice | undefined>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;

  // Stats
  getStats(): Promise<any>;
  getRevenueData(): Promise<any[]>;
  getCategoryData(): Promise<any[]>;
}

export class DatabaseStorage implements IStorage {
  // Categories
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(categories.name);
  }

  async getCategory(id: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category || undefined;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  async updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const [updated] = await db.update(categories).set(category).where(eq(categories.id, id)).returning();
    return updated || undefined;
  }

  async deleteCategory(id: string): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return await db.query.products.findMany({
      with: {
        category: true,
        inventory: true,
      },
      orderBy: [desc(products.createdAt)],
    });
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return await db.query.products.findFirst({
      where: eq(products.id, id),
      with: {
        category: true,
        inventory: true,
      },
    });
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updated] = await db.update(products).set(product).where(eq(products.id, id)).returning();
    return updated || undefined;
  }

  async deleteProduct(id: string): Promise<void> {
    await db.delete(inventory).where(eq(inventory.productId, id));
    await db.delete(products).where(eq(products.id, id));
  }

  // Inventory
  async getInventory(): Promise<Inventory[]> {
    return await db.query.inventory.findMany({
      with: {
        product: {
          with: {
            category: true,
          },
        },
      },
    });
  }

  async getInventoryByProduct(productId: string): Promise<Inventory | undefined> {
    return await db.query.inventory.findFirst({
      where: eq(inventory.productId, productId),
    });
  }

  async updateInventory(id: string, quantity: number): Promise<Inventory | undefined> {
    const [updated] = await db
      .update(inventory)
      .set({ quantity, lastUpdated: new Date() })
      .where(eq(inventory.id, id))
      .returning();
    return updated || undefined;
  }

  async createInventory(inv: InsertInventory): Promise<Inventory> {
    const [newInventory] = await db.insert(inventory).values(inv).returning();
    return newInventory;
  }

  // Customers
  async getCustomers(): Promise<Customer[]> {
    return await db.select().from(customers).orderBy(desc(customers.createdAt));
  }

  async getCustomer(id: string): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer || undefined;
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const [newCustomer] = await db.insert(customers).values(customer).returning();
    return newCustomer;
  }

  async updateCustomer(id: string, customer: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const [updated] = await db.update(customers).set(customer).where(eq(customers.id, id)).returning();
    return updated || undefined;
  }

  // Staff
  async getStaff(): Promise<Staff[]> {
    return await db.select().from(staff).orderBy(staff.name);
  }

  async getStaffMember(id: string): Promise<Staff | undefined> {
    const [member] = await db.select().from(staff).where(eq(staff.id, id));
    return member || undefined;
  }

  async createStaff(staffMember: InsertStaff): Promise<Staff> {
    const [newStaff] = await db.insert(staff).values(staffMember).returning();
    return newStaff;
  }

  async updateStaff(id: string, staffData: Partial<InsertStaff>): Promise<Staff | undefined> {
    const [updated] = await db.update(staff).set(staffData).where(eq(staff.id, id)).returning();
    return updated || undefined;
  }

  // Schedules
  async getSchedules(): Promise<Schedule[]> {
    return await db.query.schedules.findMany({
      with: {
        staff: true,
      },
      orderBy: [schedules.dayOfWeek, schedules.startTime],
    });
  }

  async getSchedule(id: string): Promise<Schedule | undefined> {
    return await db.query.schedules.findFirst({
      where: eq(schedules.id, id),
      with: {
        staff: true,
      },
    });
  }

  async createSchedule(schedule: InsertSchedule): Promise<Schedule> {
    const [newSchedule] = await db.insert(schedules).values(schedule).returning();
    return newSchedule;
  }

  async updateSchedule(id: string, schedule: Partial<InsertSchedule>): Promise<Schedule | undefined> {
    const [updated] = await db.update(schedules).set(schedule).where(eq(schedules.id, id)).returning();
    return updated || undefined;
  }

  async deleteSchedule(id: string): Promise<void> {
    await db.delete(schedules).where(eq(schedules.id, id));
  }

  // Attendance
  async getAttendance(): Promise<Attendance[]> {
    return await db.query.attendance.findMany({
      with: {
        staff: true,
      },
      orderBy: [desc(attendance.date)],
    });
  }

  async getAttendanceRecord(id: string): Promise<Attendance | undefined> {
    return await db.query.attendance.findFirst({
      where: eq(attendance.id, id),
      with: {
        staff: true,
      },
    });
  }

  async createAttendance(attendanceData: InsertAttendance): Promise<Attendance> {
    const [newAttendance] = await db.insert(attendance).values(attendanceData).returning();
    return newAttendance;
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return await db.query.orders.findMany({
      with: {
        customer: true,
        items: {
          with: {
            product: true,
          },
        },
      },
      orderBy: [desc(orders.createdAt)],
    });
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return await db.query.orders.findFirst({
      where: eq(orders.id, id),
      with: {
        customer: true,
        items: {
          with: {
            product: true,
          },
        },
        invoice: true,
      },
    });
  }

  async createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    
    await db.insert(orderItems).values(
      items.map(item => ({ ...item, orderId: newOrder.id }))
    );

    return newOrder;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const [updated] = await db.update(orders).set({ status }).where(eq(orders.id, id)).returning();
    return updated || undefined;
  }

  // Transactions
  async getTransactions(): Promise<Transaction[]> {
    return await db.select().from(transactions).orderBy(desc(transactions.date));
  }

  async getTransaction(id: string): Promise<Transaction | undefined> {
    const [transaction] = await db.select().from(transactions).where(eq(transactions.id, id));
    return transaction || undefined;
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [newTransaction] = await db.insert(transactions).values(transaction).returning();
    return newTransaction;
  }

  // Invoices
  async getInvoice(orderId: string): Promise<Invoice | undefined> {
    const [invoice] = await db.select().from(invoices).where(eq(invoices.orderId, orderId));
    return invoice || undefined;
  }

  async createInvoice(invoice: InsertInvoice): Promise<Invoice> {
    const [newInvoice] = await db.insert(invoices).values(invoice).returning();
    return newInvoice;
  }

  // Stats
  async getStats(): Promise<any> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = await db.query.orders.findMany({
      where: sql`${orders.createdAt} >= ${today.toISOString()}`,
    });

    const todayRevenue = todayOrders.reduce((sum, order) => sum + parseFloat(order.total), 0);
    
    const allProducts = await db.select().from(products);
    const availableProducts = allProducts.filter(p => p.available);
    
    const allCustomers = await db.select().from(customers);
    
    const todayCustomers = await db.query.customers.findMany({
      where: sql`${customers.createdAt} >= ${today.toISOString()}`,
    });

    const lowStockInventory = await this.getInventory();
    const lowStockItems = lowStockInventory
      .filter(item => item.quantity <= item.minQuantity)
      .map(item => ({
        id: item.id,
        name: item.product?.name || 'Unknown',
        quantity: item.quantity,
        unit: item.unit,
      }));

    const pendingOrders = todayOrders.filter(o => o.status === 'pending').length;

    return {
      todayRevenue,
      todayOrders: todayOrders.length,
      pendingOrders,
      totalProducts: allProducts.length,
      availableProducts: availableProducts.length,
      totalCustomers: allCustomers.length,
      newCustomersToday: todayCustomers.length,
      lowStockItems,
      revenueChange: 12,
    };
  }

  async getRevenueData(): Promise<any[]> {
    const result = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayOrders = await db.query.orders.findMany({
        where: sql`${orders.createdAt} >= ${date.toISOString()} AND ${orders.createdAt} < ${nextDate.toISOString()}`,
      });

      const dayTransactions = await db.query.transactions.findMany({
        where: sql`${transactions.date} >= ${date.toISOString()} AND ${transactions.date} < ${nextDate.toISOString()}`,
      });

      const ingresos = dayTransactions
        .filter(t => t.type === 'ingreso')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      const egresos = dayTransactions
        .filter(t => t.type === 'egreso')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      result.push({
        date: date.toLocaleDateString('es-CO', { month: 'short', day: 'numeric' }),
        ingresos,
        egresos,
      });
    }

    return result;
  }

  async getCategoryData(): Promise<any[]> {
    const allCategories = await db.select().from(categories);
    const allOrders = await db.query.orders.findMany({
      with: {
        items: {
          with: {
            product: true,
          },
        },
      },
    });

    const categoryTotals: Record<string, number> = {};

    allOrders.forEach(order => {
      order.items?.forEach(item => {
        const categoryId = item.product?.categoryId;
        if (categoryId) {
          categoryTotals[categoryId] = (categoryTotals[categoryId] || 0) + parseFloat(item.subtotal);
        }
      });
    });

    return allCategories.map(cat => ({
      name: cat.name,
      value: categoryTotals[cat.id] || 0,
    }));
  }
}

export const storage = new DatabaseStorage();
