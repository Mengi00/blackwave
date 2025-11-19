import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowLeft, 
  CreditCard,
  QrCode,
  CheckCircle,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CartItem {
  product: any;
  quantity: number;
}

export default function Kiosk() {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState<number>(0);

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["/api/products"],
  });

  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
  });

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      return await apiRequest("POST", "/api/orders/kiosk", orderData);
    },
    onSuccess: (data) => {
      setOrderNumber(data.orderNumber);
      setShowSuccess(true);
      setShowCheckout(false);
      setCart([]);
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo procesar el pedido",
        variant: "destructive",
      });
    },
  });

  const filteredProducts = products?.filter((p: any) => 
    p.available && (!selectedCategory || p.categoryId === selectedCategory)
  );

  const addToCart = (product: any) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
    toast({
      title: "Producto agregado",
      description: `${product.name} agregado al carrito`,
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.product.id === productId) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const total = cart.reduce((sum, item) => 
    sum + (parseFloat(item.product.price) * item.quantity), 0
  );

  const handleCheckout = () => {
    setShowCart(false);
    setShowCheckout(true);
  };

  const handlePayment = () => {
    const orderData = {
      items: cart.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      })),
      paymentMethod,
      total: total.toString(),
    };
    createOrderMutation.mutate(orderData);
  };

  const handleNewOrder = () => {
    setShowSuccess(false);
    setOrderNumber(0);
    setPaymentMethod("");
    setSelectedCategory(null);
  };

  if (productsLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-20 w-full" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground p-6 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold" data-testid="text-kiosk-title">Bienvenido a RestoCafé</h1>
            <p className="text-lg opacity-90 mt-1">Realiza tu pedido de forma fácil y rápida</p>
          </div>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => setShowCart(true)}
            className="relative"
            data-testid="button-cart"
          >
            <ShoppingCart className="h-6 w-6 mr-2" />
            Ver Carrito
            {cart.length > 0 && (
              <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
            data-testid="button-category-all"
          >
            Todos
          </Button>
          {categories?.map((cat: any) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat.id)}
              data-testid={`button-category-${cat.id}`}
            >
              {cat.name}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts?.map((product: any) => (
            <Card 
              key={product.id} 
              className="hover-elevate overflow-hidden"
              data-testid={`card-product-${product.id}`}
            >
              <div className="aspect-video bg-muted flex items-center justify-center">
                {product.imageUrl ? (
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-6xl">🍽️</div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">
                    ${parseFloat(product.price).toLocaleString('es-CO')}
                  </span>
                  <Button
                    onClick={() => addToCart(product)}
                    data-testid={`button-add-${product.id}`}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={showCart} onOpenChange={setShowCart}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Tu Carrito
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Tu carrito está vacío</p>
              </div>
            ) : (
              <>
                <div className="max-h-96 overflow-y-auto space-y-3">
                  {cart.map((item) => (
                    <div 
                      key={item.product.id} 
                      className="flex items-center gap-4 p-3 border rounded-md"
                      data-testid={`cart-item-${item.product.id}`}
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          ${parseFloat(item.product.price).toLocaleString('es-CO')} c/u
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.product.id, -1)}
                          data-testid={`button-decrease-${item.product.id}`}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.product.id, 1)}
                          data-testid={`button-increase-${item.product.id}`}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">
                          ${(parseFloat(item.product.price) * item.quantity).toLocaleString('es-CO')}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.product.id)}
                        data-testid={`button-remove-${item.product.id}`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-medium">Total:</span>
                    <span className="text-3xl font-bold text-primary" data-testid="text-total">
                      ${total.toLocaleString('es-CO')}
                    </span>
                  </div>
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleCheckout}
                    data-testid="button-checkout"
                  >
                    <CreditCard className="h-5 w-5 mr-2" />
                    Proceder al Pago
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Método de Pago
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">Selecciona tu método de pago:</h3>
              <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="bancolombia" data-testid="tab-bancolombia">
                    Bancolombia
                  </TabsTrigger>
                  <TabsTrigger value="nequi" data-testid="tab-nequi">
                    Nequi
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="bancolombia" className="mt-6">
                  <div className="text-center space-y-4">
                    <div className="inline-block p-6 bg-muted rounded-lg">
                      <QrCode className="h-48 w-48 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium mb-1">Escanea el código QR</p>
                      <p className="text-sm text-muted-foreground">
                        Usa la app de Bancolombia para pagar ${total.toLocaleString('es-CO')}
                      </p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="nequi" className="mt-6">
                  <div className="text-center space-y-4">
                    <div className="inline-block p-6 bg-muted rounded-lg">
                      <QrCode className="h-48 w-48 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium mb-1">Escanea el código QR</p>
                      <p className="text-sm text-muted-foreground">
                        Usa la app de Nequi para pagar ${total.toLocaleString('es-CO')}
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="border-t pt-4 flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCheckout(false);
                  setShowCart(true);
                }}
                data-testid="button-back"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
              <Button
                className="flex-1"
                onClick={handlePayment}
                disabled={!paymentMethod || createOrderMutation.isPending}
                data-testid="button-confirm-payment"
              >
                {createOrderMutation.isPending ? "Procesando..." : "Confirmar Pago"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="max-w-md">
          <div className="text-center space-y-6 py-6">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">¡Pedido Confirmado!</h2>
              <p className="text-muted-foreground">Tu pedido ha sido procesado exitosamente</p>
            </div>
            <div className="bg-muted p-6 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Número de Pedido</p>
              <p className="text-5xl font-bold" data-testid="text-order-number">#{orderNumber}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Por favor, conserva este número y espera a que tu pedido esté listo
            </p>
            <Button
              className="w-full"
              size="lg"
              onClick={handleNewOrder}
              data-testid="button-new-order"
            >
              Hacer Nuevo Pedido
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
