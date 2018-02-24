
Vue.use(VueMaterial.default)

var app = new Vue({
  el: '#app',
  data: {
    mode: '',
    register: {
      username:'',
      password1:'',
      password2:''
    },
    login: {
      username:'',
      password:''
    },
    menuVisible: false,
    title: 'InstaPuppy'
  }
})