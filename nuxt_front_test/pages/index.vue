<template>
  <div id="page">
    <LoginPopup v-if="!user"/>
    <LoggedPopup v-else :user="user" v-on:update:user="user = $event"/>
    <NameForm v-if="user" :user="user" v-on:update:name="user.name = $event"/>
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

  async asyncData({ $axios, app }) {
    return {
      user: await $axios.$get('/authentication/', { withCredentials: true })
    }
  }

})
</script>
