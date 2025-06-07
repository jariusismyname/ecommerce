<template>
  <div class="inventory-container">
    <h2>Order Inventory</h2>
    <table>
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Date</th>
          <th>Items</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>{{ order.id }}</td>
          <td>{{ order.date }}</td>
          <td>
            <ul>
              <li v-for="item in order.items" :key="item.id">
                {{ item.name }} - Qty: {{ item.quantity }} - ₱{{ (item.price * item.quantity).toFixed(2) }}
              </li>
            </ul>
          </td>
          <td>₱{{ order.total.toFixed(2) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const orders = ref([])

onMounted(() => {
  const data = localStorage.getItem('orders')
  if (data) {
    orders.value = JSON.parse(data)
  }
})
</script>

<style scoped>
.inventory-container {
  padding: 2rem;
  font-family: Arial, sans-serif;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
}

th,
td {
  border: 1px solid #ddd;
  padding: 1rem;
  text-align: left;
}

thead {
  background-color: #3498db;
  color: white;
}
</style>
