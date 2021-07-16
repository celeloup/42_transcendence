<template>
  <div id="page">
    <LoginPopup v-if="!logged"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import LoginPopup from "../components/LoginPopup";

export default Vue.extend({
  name: "Layout",

  components: {
    LoginPopup
  },

  computed: {
    login() {
      return false;
    }
  }
})
</script>
