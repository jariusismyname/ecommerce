<template>
  <div class="product-display-container">
    <h2>Products Overview</h2>

    <table v-if="products.length" class="product-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Quantity</th>
          <th>Price ($)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>{{ product.name }}</td>
          <td>{{ product.quantity }}</td>
          <td>{{ product.price.toFixed(2) }}</td>
        </tr>
      </tbody>
    </table>

    <p v-else>No products available.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

const products = ref([])

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

.product-table {
  width: 100%;
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
</style>
