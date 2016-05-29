<template>
  <div class="back-button header" @click="prevStep">
    <img :src="prevIcon" alt="" />
  </div>
  <div class="content">
    <div v-if="yep">
      <h1>Super !</h1>
      <p>
        Envoi-moi un snap : <b>tw.ik</b>. <br />
        Tu peux aussi m'envoyer un mail si t'es kéblo en 2014 : <b>etienne.dldc@outlook.fr</b>.
      </p>
      <p v-if="id">Et pense à noter le code <span class="id-code">{{{ id }}}</span> quelque part ;)</p>
      <h1>Ton plan est un peu pourri ?</h1>
      <p>
        Pas grave, envoie quand même un snap et partage ce site histoire d’avoir quand même une chance d'être invité à l'apéro.
      </p>
    </div>
    <div v-else>
      <h1 v-else>Pas grave</h1>
      <p>Tu peux tout de même partager cette page, si une personne à qui tu partages me trouve un appart, tu seras invité à l'apéro.</p>
    </div>
    <p>Pour obtenir ton lien de partage clique sur le bouton <span class="id-code">YEAH !</span> ci-dessous et rempli le formulaire.</p>
    <div class="partage-button">
      <my-button label="Yeah !" @go="nextStep"></my-button>
    </div>
  </div>
</template>

<script>
import MyButton from './MyButton';
import prevIcon from '../assets/prev.svg';

export default {
  components: {
    MyButton
  },
  props: ['yep', 'id'],
  data: () => {
    return {
      prevIcon
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
  .partage-button {
    margin-top: 30px;
    margin-bottom: 60px;
  }

</style>
