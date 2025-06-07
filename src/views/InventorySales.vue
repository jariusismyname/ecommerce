<template>
  <div class="sales-report-container">
    <h2>Inventory Sales Report</h2>

    <table v-if="orders.length" class="sales-table">
      <thead>
        <tr>
          <th>Product Name</th>
          <th>Quantity Sold</th>
          <th>Price ($)</th>
          <th>Total ($)</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>{{ order.name }}</td>
          <td>{{ order.quantity }}</td>
          <td>{{ order.price.toFixed(2) }}</td>
          <td>{{ order.total.toFixed(2) }}</td>
          <td>{{ formatDate(order.createdAt) }}</td>
        </tr>
      </tbody>
    </table>

    <p v-else>No sales have been made yet.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

const orders = ref([])

const fetchOrders = async () => {
  const snapshot = await getDocs(collection(db, 'orders'))
  orders.value = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

onMounted(() => {
  fetchOrders()
})

const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A'
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleString()
}
</script>

<style scoped>
body, html {
  height: 100%;
  margin: 0;
  display: flex;
  justify-content: center;  /* centers horizontally */
  align-items: center;      /* centers vertically */
  background: #f5f7fa;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.sales-report-container {
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f5f7fa;
  min-height: 100vh;
}

h2 {
  margin-bottom: 1.5rem;
  color: #2c3e50;
  text-align: center;
}

.sales-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.sales-table th,
.sales-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #eaeaea;
  text-align: left;
}

.sales-table th {
  background-color: #2ecc71;
  color: white;
  font-weight: 600;
}

.sales-table tbody tr:hover {
  background-color: #f0f8f4;
}
</style>
