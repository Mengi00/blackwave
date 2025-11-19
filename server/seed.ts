import { db } from "./db";
import { 
  categories, 
  products, 
  inventory, 
  customers, 
  staff, 
  schedules,
  transactions
} from "@shared/schema";

async function seed() {
  console.log("Starting database seed...");

  const categoriesData = await db.insert(categories).values([
    { name: "Bebidas Calientes", description: "Café, té y chocolate", icon: "☕" },
    { name: "Bebidas Frías", description: "Jugos, smoothies y refrescos", icon: "🧃" },
    { name: "Desayunos", description: "Opciones para empezar el día", icon: "🍳" },
    { name: "Almuerzos", description: "Platos principales", icon: "🍽️" },
    { name: "Postres", description: "Dulces y postres", icon: "🍰" },
    { name: "Snacks", description: "Bocadillos y entradas", icon: "🥐" },
  ]).returning();

  console.log("✓ Categories created");

  const productsData = await db.insert(products).values([
    { name: "Café Americano", description: "Café negro suave", price: "5500", categoryId: categoriesData[0].id, available: true },
    { name: "Cappuccino", description: "Café con espuma de leche", price: "7500", categoryId: categoriesData[0].id, available: true },
    { name: "Latte", description: "Café con leche", price: "8000", categoryId: categoriesData[0].id, available: true },
    { name: "Chocolate Caliente", description: "Chocolate con leche", price: "7000", categoryId: categoriesData[0].id, available: true },
    
    { name: "Jugo Natural Naranja", description: "Jugo fresco de naranja", price: "6000", categoryId: categoriesData[1].id, available: true },
    { name: "Limonada", description: "Limonada natural", price: "5000", categoryId: categoriesData[1].id, available: true },
    { name: "Smoothie de Frutas", description: "Mezcla de frutas tropicales", price: "9000", categoryId: categoriesData[1].id, available: true },
    
    { name: "Huevos Revueltos", description: "Con pan y arepa", price: "12000", categoryId: categoriesData[2].id, available: true },
    { name: "Calentado", description: "Arroz, fríjol y carne", price: "15000", categoryId: categoriesData[2].id, available: true },
    { name: "Arepa con Queso", description: "Arepa rellena de queso", price: "8000", categoryId: categoriesData[2].id, available: true },
    
    { name: "Bandeja Paisa", description: "Plato típico colombiano", price: "25000", categoryId: categoriesData[3].id, available: true },
    { name: "Sancocho", description: "Sopa tradicional", price: "18000", categoryId: categoriesData[3].id, available: true },
    { name: "Arroz con Pollo", description: "Arroz amarillo con pollo", price: "16000", categoryId: categoriesData[3].id, available: true },
    
    { name: "Torta de Chocolate", description: "Rebanada de torta", price: "8000", categoryId: categoriesData[4].id, available: true },
    { name: "Flan de Caramelo", description: "Postre cremoso", price: "7000", categoryId: categoriesData[4].id, available: true },
    { name: "Brownie", description: "Con helado de vainilla", price: "9000", categoryId: categoriesData[4].id, available: true },
    
    { name: "Empanada", description: "Empanada de carne o pollo", price: "3000", categoryId: categoriesData[5].id, available: true },
    { name: "Pandebono", description: "Pan de queso", price: "2500", categoryId: categoriesData[5].id, available: true },
    { name: "Buñuelo", description: "Buñuelo tradicional", price: "2000", categoryId: categoriesData[5].id, available: true },
  ]).returning();

  console.log("✓ Products created");

  for (const product of productsData) {
    await db.insert(inventory).values({
      productId: product.id,
      quantity: Math.floor(Math.random() * 50) + 20,
      minQuantity: 10,
      unit: "unidades",
    });
  }

  console.log("✓ Inventory created");

  await db.insert(customers).values([
    { name: "María González", email: "maria@example.com", phone: "3001234567", documentType: "CC", documentNumber: "1234567890" },
    { name: "Carlos Rodríguez", email: "carlos@example.com", phone: "3009876543", documentType: "CC", documentNumber: "9876543210" },
    { name: "Ana Martínez", email: "ana@example.com", phone: "3112345678", documentType: "CC", documentNumber: "5555555555" },
    { name: "Juan Pérez", email: "juan@example.com", phone: "3209876543", documentType: "CC", documentNumber: "4444444444" },
  ]);

  console.log("✓ Customers created");

  const staffData = await db.insert(staff).values([
    { name: "Pedro Sánchez", email: "pedro@restocafe.com", phone: "3001112222", position: "Chef", active: true },
    { name: "Laura Torres", email: "laura@restocafe.com", phone: "3003334444", position: "Mesera", active: true },
    { name: "Diego Gómez", email: "diego@restocafe.com", phone: "3005556666", position: "Cajero", active: true },
    { name: "Sofía Ramírez", email: "sofia@restocafe.com", phone: "3007778888", position: "Mesera", active: true },
  ]).returning();

  console.log("✓ Staff created");

  for (const member of staffData) {
    await db.insert(schedules).values([
      { staffId: member.id, dayOfWeek: 1, startTime: "08:00", endTime: "16:00", active: true },
      { staffId: member.id, dayOfWeek: 2, startTime: "08:00", endTime: "16:00", active: true },
      { staffId: member.id, dayOfWeek: 3, startTime: "08:00", endTime: "16:00", active: true },
      { staffId: member.id, dayOfWeek: 4, startTime: "08:00", endTime: "16:00", active: true },
      { staffId: member.id, dayOfWeek: 5, startTime: "08:00", endTime: "16:00", active: true },
    ]);
  }

  console.log("✓ Schedules created");

  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const ingresoAmount = Math.floor(Math.random() * 500000) + 300000;
    const egresoAmount = Math.floor(Math.random() * 200000) + 100000;

    await db.insert(transactions).values([
      {
        type: "ingreso",
        category: "Ventas",
        amount: ingresoAmount.toString(),
        description: `Ventas del día ${date.toLocaleDateString('es-CO')}`,
        date,
      },
      {
        type: "egreso",
        category: "Operaciones",
        amount: egresoAmount.toString(),
        description: `Gastos operativos del día ${date.toLocaleDateString('es-CO')}`,
        date,
      },
    ]);
  }

  console.log("✓ Transactions created");

  console.log("✅ Database seed completed!");
}

seed().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});
