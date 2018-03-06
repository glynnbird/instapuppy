
Vue.use(VueMaterial.default)

var app = new Vue({
  el: '#app',
  data: {
    cookie: '',
    userDisplayName: '',
    docs: [],
    mode: '',
    snackbar: false,
    snackbarMessage: '',
    register: {
      username:'',
      password1:'',
      password2:''
    },
    login: {
      username:'',
      password:''
    },
    upload: {
      name:'',
      descr:'',
      file:null
    },
    menuVisible: false,
    title: 'InstaPuppy'
  },
  mounted: function() {
    var jar = getCookies();
    console.log(jar)
    if (jar && jar.instapuppytoken) {
      this.cookie = jar.instapuppytoken
      console.log('verifiying', jar.instapuppytoken)
      ajax('verify', {cookie: this.cookie}, (err,data) => {
        if (!err) {
          this.mode = 'loggedin';
          this.userDisplayName = data.userDisplayName;
          this.loadHome()
        } else {
          this.mode = 'login'
        }
      })
    } else {
      this.mode = 'login'
    }
  },
  methods : {
    onLogin: function() {
      ajax('login', { username: this.login.username, password: this.login.password }, (err,data) => {
        if (!err) {
          document.cookie = 'instapuppytoken=' + data.cookie;
          app.cookie = data.cookie
          app.userDisplayName = data.userDisplayName
          app.mode = 'loggedin'
          app.loadHome()
        } else {
          app.login.snackbarMessage = 'Invalid username or password'
          app.login.snackbar = true
        }
      })
    },
    onLogout: function() {
      clearCookie('instapuppytoken')
      this.mode='login'
      this.docs = []
      this.cookie = ''
      this.userDisplayName = ''
    },
    onHome: function() {
      if (this.cookie) {
        app.mode = 'loggedin'
      } else {
        app.mode = 'login'
        this.loadHome()
      }
    },
    loadHome: function() {
      console.log('loadhome')
      ajax('mydocs', { cookie: this.cookie }, (err,data) => {
        if (!err) {
          app.docs = []
          for(var i in data.rows) {
            app.docs.push(data.rows[i].doc)
          }
        } 
      })
    }
  }

})