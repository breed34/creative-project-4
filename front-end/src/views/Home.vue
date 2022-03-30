<template>
  <div class="home">
    <h1>Collections</h1>
    <div v-if="collections != null" class="collection-display">
      <div class="collection" v-for="collection in collections" :key="collection._id">
        <router-link :to="{ name: 'collection', params: { id: collection._id } }">
        <img v-if="collection.images[0] != null" :src='collection.images[0].path'>
        <div v-else class="placeholder"><p>No<br>Images</p></div>
        <h2>{{collection.name}}</h2>
        <p>{{collection.creator}}</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'HomeView',
  data() {
    return {
      collections: [],
    }
  },
  created() {
    this.getCollections();
  },
  methods: {
    async getCollections() {
      try {
        let response = await axios.get('/api/pixdesign');
        this.collections = response.data;
        return true;
      }
      catch (error) {
        console.log(error);
      }
    }
  }
}
</script>

<style scoped>
  .home {
    background-color: #E6E7E8;
    min-height: 800px;
    padding-bottom: 20px;
  }
  h1 {
    font-size: 50px;
    text-align: center;
    padding: 20px;
    background-color: #546A7B;
    color: #E6E7E8;
  }
  .collection-display {
    margin: 20px auto;
    width: 900px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    column-gap: 20px;
    row-gap: 20px;
  }
  .collection {
    text-align: center;
    line-height: 1.5;
    padding: 10px;
    background-color: #6B8DC7;
    border: 2px solid #0A100D;
  }
  .collection img,
  .placeholder {
    margin: auto;
    width: 150px;
    height: 150px;
    background-color: white;
    border: 1px solid #0A100D;
  }
  .collection a,
  .collection a:hover,
  .collection a:visited,
  .collection a:active {
    text-decoration: none;
    color: #0A100D;
  }
  .collection:hover {
    background-color: #7A98CD;
  }
  .placeholder p {
    padding-top: 20px;
    font-size: 30px;
  }
  .placeholder {
    margin-bottom: 10px;
  }
</style>
