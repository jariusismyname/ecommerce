<template>
<button class="btn absolute-logout" @click="logout">Logout</button>

  <div class="container">
    <!-- Left: Form -->
    <section class="form-section">
      <h2>Add New Product</h2>
      <label for="product-name">Product Name</label>
      <input id="product-name" v-model="name" placeholder="Enter product name" />

      <label for="product-quantity">Quantity</label>
      <input
        id="product-quantity"
        v-model.number="quantity"
        type="number"
        min="0"
        placeholder="Enter quantity"
      />

      <label for="product-price">Price</label>
      <input
        id="product-price"
        v-model.number="price"
        type="number"
        min="0"
        step="0.01"
        placeholder="Enter price"
      />

      <button class="btn primary" @click="addProduct">Add Product</button>
    </section>

    <!-- Right: Product List -->
    <section class="product-list">
      <h2>Product List</h2>
      <ul>
        <li v-for="product in products" :key="product.id" class="product-item">
          <div class="input-group">
            <label>Product Name</label>
            <input v-model="product.name" />
          </div>

          <div class="input-group">
            <label>Quantity</label>
            <input v-model.number="product.quantity" type="number" min="0" />
          </div>

          <div class="input-group">
            <label>Price</label>
            <input v-model.number="product.price" type="number" min="0" step="0.01" />
          </div>

          <div class="button-group">
            <button class="btn update" @click="updateProduct(product)">Update</button>
            <button class="btn delete" @click="deleteProduct(product.id)">Delete</button>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import { db, auth } from '../firebase'
import { useRouter } from 'vue-router'

const name = ref('')
const quantity = ref(0)
const price = ref(0)
const products = ref([])
const router = useRouter()

const addProduct = async () => {
  if (!name.value || quantity.value < 0 || price.value < 0) {
    alert('Please enter valid product details.')
    return
  }

  await addDoc(collection(db, 'products'), {
    name: name.value.trim(),
    quantity: quantity.value,
    price: price.value
  })

  name.value = ''
  quantity.value = 0
  price.value = 0
  fetchProducts()
}

const fetchProducts = async () => {
  products.value = []
  const snapshot = await getDocs(collection(db, 'products'))
  snapshot.forEach((docSnap) => {
    products.value.push({ id: docSnap.id, ...docSnap.data() })
  })
}

const updateProduct = async (product) => {
  const productRef = doc(db, 'products', product.id)
  await updateDoc(productRef, {
    name: product.name.trim(),
    quantity: product.quantity,
    price: product.price
  })
  alert('Product updated successfully!')
}

const deleteProduct = async (id) => {
  await deleteDoc(doc(db, 'products', id))
  fetchProducts()
}

const logout = async () => {
  await signOut(auth)
  router.push('/')
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
/* Logout Button Positioned Top-Right */
.absolute-logout {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 999;
  padding: 10px 16px;
  background-color: #e74c3c;
  color: white;
  font-weight: 600;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.absolute-logout:hover {
  background-color: #c0392b;
}

/* Container and Layout */
.container {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f5f7fa;
  min-height: 100vh;
  box-sizing: border-box;
}

/* Form Section */
.form-section {
  flex: 1;
  background: #ffffff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.form-section h2 {
  margin-bottom: 1.5rem;
  color: #34495e;
  font-weight: 700;
  font-size: 1.8rem;
}

label {
  margin-bottom: 0.4rem;
  font-weight: 600;
  color: #2c3e50;
  display: block;
}

input {
  padding: 10px 12px;
  margin-bottom: 1.2rem;
  border-radius: 6px;
  border: 1.5px solid #d1d8e0;
  font-size: 1rem;
  transition: border-color 0.3s;
  width: 100%;
}

input:focus {
  outline: none;
  border-color: #3498db;
}

/* Buttons */
.btn {
  cursor: pointer;
  padding: 12px 20px;
  border-radius: 6px;
  font-weight: 600;
  border: none;
  font-size: 1rem;
  transition: background-color 0.3s;
  margin-top: 0.5rem;
  width: fit-content;
}

.btn.primary {
  background-color: #3498db;
  color: white;
}

.btn.primary:hover {
  background-color: #2980b9;
}

.btn.logout {
  background-color: #e74c3c;
  color: white;
  margin-top: auto;
  width: 100%;
}

.btn.logout:hover {
  background-color: #c0392b;
}

/* Product List */
.product-list {
  flex: 1.1;
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  max-height: 85vh;
}

.product-list h2 {
  margin-bottom: 1.5rem;
  color: #34495e;
  font-weight: 700;
  font-size: 1.8rem;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.product-item {
  border-bottom: 1px solid #e1e4ea;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.input-group {
  flex: 1 1 30%;
  min-width: 200px;
  display: flex;
  flex-direction: column;
}

.button-group {
  display: flex;
  gap: 1rem;
  flex: 1 1 100%;
  margin-top: 0.5rem;
}

.btn.update {
  background-color: #2ecc71;
  color: white;
}

.btn.update:hover {
  background-color: #27ae60;
}

.btn.delete {
  background-color: #e74c3c;
  color: white;
}

.btn.delete:hover {
  background-color: #c0392b;
}

/* Scrollbar for product list */
.product-list::-webkit-scrollbar {
  width: 8px;
}

.product-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 8px;
}

.product-list::-webkit-scrollbar-thumb {
  background-color: #bbb;
  border-radius: 8px;
}

@media (max-width: 900px) {
  .container {
    flex-direction: column;
  }

  .form-section,
  .product-list {
    width: 100%;
  }

  .product-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .input-group {
    width: 100%;
  }

  .button-group {
    justify-content: flex-start;
  }
}
</style>
