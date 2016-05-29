<template>
  <div class="back-button header" @click="prevStep">
    <img :src="prevIcon" alt="" />
  </div>
  <div class="content">
    <h1>Partage, c’est gratuit !</h1>
    <p>
      <span v-if="yep">Ton plan est un peu moisi mais tu veux quand même participer à cet apéro ?</span>
      <span v-else>T’as pas de plan mais tu veux quand même participer à cet apéro ?</span>
      Pas de problème, file-moi ton prénom et ton snap<span class="partage-info">(pas de panique, ton snap ne sera pas publié <span class="tooltip">ni vendu à Facebook<span class="tooltip-content">... qui l'a probablement déjà.</span></span>)</span>, clique sur le gros bouton (juste là en dessous) et partage le lien qui s'affiche.
      <p class="partage-ps">J'ai aussi besoin de savoir si t'es un mec ou une meuf histoire de savoir si je dois mettre "il" ou "elle".<br /><span class="tooltip">Mais bon, tu peux mentir si ça te fait plaisir,<span class="tooltip-content">Hop là, petit alexandrin OKLM</span></span> j'irai pas vérifier...</p>
      <p>Si je trouve un appart grâce à une des personnes à qui tu as partagé, tu seras invité à l'apéro.</p>
    </p>
    <p class="partage-error" v-if="error">Oops, ca à foiré :/</p>
    <div class="partage-content">
      <div v-if="link == null && formLoad == false">
        <form method="post" @submit.prevent="validateForm" autocomplete="off">
          <input required class="form-item" type="text" name="prenom" v-model="prenom" placeholder="Prénom">
          <input required class="form-item" type="text" name="contact" autocomplete="nope" autocorrect="off" autocapitalize="off" spellcheck="false" v-model="contact" placeholder="Snap ou mail">
          <div class="gender-select form-item">
            <label>
              <input required type="radio" name="gender" value="mec" v-model="gender">
              <span>Mec</span>
            </label>
            <label>
              <input required type="radio" name="gender" value="meuf" v-model="gender">
              <span>Meuf</span>
            </label>
          </div>
          <div class="form-item">
            <my-button label="Apéro" :form="true"></my-button>
          </div>
        </form>
      </div>
      <div v-if="formLoad">
        <p>Envoi en cours...</p>
      </div>
      <div v-show="link !== null && formLoad == false">
        <p v-show="user && user.exist" class="partage-result-info">Tu existes déjà dans la base de donnée.</p>
        <div>
          <span class="your-link">Voilà ton lien maggle : </span>
          <p class="share-link">
            {{ link }}
            <span class="copy-button" v-el:copy-btn>
              <img v-show="!copied" :src="copyIcon" alt="" class="copy" />
              <img v-else :src="checkIcon" alt="" />
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MyButton from './MyButton';
import prevIcon from '../assets/prev.svg';
import copyIcon from '../assets/copy.svg';
import checkIcon from '../assets/check.svg';
import { postUser } from '../services/api';
import url from 'url';
import Clipboard from 'clipboard';

export default {
  components: {
    MyButton
  },
  props: ['yep', 'parent-id'],
  data: () => {
    return {
      prevIcon,
      copyIcon,
      checkIcon,
      link: null,
      user: null,
      prenom: "",
      contact: "",
      gender: "",
      formLoad: false,
      error: false,
      linkClipboard: null,
      copied: false,
      copiedTimer: null
    }
  },
  ready: function () {
    this.linkClipboard = new Clipboard(this.$els.copyBtn, {
      text: (trigger) => {
        return this.link
      }
    });
    this.linkClipboard.on('success', (e) => {
      this.showCopied()
  });
  },
  beforeDestroy: function () {
    if (this.linkClipboard) {
      this.linkClipboard.destroy();
    }
  },
  methods: {
    nextStep: function () {
      this.$dispatch('next-step')
    },
    prevStep: function () {
      this.$dispatch('prev-step')
    },
    showCopied: function () {
      if (this.copiedTimer) {
        clearTimeout(this.copiedTimer)
      }
      this.copied = true
      this.copiedTimer = setTimeout(() => {
        this.copied = false
      }, 1000);
    },
    validateForm: function () {
      this.formLoad = true
      this.error = false
      postUser({
        prenom: this.prenom,
        contact: this.contact,
        parent: this.parentId,
        gender: this.gender
      }).then(result => {
        this.formLoad = false
        if (result && result.id) {
          this.user = result
          let parsed = url.parse(window.location.href);
          //this.link = `http://appart.etienne-dldc.me/${result.id}`
          this.link = `http://${parsed.host}/${result.id}`
          console.log(result)
        } else {
          this.error = true
        }
      })
      .catch((err) => {
        console.log('Oops')
        console.error(err);
        this.formLoad = false
        this.error = true
      })
    }
  }
};
</script>

<style media="screen">
  .step .partage-info {
    font-style: italic;
    font-weight: 200;
  }

  .step form {

  }

  .step form .btn {
    vertical-align: middle;
  }

  .step input, .step select {
    margin: 0;
    vertical-align: middle;
    border: 2px solid transparent;
    padding: 15px 20px;
    border-radius: 10px;
    background: white;
    margin-right: 20px;
    color: #263238;
    font-family: Roboto, Tahola, sans-serif;
    font-size: 1.2rem;
    font-weight: 100;
    display: inline-block;

    transition-duration: .2s;
  }

  .your-link {
    font-size: 1.3rem;
    font-weight: 100;
    margin-right: 20px;
    vertical-align: middle;
    display: inline-block;
    margin-bottom: 10px;
    margin-top: 10px;
  }

  p.share-link {
    vertical-align: middle;
    display: inline-block;
    margin: 0;
    padding: 15px 20px;
    padding-right: 90px;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    background: white;
    margin-right: 0px;
    color: #263238;
    font-family: Roboto, Tahola, sans-serif;
    font-weight: 100;
  }

  .share-link a {
    color: inherit;
    text-decoration: none;
  }

  .copy-button {
    vertical-align: middle;
    position: absolute;
    display: inline-block;
    top: 0;
    bottom: 0;
    right: 0;
    border: 2px solid transparent;
    padding: 15px 20px;
    border-radius: 0 10px 10px 0;
    background: white;
    color: #263238;
    background: #FAFAFA;
    font-family: Roboto, Tahola, sans-serif;
    font-size: 1.2rem;
    cursor: pointer;

    transition-duration: .3;
  }
  .copy-button:hover {
    background: #EEEEEE;
  }

  .copy-button img.copy {
    margin-top: 4px;
    margin-bottom: -4px;
  }

  .step input:active, .step input:focus {
    border: 2px solid #263238;
  }

  .partage-content {
    margin-top: 20px;
  }

  .partage-error {
    background: #E57373;
    margin: auto;
    display: inline-block;
    padding: 5px 15px;
    border-radius: 10px;
  }

  .partage-result-info {
    background: #64B5F6;
    margin: auto;
    display: inline-block;
    padding: 5px 15px;
    border-radius: 10px;
    margin-bottom: 10px;
  }

  .gender-select{
    display: inline-block;
    margin-right: 20px;
  }

  .gender-select label input {
    display: none;
  }

  .gender-select label span {
    margin: 0;
    vertical-align: middle;
    border: 2px solid transparent;
    padding: 15px 20px;
    border-radius: 0;
    background: white;
    margin-right: -4px;
    color: #263238;
    font-family: Roboto, Tahola, sans-serif;
    font-size: 1.2rem;
    font-weight: 100;
    display: inline-block;
    cursor: pointer;

    transition-duration: .2s;
  }

  .gender-select label:first-child span {
    border-radius: 10px 0 0 10px;
  }

  .gender-select label:last-child span {
    border-radius: 0 10px 10px 0;
  }

  .gender-select label input:checked + span {
    background: #5C6BC0;
    color: white;
    font-weight: 400;
  }

  .step form .form-item {
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 20px;
  }

  .tooltip {
    display: inline-block;
    position: relative;
  }

  .tooltip:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .tooltip .tooltip-content {
    transform: translate(-50%, -50%);
    position: absolute;
    opacity: 0;
    background: rgba(0, 0, 0, 0.9);
    left: 50%;
    top: 0;
    width: 250px;
    padding: 5px;
    border-radius: 5px;
    font-size: 1rem;
    display: block;

    transition-duration: .3s;
  }
  .tooltip:hover .tooltip-content {
    opacity: 1;
    transform: translate(-50%, -110%);
  }

  p.partage-ps {
    font-style: italic;
    font-weight: 100;
  }

</style>
