<template>
  <div>
    <h1>Welcome Home</h1>
    <button @click="logout">Logout</button>
  </div>
</template>

<script setup>
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = async () => {
  await signOut(auth)
  router.push('/login')
}
</script>
