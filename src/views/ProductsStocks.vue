<template>
  <div class="container">
    <!-- Left: Form -->
    <div class="form-section">
      <h2>Add New Product</h2>
      <label>Product Name</label>
      <input v-model="name" placeholder="Product Name" />

      <label>Quantity</label>
      <input v-model.number="quantity" type="number" placeholder="Quantity" />

      <label>Price</label>
      <input v-model.number="price" type="number" placeholder="Price" />

      <label>Product Image</label>
      <input type="file" @change="handleFileUpload" />

      <button @click="addProduct">Add Product</button>
      <button class="logout" @click="logout">Logout</button>
    </div>

    <!-- Right: Product List -->
    <div class="product-list">
      <h2>Product List</h2>
      <ul>
        <li v-for="product in products" :key="product.id">
          <label>Product Name</label>
          <input v-model="product.name" />

          <label>Quantity</label>
          <input v-model.number="product.quantity" type="number" />

          <label>Price</label>
          <input v-model.number="product.price" type="number" />

          <div v-if="product.imageUrl">
            <img :src="product.imageUrl" alt="Product" class="product-img" />
          </div>

          <button @click="updateProduct(product)">Update</button>
          <button @click="deleteProduct(product.id)">Delete</button>
        </li>
      </ul>
    </div>
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
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage'
import { signOut } from 'firebase/auth'
import { db, auth, storage } from '../firebase'
import { useRouter } from 'vue-router'

const name = ref('')
const quantity = ref(0)
const price = ref(0)
const imageFile = ref(null)
const products = ref([])
const router = useRouter()

const handleFileUpload = (event) => {
  imageFile.value = event.target.files[0]
}

const addProduct = async () => {
  if (!name.value || quantity.value < 0 || price.value < 0) {
    alert('Enter valid product details.')
    return
  }

  let imageUrl = ''
  if (imageFile.value) {
    const fileRef = storageRef(storage, `product-images/${imageFile.value.name}-${Date.now()}`)
    await uploadBytes(fileRef, imageFile.value)
    imageUrl = await getDownloadURL(fileRef)
  }

  await addDoc(collection(db, 'products'), {
    name: name.value,
    quantity: quantity.value,
    price: price.value,
    imageUrl: imageUrl
  })

  name.value = ''
  quantity.value = 0
  price.value = 0
  imageFile.value = null
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
    name: product.name,
    quantity: product.quantity,
    price: product.price
  })
  alert('Product updated!')
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
.container {
  display: flex;
  justify-content: space-between;
  padding: 20px;
}

.form-section {
  width: 45%;
  display: flex;
  flex-direction: column;
}

.product-list {
  width: 50%;
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
}

input {
  margin-bottom: 10px;
  padding: 6px;
  width: 100%;
}

button {
  margin-top: 8px;
  margin-right: 5px;
  padding: 6px 10px;
}

.logout {
  background-color: red;
  color: white;
  border: none;
}

.product-img {
  max-width: 100px;
  margin: 10px 0;
}
</style>
