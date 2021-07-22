<template>
  <b-modal
    id="2fa-modal"
    ref="modal"
    centered
    no-close-on-backdrop
    no-close-on-esc
    hide-footer
    size="lg"
  >
    <template #modal-title>
      <h5><b-icon icon="person-plus" class="icon"/>Authentification 2 facteurs</h5>
    </template>
	  <b-img thumbnail fluid :src="qrcode" alt=""/>
	<!--
    <b-form @submit="onSubmit">
      <b-input-group class="login-input">
        <b-input-group-prepend is-text>
          <b-icon icon="person-fill"/>
        </b-input-group-prepend>
        <b-form-input id="login-input"
          v-model="name"
          placeholder="Entrez votre pseudo"
          required
        />
      </b-input-group>
    </b-form>
	<b-overlay :show="!active" no-wrap/>
	-->
  </b-modal>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: "TwoFactorPopup",
  
  data() {
    return {
      qrcode: null
    }
  },

  async mounted() {
    this.qrcode = await this.$axios.$post('/2fa/generate', { withCredentials: true });;
  }
});
</script>