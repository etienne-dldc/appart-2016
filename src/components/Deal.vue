<template>
  <div class="back-button header" @click="prevStep">
    <img :src="prevIcon" alt="" />
  </div>
  <div class="content">
    <h1>OK, t'as un plan pour un appart ou une coloc sur Paris ?</h1>
    <div class="yep-nope-buttons">
      <my-button label="Yep" @go="yepNope(true)"></my-button>
      <my-button label="Nope" type="danger" @go="yepNope(false)"></my-button>
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
    },
    yepNope: function (val) {
      this.$dispatch('next-step')
      this.$dispatch('yep-nope', val)
    }
  }
};
</script>

<style media="screen">
  .yep-nope-buttons {
    margin-top: 20px;
    margin-bottom: 60px;
  }
</style>
