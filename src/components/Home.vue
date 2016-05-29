<template>
  <div class="content">
    <h1>Je cherche un appart à Paris, une idée ?</h1>
    <p v-if="error" class="user-error">Oops, je ne trouve rien qui correspond à <span class="id-code">{{{ error.id }}}</span>, t'es sùr de l'URL ?</p>
    <p>Si je trouve un appart grâce à toi, je t'invite à venir prendre l'apéro dans mon nouveau chez moi.</p>
    <p v-if="invitText">{{{ invitText }}}</p>
    <!-- <p v-if="users.length > 0">
      Et puis tu vois le code <span class="id-code">{{{ id }}}</span> dans l'url ? C'est le code de partage de <b>{{{ users[0].prenom }}}</b> et comme c'est grâce à lui que tu a trouvé ce site si tu me trouve un appart je l'invite aussi.
    </p> -->
    <h2>Deal ?</h2>
    <div class="deal-button">
      <my-button label="Deal !" @go="nextStep"></my-button>
    </div>
  </div>
</template>

<script>
import MyButton from './MyButton';

export default {
  components: {
    MyButton
  },
  props: ['users', 'error', 'id'],
  computed: {
    invitText() {
      if (this.users.length == 0) {
        return null
      }
      var result = "<p></p>";
      var joins = [
        `Et puis j'inviterai aussi`,
        `J'inviterai également`,
        `J'inviterai aussi `
      ];
      var joinIndex = 0
      for (var i = 0; i < this.users.length; i++) {
        var user = this.users[i]
        if (i === 0) {
          result += `<p>Et comme c'est <b>${this.users[0].prenom}</b> qui t'as partagé ce site, si tu m'aide, je l'invite aussi !</p>`
        } else {
          var prevUser = this.users[i-1]
          result += `<p>${joins[joinIndex]} <b>${user.prenom}</b> car c'est ${user.gender == 'mec' ? 'lui' : 'elle'} qui a partagé ce site à <b>${prevUser.prenom}</b>.</p>`
        }
        joinIndex = (joinIndex + 1) % joins.length
        // if (i === this.users.length-1) {
        //   result += `et enfin je serai là aussi parce que c'est moi qui ai partagé ce site à <b>${this.users[i].prenom}</b>, et puis c'est mon appart après tout...`
        // } else {
        //   result += joins[joinIndex]
        // }
      }
      return result
    }
  },
  methods: {
    nextStep() {
      this.$dispatch('next-step')
    },
    prevStep() {
      this.$dispatch('prev-step')
    }
  }
};
</script>

<style media="screen">
  .deal-button {
    margin-top: 40px;
  }

  p.user-error {
    background: #E57373;
    margin: auto;
    display: inline-block;
    padding: 5px 15px;
    border-radius: 10px;
    font-size: 1rem;
  }

  .id-code {
    background: #263238;
    margin: auto;
    display: inline-block;
    padding: 0 7px;
    margin-left: 5px;
    margin-right: 5px;
    border-radius: 5px;
  }
</style>
