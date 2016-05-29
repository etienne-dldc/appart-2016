<template>
  <div id="app">
    <div v-if="!loaded">
      <p>Chargement...</p>
    </div>
    <div v-else>
      <div :class="getClassesForStep(0)">
        <home :users="users" :error="getUserError" :id="parentId"></home>
      </div>
      <div :class="getClassesForStep(1)">
        <deal></deal>
      </div>
      <div :class="getClassesForStep(2)">
        <yep-nope :yep="yep" :id="parentId"></yep-nope>
      </div>
      <div :class="getClassesForStep(3)">
        <partage :yep="yep" :parent-id="parentId"></partage>
      </div>
    </div>
  </div>
</template>

<script>
import Home from './components/Home';
import Deal from './components/Deal';
import YepNope from './components/YepNope';
import Partage from './components/Partage';
import url from 'url';
import { fromUser } from './services/api';
import 'gsap';
import _ from 'lodash';

export default {
  components: {
    Home,
    Deal,
    YepNope,
    Partage
  },
  data: () => {
    return {
      loaded: false,
      step: 0,
      steps: ['home', 'deal', 'yolo'],
      users: [],
      parentId: null,
      yep: true,
      getUserError: false
    }
  },
  ready: function () {
    let userId = url.parse(window.location.href).pathname;
    userId = userId.replace('/', '')
    if (userId.length > 0) {
      fromUser(userId).then((data) => {
        if (data && data.length > 0) {
          for (var i = 0; i < data.length; i++) {
            let user = data[i]
            user.prenom = _.escape(user.prenom)
          }
          this.users = data
          this.parentId = data[0].id
        }
        this.loaded = true
      })
      .catch((err) => {
        console.error(err);
        this.getUserError = {
          id: userId,
          error: err
        }
        this.loaded = true
      })
    } else {
      this.loaded = true
    }
  },
  methods: {
    nextStep: function () {
      if (this.step < this.steps.length) {
        this.step = this.step + 1
      }
    },
    prevStep: function () {
      if (this.step > 0) {
        this.step = this.step - 1
      }
    },
    getClassesForStep: function (forStep) {
      if (this.step === forStep) {
        return 'step current'
      } else
      if (forStep < this.step) {
        return 'step before'
      } else {
        return 'step after'
      }
    }
  },
  events: {
    'next-step': function () {
      this.nextStep()
    },
    'prev-step': function () {
      this.prevStep()
    },
    'yep-nope': function (val) {
      this.yep = val
    }
  }
};
</script>

<style>
html, body {
  height: 100%;
  font-size: 16px;
}

#app {
  height: 100%;
  font-family: "Roboto", Tahoma, sans-serif;
  background: #455A64;
  color: white;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}

.step {
  position: absolute;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  top: 0;
  left: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20px;
  display: flex;
  flex-direction: column;
  xalign-items: center;
  xjustify-content: center;

  transition-duration: .3s;
}

.step .content {
  width: 100%;
  max-width: 1000px;
  margin: auto;
}

.step .header {
  width: 100%;
  padding-top: 20px;
  padding-bottom: 20px;
}

.step .footer {
  width: 100%;
  align-self: flex-end;
  padding-top: 20px;
  padding-bottom: 20px;
}

.step.after {
  top: 100%;
}

.step.before {
  top: -100%;
}

.step h1 {
  font-size: 3rem;
  font-weight: 100;
  margin-bottom: 50px;
}

.step h2 {
  font-size: 2rem;
  font-weight: 100;
}

.step p {
  font-size: 1.2rem;
  line-height: 1.6;
  font-weight: 300;
}

.back-button {
  height: 100px;
  cursor: pointer;
  transition-duration: .2s;
  margin-bottom: 20px;
}
.back-button:hover {
  background: rgba(255, 255, 255, 0.05);
}

.back-button img {
  height: 50px;
  margin-top: 25px;
}

</style>
