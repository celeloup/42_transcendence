<template>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  async fetch() {
    const { $axios, app, store, redirect } = this.$nuxt.context;
	const code = this.$route.query.code
	let user = null;
	try {
		user = await $axios.$get(`/authentication/oauth?code=${code}`);
	} catch (e) {
		console.error(`Auth: ${e}`);
	}
	console.log(user)
  }
})
</script>
