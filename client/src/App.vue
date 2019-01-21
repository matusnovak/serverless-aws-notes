<template>
  <div id="app" class="h-100">
    <template v-if="loggedin">
      <b-navbar toggleable="md" type="light" variant="light" class="mb-3 border-bottom box-shadow navbar">
        <b-container>
          <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
          <b-navbar-brand @click="$router.push('/')">NavBar</b-navbar-brand>
          <b-collapse is-nav id="nav_collapse">

            <!--  <b-navbar-nav>
              <b-nav-item href="#">Link #1</b-nav-item>
              <b-nav-item href="#">Link #2</b-nav-item>
            </b-navbar-nav> -->

            <!-- Right aligned nav items -->
            <b-navbar-nav class="ml-auto">
              <b-nav-item-dropdown text="User" right>
                <b-dropdown-item @click="logout">Logout</b-dropdown-item>
              </b-nav-item-dropdown>
            </b-navbar-nav>
          </b-collapse>
        </b-container>
      </b-navbar>

      <b-container>
        <notes/>
      </b-container>
    </template>
    <template v-else>
      <b-container class="h-100">
        <b-row class="h-100 justify-content-md-center" align-v="center">
          <b-col xl="5" lg="6" md="7" cols="12">
            <b-card header="Login" header-tag="header">
              <form-login v-on:submit="onLogin"/>
            </b-card>
          </b-col>
        </b-row>
      </b-container>
    </template>
  </div>
</template>

<script>
import cookies from 'browser-cookies'
import Notes from './components/Notes'
import FormLogin from './components/FormLogin'

export default {
  name: 'app',
  data() {
    global.loggedin = !!cookies.get('jwt')
    return {
      loggedin: global.loggedin
    }
  },
  methods: {
    onLogin() {
      this.loggedin = true
      global.loggedin = true
    },
    logout() {
      this.$http.post('production/rest/user/logout', {}).then(() => {
        this.loggedin = false
        global.loggedin = false
      })
    }
  },
  mounted() {
		this.$nextTick(() => {
      global.dialogLogin = this.$refs.dialogLogin
    })
  },
  components: {
    Notes,
    FormLogin
  }
}
</script>

<style>
.navbar,
body {
  background: #F6F6F6;
}
.border-top {
  border-top: 1px solid #e5e5e5;
}
.border-bottom {
  border-bottom: 1px solid #e5e5e5;
}
.box-shadow {
  box-shadow: 0 .25rem .75rem rgba(0, 0, 0, .05);
}
</style>