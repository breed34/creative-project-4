<template>
  <div class="pixel-editor">
    <input id="image-name" v-model="imageName" placeholder="Image name">

    <div class="studio">
      <div class="tools">
        <input id="paint-tool" type="image" :src="this.paintBrushPath" value="Paint Tool" style='background-color: #5583D4'>
        <input id="erase-tool" type="image" :src="this.eraserPath" value="Erase Tool">
        <div id="color-display" style='background-color: #000000'></div>
        <select id="color-type">
          <option value="hex">Hex</option>
          <option value="rgba">RGBA</option>
        </select>
        <input id="color-value" placeholder="Color value" value="#000000">
      </div>
      <div>
        <canvas id="canvas" width="320" height="320"></canvas>
      </div>
    </div>

    <div class="collection-info">
      <input class="collection-name" v-model="collectionName" placeholder="Collection name">
      <input class="creator" v-model="collectionCreator" placeholder="Creator">
      <button @click="saveToCollection(), saveToImages()">Save to Collection</button>
    </div>


  </div>
</template>

<script>
import axios from 'axios';
import canvas from 'canvas';
export default {
  name: 'PixelEditor',
  data() {
    return {
      image: null,
      imageName: "",
      collectionCreator: "",
      collectionName: "",
      paintBrushPath: require("../assets/paint-brush.png"),
      eraserPath: require("../assets/eraser.png"),
    }
  },
  methods: {
    async saveToCollection() {
      if (this.imageName == "" || this.collectionName == "" || this.collectionCreator == "") {
        return;
      }
      var path = "/" + this.collectionCreator + "/" + this.collectionName + "/";
      try {
        await axios.post('/api/pixdesign', {
          imageName: this.imageName,
          imagePath: path + this.imageName + ".png",
          collectionName: this.collectionName,
          collectionCreator: this.collectionCreator,
        });
      }
      catch (error) {
        console.log(error);
      }
    },
    async saveToImages() {
      try {
        var canvas = document.getElementById('canvas');
        var data = canvas.toDataURL('image/png');
        data = data.split(';base64,').pop();
        var path = "/" + this.collectionCreator + "/" + this.collectionName + "/";
        await axios.post('/api/imagelib', {
          fileName: this.imageName + ".png",
          filePath: path,
          fileData: data,
        });
      }
      catch (error) {
        console.log(error);
      }
    }
  },
  mounted() {
    // Canvas script
    let background = require("../assets/background.png");
    let currColor = "#000000";
    let colorType = "hex";
    let currTool = "Paint Tool";
    let coord = {x: 0, y: 0};
    let paint = false;
    const scale = 320 / 16;

    var colorTypePicker = document.getElementById('color-type');
    colorTypePicker.addEventListener("change", changeColorType);

    function changeColorType() {
      colorType = colorTypePicker.value;
    }

    var colorValueSetter = document.getElementById('color-value');
    var colorDisplay = document.getElementById('color-display')
    colorValueSetter.addEventListener("change", changeCurrColor);

    function changeCurrColor() {
      currColor = colorValueSetter.value;
      if (colorType == 'hex') {
        colorDisplay.style.backgroundColor = currColor;
      }
      else {
        colorDisplay.style.backgroundColor = 'rgba(' + currColor + ')';
      }
    }

    var paintTool = document.getElementById('paint-tool');
    var eraseTool = document.getElementById('erase-tool');
    paintTool.addEventListener("click", changeCurrTool);
    eraseTool.addEventListener("click", changeCurrTool);

    function changeCurrTool(event) {
      currTool = event.target.value;
      event.target.style.backgroundColor = "#5583D4";
      if (currTool == "Paint Tool") {
        eraseTool.style.backgroundColor = "#7A98CD";
      }
      else {
        paintTool.style.backgroundColor = "#7A98CD";
      }
    }

    var canvas = document.getElementById("canvas");
    canvas.style.background = " url(" + background + ") no-repeat";
    canvas.addEventListener("mousedown", startPainting);
    canvas.addEventListener("mouseup", stopPainting);
    canvas.addEventListener("mousemove", sketch);
    var ctx = canvas.getContext("2d");

    function getPosition(event) {
      coord.x = event.clientX - canvas.offsetLeft + document.documentElement.scrollLeft;
      coord.y = event.clientY - canvas.offsetTop + document.documentElement.scrollTop;
    }

    function startPainting(event) {
      paint = true;
      getPosition(event);
      sketch(event);
    }
    function stopPainting(){
      paint = false;
    }
    function sketch(event) {
      if (!paint) return;
      if (colorType == 'hex') {
        ctx.fillStyle = currColor;
      }
      else {
        ctx.fillStyle = 'rgba(' + currColor + ')';
      }
      ctx.beginPath();
      ctx.moveTo(coord.x, coord.y);
      var drawCoord = {
        x: Math.floor(coord.x / scale) * scale,
        y: Math.floor(coord.y / scale) * scale
      }
      getPosition(event);
      if (currTool == "Paint Tool") {
        ctx.rect(drawCoord.x, drawCoord.y, scale, scale);
        ctx.fill();
      }
      else {
        ctx.clearRect(drawCoord.x, drawCoord.y, scale, scale);
      }
    }
  },
}
</script>

<style scoped>
  .pixel-editor {
    margin: auto;
    display: flex;
    flex-wrap: wrap;
    width: 60%;
  }
  .studio {
    display: flex;
    justify-content: center;
    margin: auto;
  }
  .tools {
    width: 70px;
    margin-right: 10px;
  }
  .color-picker {
    display: flex;
    flex-wrap: wrap;
  }
  .collection-info {
    margin: 20px auto;
  }
  .collection-info * {
    font-size: 20px;
  }
  .creator {
    width: 160px;
  }
  #color-display {
    width: 100%;
    height: 70px;
    border: 1px solid black;
  }
  #image-name {
    text-align: center;
    display: block;
    margin: 20px 20%;
    font-size: 20px;
    width: 60%;
  }
  #canvas {
    display: block;
    margin: 0;
  }
  #paint-tool,
  #erase-tool {
    background-color: #7A98CD;
    padding: 5px;
    width: 100%;
    margin-bottom: 5px;
    border: 3px solid black;
  }
  #color-type {
    width: 100%;
  }
  #color-value {
    width: 100%;
  }

</style>
