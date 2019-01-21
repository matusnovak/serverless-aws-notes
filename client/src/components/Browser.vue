<template>
  <div class="directories">
    <ul v-if="loaded && directories.length !== 0">
      <li v-for="directory in directories" :key="directory">
        <directory :prefix="prefix" :directory="directory" v-on:select="onSelect"/>
      </li>
    </ul>
    <p v-if="!loaded">Loading...</p>
    <p v-if="loaded && !create && directories.length === 0">No directories... <a @click="onCreate" href="">Create?</a></p>
    <p v-if="loaded && !create && directories.length !== 0"><a @click="onCreate" href=""><svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></a></p>
    <b-form v-if="create" v-on:submit.prevent="onSubmit">
      <b-input-group>
        <b-form-input ref="form"
                      @blur.native="onHide"
                      type="text"
                      v-model="newDirectory"
                      required
                      :disabled="creating"
                      placeholder="Directory name">
        </b-form-input>
      </b-input-group>
    </b-form>
  </div>
</template>

<script>
import cookies from 'browser-cookies'
import Directory from './Directory'

export default {
  data() {
    return {
      newDirectory: '',
      loaded: false,
      create: false,
      creating: false,
      directories: []
    }
  },
  mounted() {
		this.$nextTick(() => {
      this.fetch()
    })
  },
  props: {
    prefix: {
      type: String,
      required: true
    }
  },
  methods: {
    fetch() {
      const config = {
        headers: {
          'Authorization': 'Bearer ' + cookies.get('jwt')
        }
      }
      this.$http.get(`production/rest/note/${this.prefix}`, config).then(response => {
        this.directories = response.data
      }).finally(() => {
        this.loaded = true
      })
    },
    onCreate(evt) {
      evt.preventDefault()
      this.create = true
      this.$nextTick(() => {
        this.$refs.form.$el.focus()
      })
    },
    onSubmit(evt) {
      evt.preventDefault()
      this.creating = true

      const config = {
        headers: {
          'Authorization': 'Bearer ' + cookies.get('jwt')
        }
      }
      const data = {
        name: this.newDirectory
      }
      this.$http.post(`production/rest/note/${this.prefix}`, data, config).then(response => {
        this.directories.push(response.data.name)
      }).finally(() => {
        this.creating = false
        this.newDirectory = ''
        this.create = false
      })
    },
    onHide() {
      this.create = false
    },
    onSelect(directory, file) {
      this.$emit('select', this.prefix, directory, file)
    }
  },
  components: {
    Directory
  }
}
</script>

<style scoped>
.icon {
  margin-right: 0.1rem;
  height: 1.2rem;
}
.icon:not(:hover) {
  color: rgb(33, 37, 41);
}
.directories > ul {
  list-style: none;
  padding-left: 0;
  margin-bottom: 0;
}
</style>
