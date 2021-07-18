<template>
  <div id="page">
    <LoginPopup v-if="!user"/>
    <LoggedPopup v-else :user="user"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import LoginPopup from '../components/LoginPopup.vue';
import LoggedPopup from '../components/LoggedPopup.vue';

export default Vue.extend({
  name: "index",

  components: {
    LoginPopup,
    LoggedPopup
  },

  data() {
    return {
      user: null
    }
  },

  async asyncData({ $axios }) {
    let user = null;
    try {
      user = await $axios.$get('http://localhost:8080/api/authentication/', { withCredentials: true });
    } catch (error) {
      console.error(`Get user ${error}`);
    }
    return {
      user: user
    }
  }

})
</script>
