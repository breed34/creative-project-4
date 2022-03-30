<template>
  <div class="collection">
    <div class="collection-details">
      <button id="save" @click="saveChanges()">Save<br>Changes</button>
      <input id="collection-name" placeholder="Collection name" v-model='name'>
      <button id="delete-collection" @click="deleteCollection()">Delete<br>Collection</button>
    </div>
    <div class="image-gallery">
      <div class="image" v-for="image in images" :key="image._id">
        <h2>{{image.name}}</h2>
        <img :src="image.path">
        <button id="delete-image" @click="deleteImage(image.path), removeImage(image._id)">Delete</button>
      </div>
  </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'EditorView',
  data() {
    return {
      id: "",
      name: "",
      collection: null,
      imageId: null,
      images: [],
    }
  },
  created() {
    this.id = this.$route.params.id;
    this.getCollection();
  },
  methods: {
    async getCollection() {
      try {
        let response = await axios.get('/api/pixdesign/' + this.id);
        this.collection = response.data;
        this.images = this.collection.images;
        this.name = this.collection.name;
        return true;
      }
      catch (error) {
        console.log(error);
      }
    },
    async saveChanges() {
      try {
        await axios.put('/api/pixdesign/' + this.id, {
          name: this.name,
          images: this.images,
        })
      }
      catch (error) {
        console.log(error);
      }
      this.getCollection();
    },
    async removeImage(imageId) {
      console.log("in remove");
      try {
        await axios.delete('/api/pixdesign/' + this.id + '/'+ imageId);
      }
      catch(error) {
        console.log(error);
      }
      this.getCollection();
    },
    async deleteImage(imagePath) {
      try {
        await axios.delete('/api/imagelib' + imagePath);
      }
      catch (error) {
        console.log(error);
      }
      this.getCollection();
    },
    async deleteCollection() {
      console.log(this.images.length);
      if (this.images.length > 0) {
        for (let image of this.images) {
          try {
            await this.removeImage(image._id);
            await this.deleteImage(image.path);
          }
          catch (error) {
            console.log(error);
          }
        }
      }
      try {
        await axios.delete('/api/pixdesign/' + this.id);
      }
      catch (error) {
        console.log(error);
      }
    }
  }
}
</script>

<style scoped>
  .collection {
    background-color: #E6E7E8;
    padding: 5px;
    padding-bottom: 100px;
    min-height: 800px;
  }
  .collection-details {
    display: flex;
    margin: auto;
    margin-top: 10px;
    margin-bottom: 15px;
    justify-content: center;
  }
  #collection-name {
    font-size: 30px;
  }
  #collection-name,
  #save,
  #delete-collection {
    height: 40px;
  }
  #delete-image {
    height: 40px;
    width: 100px;
  }
  .image-gallery {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    width: 900px;
    column-gap: 20px;
    row-gap: 20px;
    margin: auto;
  }
  .image {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    padding: 10px;
    background-color: #6B8DC7;
    border: 3px solid black;
  }
  .image h2 {
    text-align: center;
    width: 100%;
    margin: 10px;
  }
  .image img {
    width: 200px;
    background-color: white;
    margin: 10px;
    border: 1px solid black;
  }
  .image button {
    margin: 10px auto;
    font-size: 20px;
  }
</style>
