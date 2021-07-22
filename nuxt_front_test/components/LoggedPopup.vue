<template>
  <b-modal
    visible
    centered
    no-close-on-backdrop
    no-close-on-esc
    hide-header
    hide-footer
    size="sm"
  >
    <h3 class="login-text">OK you're logged !
    </h3>
    <h3 class="login-text">
      <b-badge
        variant="dark"
        class="badge"
      >
		    {{user.name}}
	    </b-badge>
	  </h3>
    <p class="login-text">
      <b-button
        variant="primary"
        class="button"
        v-b-modal.mod-name-modal
      ><b-icon icon="gear" class="icon"/>Modifier pseudo</b-button>
    </p>
    <p class="login-text">
      <b-button
        variant="danger"
        class="button"
        v-on:click="logout"
      ><b-icon icon="door-open" class="icon"/>logout</b-button>
    </p>
  </b-modal>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue';
interface User {
  name: string
};

export default Vue.extend({
  name: "LoggedPopup",

  props: {
    user: {
      type: Object,
      required: true
    } as PropOptions<User>
  },

  methods: {
    async logout() {
      await this.$axios.$post('/authentication/log-out', { withCredentials: true })
      this.$emit('update:user', null);
    }
  }
});
</script>

<style scoped>

.icon {
  margin-right: 0.5rem;
}

.login-text {
  text-align: center;
}


</style>