<template>
  <div class="directory">
    <b-link class="header" @click="onExpand">
      <svg class="icon" v-if="!expanded" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg>
      <svg class="icon" v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="9" y1="14" x2="15" y2="14"></line></svg>
      <span class="name">{{directory}}</span>
    </b-link>
    <div class="notes" v-if="expanded">
      <p v-if="!loaded">Loading...</p>
      <ul class="files" v-if="loaded && files.length !== 0">
        <li v-for="file in files" :key="file">
          <file :prefix="prefix" :directory="directory" :file="file" v-on:select="onSelect"/>
        </li>
      </ul>
      <p v-if="loaded && !create && files.length === 0">No notes... <a @click="onCreate" href="">Create?</a></p>
      <p v-if="loaded && !create && files.length !== 0"><a @click="onCreate" href=""><svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></a></p>
      <b-form v-if="create" v-on:submit.prevent="onSubmit">
        <b-input-group>
          <b-form-input ref="form"
                        @blur.native="onHide"
                        type="text"
                        v-model="newFile"
                        required
                        :disabled="creating"
                        placeholder="Name here">
          </b-form-input>
        </b-input-group>
      </b-form>
    </div>
  </div>
</template>

<script>
import cookies from 'browser-cookies'
import File from './File'

export default {
  data() {
    return {
      expanded: false,
      loaded: false,
      files: [],
      create: false,
      newFile: ''
    }
  },
  props: {
    directory: {
      type: String,
      required: true
    },
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
      this.$http.get(`production/rest/note/${this.prefix}/${encodeURIComponent(this.directory)}`, config).then(response => {
        this.files = response.data
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
        name: this.newFile
      }
      this.$http.post(`production/rest/note/${this.prefix}/${encodeURIComponent(this.directory)}`, data, config).then(response => {
        this.files.push(response.data.name)
      }).finally(() => {
        this.creating = false
        this.newFile = ''
        this.create = false
      })
    },
    onHide() {
      this.create = false
    },
    onExpand(evt) {
      evt.preventDefault()
      this.expanded = !this.expanded

      if (this.expanded) {
        this.fetch()
      }
      else {
        this.files = []
        this.loaded = false
      }
    },
    onSelect(file) {
      this.$emit('select', this.directory, file)
    }
  },
  components: {
    File
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
.header > .icon {
  opacity: 0.7;
}
.directory {
  margin-bottom: 0.25rem;
}
.header {
  display: block;
  width: 100%;
}
.header > .name {
  font-weight: 600;
}
.header:not(:hover) .name {
  color: rgb(33, 37, 41);
}
.header:not(:hover) .icon {
  color: rgb(33, 37, 41);
}
.notes {
  padding-left: 1.6rem;
}
.notes > p {
  margin-bottom: 0;
}
ul.files {
  list-style: none;
  padding-left: 0;
}
</style>
