<template>
  <div>
    <h2>Login</h2>
    <input v-model="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    <button @click="login">Login</button>

    <p>Don't have an account? <router-link to="/register">Register</router-link></p>

    <!-- Admin Login Button -->
    <p>Are you an admin? 
      <button @click="goToAdminLogin">Go to Admin Login</button>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'

const email = ref('')
const password = ref('')
const router = useRouter()

const login = async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
    router.push('/home')
  } catch (err) {
    alert(err.message)
  }
}

const goToAdminLogin = () => {
  router.push('/admin-login')
}
</script>
