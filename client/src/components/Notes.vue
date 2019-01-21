<template>
  <b-row>
    <b-col lg="3">
      <h5>Private notes</h5>
      <hr/>
      <browser prefix="user" class="pb-3" v-on:select="onSelect"/>
      <h5>Shared notes</h5>
      <hr/>
      <browser prefix="shared" v-on:select="onSelect"/>
    </b-col>
    <b-col lg="9">
      <editor ref="editor" :class="loading ? 'editor loading' : 'editor'" v-on:save="onSave"/>
    </b-col>
  </b-row>
</template>

<script>
import cookies from 'browser-cookies'
import Editor from './Editor'
import Browser from './Browser'

export default {
  data() {
    return {
      loading: false,
      prefix: '',
      directory: '',
      file: ''
    }
  },
  methods: {
    onSelect(prefix, directory, file) {
      this.prefix = prefix
      this.directory = directory
      this.file = file
      this.fetch()
    },
    fetch() {
      this.loading = true
      const config = {
        headers: {
          'Authorization': 'Bearer ' + cookies.get('jwt')
        }
      }
      this.$http.get(`production/rest/note/${this.prefix}/${encodeURIComponent(this.directory)}/${encodeURIComponent(this.file.split('.')[0])}`, config).then(response => {
        this.$refs.editor.setContent(response.data.content)
      }).finally(() => {
        this.loading = false
      })
    },
    onSave(content) {
      console.log('Saving content:', content)
      this.loading = true
      const config = {
        headers: {
          'Authorization': 'Bearer ' + cookies.get('jwt')
        }
      }
      const data = {
        content: content
      }
      this.$http.put(`production/rest/note/${this.prefix}/${encodeURIComponent(this.directory)}/${encodeURIComponent(this.file.split('.')[0])}`, data, config).then(() => {
      }).finally(() => {
        this.loading = false
      })
    }
  },
  components: {
    Editor,
    Browser
  }
}
</script>

<style scoped>
.editor {
  opacity: 1.0;
  -webkit-transition: opacity 0.5s ease-in-out;
  -moz-transition: opacity 0.5s ease-in-out;
  transition: opacity 0.5s ease-in-out;
}
.editor.loading {
  opacity: 0.3;
}
</style>
