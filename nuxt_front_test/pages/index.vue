<template>
  <div id="page">
    <LoginPopup v-if="!user"/>
    <LoggedPopup v-else :user="user"/>
    <NameForm v-if="user" :user="user"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import LoginPopup from '../components/LoginPopup.vue';
import LoggedPopup from '../components/LoggedPopup.vue';
import NameForm from '../components/NameForm.vue';

export default Vue.extend({
  name: "index",

  components: {
    LoginPopup,
    LoggedPopup,
    NameForm
  },

  data() {
    return {
      user: null
    }
  },

  async asyncData({ $axios }) {
    let user = null;
    try {
      user = await $axios.$get('/authentication/', { withCredentials: true });
    } catch (error) {
      console.error(`Get user ${error}`);
    }
    return {
      user: user
    }
  }

})
</script>
