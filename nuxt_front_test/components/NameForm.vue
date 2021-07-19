<template>
  <b-modal
    id="mod-name-modal"
    centered
    no-close-on-backdrop
    no-close-on-esc
    hide-footer
    size="lg"
  >
    <template #modal-title>
      <h5><b-icon icon="person-plus" class="icon"/>Sélectionner votre pseudo</h5>
    </template>
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
  </b-modal>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue';
interface User {
  name: string
};

export default Vue.extend({
  name: "NameForm",

  props: {
    user: {
      type: Object,
      required: true
    } as PropOptions<User>
  },

  data() {
    return {
      active: true,
      name: this.user.name
    }
  },

  methods: {
    putUser(): Promise<User> {
      return new Promise(async (resolve, reject) => {
        const body = {
          name: this.name
        };
        try {
          const user = await this.$axios.$put('/users/me', body, { withCredentials: true });
          resolve(user);
        } catch (error) {
          console.error(`Change username ${error}`);
          reject();
        }
      });
    },

	  async onSubmit(event: Event) {
      this.active = false;
      event.preventDefault();
      try {
        const user = await this.putUser();
        this.$bvModal.msgBoxOk(
          `Bienvenue ${user.name}`,
          {
            size: 'sm',
            buttonSize: 'sm',
            okVariant: 'success',
            headerClass: 'p-2 border-bottom-0',
            footerClass: 'p-2 border-top-0',
            centered: true
          }
        ).then(() => {
          this.active = true;
        });
      } catch {
        this.$bvModal.msgBoxOk(
          "Erreur",
          {
            size: 'sm',
            buttonSize: 'sm',
            okVariant: 'danger',
            headerClass: 'p-2 border-bottom-0',
            footerClass: 'p-2 border-top-0',
            centered: true
          }
        );
        this.active = true;
      }
	  }
  }
});
</script>

<style scoped>

.icon {
  margin-right: 0.5rem;
}

.login-input {
  margin: 0.5rem 0;
}

</style>