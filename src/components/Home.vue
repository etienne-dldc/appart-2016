<template>
  <div class="content">
    <h1>Je cherche un appart à Paris, une idée ?</h1>
    <p v-if="error" class="user-error">Oops, je ne trouve rien qui correspond à <span class="id-code">{{{ error.id }}}</span>, t'es sùr de l'URL ?</p>
    <p>{{{ invitText }}}</p>
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
  props: ['users', 'error'],
  computed: {
    invitText: function () {
      if (this.users.length == 0) {
        return "Si je trouve un appart grâce à toi, je t'invite à venir prendre l'apéro dans mon nouveau chez moi."
      }
      var result = "Si je trouve un appart grâce à toi, je t'invite à venir prendre l'apéro dans mon nouveau chez moi et j'invite aussi ";
      var joins = [
        'ainsi que ',
        'et également ',
        `j'invite aussi `
      ];
      var joinIndex = 0
      for (var i = 0; i < this.users.length; i++) {
        var user = this.users[i]
        if (i === 0) {
          result += `<b>${user.prenom}</b> qui t'a partagé ce lien `
        } else {
          var prevUser = this.users[i-1]
          result += `<b>${user.prenom}</b> car c'est ${user.gender == 'mec' ? 'lui' : 'elle'} qui a partagé ce site à <b>${prevUser.prenom}</b> `
        }
        if (i === this.users.length-1) {
          result += `et enfin je serai là aussi parce que c'est moi qui ai partagé ce site à <b>${this.users[i].prenom}</b>, et puis c'est mon appart après tout...`
        } else {
          result += joins[joinIndex]
          joinIndex = (joinIndex + 1) % joins.length
        }
      }
      return result
    }
  },
  methods: {
    nextStep: function () {
      this.$dispatch('next-step')
    },
    prevStep: function () {
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
