<template>
  <div class="product-display-container">
    <h2>Products Overview</h2>

    <div class="content-wrapper">
      <!-- Product Table -->
      <table v-if="products.length" class="product-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity Available</th>
            <th>Price ($)</th>
            <th>Add to Cart</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id">
            <td>{{ product.name }}</td>
            <td>{{ product.quantity }}</td>
            <td>{{ product.price.toFixed(2) }}</td>
            <td>
              <button
                class="btn add-cart"
                :disabled="product.quantity === 0"
                @click="addToCart(product)"
              >
                Add to Cart
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-else>No products available.</p>

      <!-- Cart Sidebar -->
      <aside class="cart-sidebar" v-if="cart.length > 0">
        <h3>Your Cart</h3>
        <ul>
          <li v-for="item in cart" :key="item.id" class="cart-item">
            <div class="cart-product-name">{{ item.name }}</div>
            <div>
              <label>Quantity:</label>
              <input
                type="number"
                min="1"
                :max="getProductQuantity(item.id)"
                v-model.number="item.quantity"
                @change="validateQuantity(item)"
              />
            </div>
            <div class="cart-product-price">${{ (item.price * item.quantity).toFixed(2) }}</div>
            <button class="btn delete" @click="removeFromCart(item.id)">Delete</button>
          </li>
        </ul>

        <div class="cart-footer">
          <div class="cart-total">
            Total: ${{ cartTotal.toFixed(2) }}
          </div>
          <button class="btn place-order" @click="placeOrder">Place Order</button>
        </div>
      </aside>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { collection, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore'
import { db } from '../firebase'

const products = ref([])
const cart = ref([])

// Fetch products from Firebase
const fetchProducts = async () => {
  const snapshot = await getDocs(collection(db, 'products'))
  products.value = []
  snapshot.forEach(docSnap => {
    products.value.push({ id: docSnap.id, ...docSnap.data() })
  })
}

onMounted(() => {
  fetchProducts()
})

// Add product to cart or increase quantity if already there
const addToCart = (product) => {
  const cartItem = cart.value.find(item => item.id === product.id)
  if (cartItem) {
    if (cartItem.quantity < product.quantity) {
      cartItem.quantity++
    } else {
      alert('No more stock available')
    }
  } else {
    if (product.quantity > 0) {
      cart.value.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1
      })
    }
  }
}

// Get max available quantity of a product from products list
const getProductQuantity = (id) => {
  const product = products.value.find(p => p.id === id)
  return product ? product.quantity : 0
}

// Validate quantity on change, keep it within stock limits
const validateQuantity = (item) => {
  const maxQty = getProductQuantity(item.id)
  if (item.quantity > maxQty) {
    item.quantity = maxQty
    alert(`Only ${maxQty} item(s) available in stock`)
  }
  if (item.quantity < 1) {
    item.quantity = 1
  }
}

// Remove an item from cart
const removeFromCart = (id) => {
  cart.value = cart.value.filter(item => item.id !== id)
}

// Calculate total price for cart items
const cartTotal = computed(() => {
  return cart.value.reduce((total, item) => total + item.price * item.quantity, 0)
})

// Place order: update products qty and create order records
const placeOrder = async () => {
  if (!cart.value.length) {
    alert('Your cart is empty!')
    return
  }

  try {
    // Update each product quantity in Firestore
    for (const item of cart.value) {
      const productDocRef = doc(db, 'products', item.id)
      const product = products.value.find(p => p.id === item.id)
      if (product) {
        const newQuantity = product.quantity - item.quantity
        if (newQuantity < 0) {
          alert(`Insufficient stock for ${product.name}`)
          return
        }
        await updateDoc(productDocRef, { quantity: newQuantity })
      }
    }

    // Create new order record(s) in a new 'orders' collection
    // Each cart item saved separately with name, qty, price, total
    const ordersCollection = collection(db, 'orders')

    for (const item of cart.value) {
      await addDoc(ordersCollection, {
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
        createdAt: new Date()
      })
    }

    alert(`Order placed successfully for total $${cartTotal.value.toFixed(2)}!`)

    // Clear cart and refresh products list to show updated quantities
    cart.value = []
    await fetchProducts()

  } catch (error) {
    console.error('Error placing order:', error)
    alert('Failed to place order. Please try again.')
  }
}
</script>


<style scoped>
.product-display-container {
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f9fafb;
  min-height: 100vh;
}

h2 {
  margin-bottom: 1.5rem;
  color: #34495e;
  font-weight: 700;
  font-size: 1.8rem;
  text-align: center;
}

.content-wrapper {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

/* Product Table */
.product-table {
  width: 70%;
  border-collapse: collapse;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.product-table th, .product-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #e1e4ea;
}

.product-table th {
  background-color: #3498db;
  color: white;
  font-weight: 600;
}

.product-table tbody tr:hover {
  background-color: #f1f7fd;
}

.btn.add-cart {
  background-color: #3498db;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s;
}

.btn.add-cart:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.btn.add-cart:hover:not(:disabled) {
  background-color: #2980b9;
}

/* Cart Sidebar */
.cart-sidebar {
  width: 30%;
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  max-height: 75vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.cart-sidebar h3 {
  margin-bottom: 1rem;
  font-weight: 700;
  color: #34495e;
  text-align: center;
}

.cart-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-bottom: 1px solid #e1e4ea;
  padding: 0.5rem 0;
}

.cart-product-name {
  flex: 1.5;
  font-weight: 600;
}

.cart-item input[type="number"] {
  width: 60px;
  padding: 5px 8px;
  border-radius: 6px;
  border: 1.5px solid #d1d8e0;
  font-size: 1rem;
  text-align: center;
}

.cart-product-price {
  flex: 1;
  text-align: right;
  font-weight: 600;
}

.btn.delete {
  background-color: #e74c3c;
  color: white;
  padding: 5px 10px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s;
}

.btn.delete:hover {
  background-color: #c0392b;
}

.cart-footer {
  margin-top: auto;
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid #e1e4ea;
}

.cart-total {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.btn.place-order {
  background-color: #2ecc71;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
}

.btn.place-order:hover {
  background-color: #27ae60;
}

/* Responsive */
@media (max-width: 900px) {
  .content-wrapper {
    flex-direction: column;
  }

  .product-table {
    width: 100%;
  }

  .cart-sidebar {
    width: 100%;
    max-height: none;
    margin-top: 2rem;
  }

  .cart-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .cart-product-price {
    width: 100%;
    text-align: left;
  }
}
</style>
