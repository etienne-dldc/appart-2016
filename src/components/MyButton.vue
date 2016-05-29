<template>
  <button class="btn" :class="type" type="{{ form ? 'submit' : 'button' }}" @click="onClick()">{{ label }}</button>
</template>

<script>
export default {
  props: {
    label: String,
    type: {
      type: String,
      default: 'primary'
    },
    form: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    }
  },
  ready() {

  },
  methods: {
    onClick() {
      this.$emit('go')
    }
  }
};
</script>

<style scoped>
  .btn {
    border: 2px solid transparent;
    padding: 15px 20px;
    border-radius: 10px;
    background: #5C6BC0;
    color: white;
    font-family: Roboto, Tahola, sans-serif;
    font-size: 1.2rem;
    font-weight: 100;
    text-transform: uppercase;
    letter-spacing: 5px;
    cursor: pointer;

    transition-duration: .2s;
  }
  .btn:hover {
    border: 2px solid white;
  }
  .btn.danger {
    background: #E57373;
  }

  .btn + .btn {
    margin-left: 20px;
  }

</style>
