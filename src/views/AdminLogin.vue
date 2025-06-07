<template>
  <div>
    <h2>Admin Login</h2>
    <input v-model="adminPassword" type="password" placeholder="Enter Admin Password" />
    <button @click="adminLogin">Login</button>
    <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const adminPassword = ref('')
const errorMessage = ref('')
const router = useRouter()

const adminLogin = () => {
  if (adminPassword.value === 'connectedisme1234') {
    router.push('/products-stocks')
  } else {
    errorMessage.value = 'Incorrect admin password.'
  }
}
</script>
