<template>
  <div class="editor">
    <div class="app-wrapper">
      <PixelEditor />
    </div>
  </div>
</template>

<script>
import PixelEditor from "../components/PixelEditor.vue"
export default {
  name: 'EditorView',
  components: {
    PixelEditor
  }
}
</script>

<style scoped>
  .editor {
    background-color: #E6E7E8;
    padding-bottom: 50px;
  }
</style>
