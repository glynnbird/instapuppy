
Vue.use(VueMaterial.default)

var getPresignedURL = function(content_type, callback) {
  $.ajax({
    type: 'POST',
    url: apibase + 'upload',
    data: JSON.stringify({content_type: content_type}),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    error: function(e) {
      console.log('ajax error', e);
      callback(true, null);
    },
    success: function(d) {
      console.log('ajax success', d)
      callback(null, d)
    }
  });
}

// make an HTTP PUT, writing the file's contents to object storage
var upload = function(f, content_type, url, callback) {
  var reader = new FileReader();
  reader.onload = function(event) {
    $.ajax({
      type: 'PUT',
      url: url,
      data: reader.result,
      contentType: content_type,
      processData: false,
      error: function(e) {
        callback(e, null);
      },
      success: function(d) {
        callback(null, d)
      }
    });
  }
  reader.readAsArrayBuffer(f)
}


var onDragOver = function(ev) {
  ev.preventDefault();
  $('#drop_zone').addClass('ondrag')
}

var onDragLeave = function(ev) {
  ev.preventDefault();
  $('#drop_zone').removeClass('ondrag')
}

// called when a file is dropped in the drop zone
var drop_handler = function (ev) {
  ev.preventDefault();
  $('#drop_zone').removeClass('ondrag')
  var f = ev.dataTransfer.files[0];
  console.log(f)
  $('#status').html('')
  $('#status').append('Preparing to upload file<br>')
  $('#status').append('* filename: ' + f.name + '<br>')
  $('#status').append('* content-type: ' + f.type + '<br>')
  $('#status').append('* content-length: ' + f.size + '<br>')
  $('#status').append('Getting pre-signed upload URL from IBM Cloud Functions<br>')
  getPresignedURL(f.type, function(err, presigned) {
    if (err) {
      return console.log('error - could not get URL')
    }
    var url = presigned.url
    $('#status').append('Uploading to IBM Cloud Object Storage<br>')
    upload(f, f.type, presigned.url, function(err, data) {
      if (err) {
        $('#status').append('Upload error<br>')
      } else {
        $('#status').append('Upload Complete<br>')
      }
    })
  });
}

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