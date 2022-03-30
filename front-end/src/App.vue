<template>
  <div id="app">
    <div class="navbar">
      <router-link class="logo" to="/">
        <div><img src="@/assets/logo.png"></div>
      </router-link>
      <router-link  class="link" to="/">
        <div><p>Home</P></div>
      </router-link>
      <router-link class="link" to="/editor">
        <div><p>Editor</p></div>
      </router-link>
    </div>

    <router-view/>

    <div class="footer">
      <p>Created 24 February 2022</p>
      <a href="https://github.com/breed34/creative-project-4" target="_blank">Git Repository</a>
    </div>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  font-family: sans-serif;
}
.navbar .link.router-link-exact-active  {
  background-color: #7A98CD;
}
.navbar {
  display: grid;
  grid-template-columns: 4fr 1fr 1fr;
  background-color: #4E76BC;
  border-bottom: 5px solid #0A100D;
}
.navbar div {
  padding: 10px;
}
.logo img {
  width: 350px;
}
.link {
  text-align: center;
  font-size: 28px;
  padding-top: 30px !important;
}
.navbar a,
.navbar a:active
.navbar a:hover
.navbar a:visited {
  text-decoration: none;
  color: #0A100D;
}
.link:hover {
  background-color: #6B8DC7;
}
.footer {
  text-align: center;
  padding-top: 40px;
  padding-bottom: 80px;
  background-color: #43474D;
  color: #D5D7DB;
  line-height: 1.5;
}
.footer a,
.footer a:hover,
.footer a:active,
.footer a:visited {
  text-decoration: none;
}
.footer a,
.footer a:visited {
  color: inherit;
}
.footer a:hover {
  color: #ACACAD;
}
.footer a:active {
  color: #E6E7E8;
}

</style>
