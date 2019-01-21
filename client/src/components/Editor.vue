<template>
  <b-card>
    <quill-editor v-model="content" ref="quill" :options="options"/>
  </b-card>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

var toolbar = [
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'script': 'sub'}, { 'script': 'super' }],
  [{ 'color': [] }, { 'background': [] }, { 'align': [] }],
  ['clean'],
  ['save']
];

export default {
  data() {
    return {
      content: '',
      options: {
        modules: {
          toolbar: {
            container: toolbar,
            handlers: {
              save: this.onSave
            }
          }
        },
        placeholder: 'Compose an epic...',
        theme: 'snow'
      }
    }
  },
  methods: {
    setContent(content) {
      this.content = content
    },
    onSave() {
      this.$emit('save', this.content)
    }
  },
  components: {
    quillEditor
  }
}
</script>

<style>
.ql-toolbar {
  padding-top: 0 !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
  padding-bottom: 1rem !important;
  border-top: none !important;
  border-left: none !important;
  border-right: none !important;
  border-bottom: 1px solid #CCCCCC !important;
}
.ql-container {
  border: none !important;
}
.ql-editor {
  min-height: 200px;
  padding-bottom: 0 !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
  padding-top: 1rem !important;
}
.ql-editor.ql-blank::before {
  left: 0px !important;
}
.ql-save {
  background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItc2F2ZSI+PHBhdGggZD0iTTE5IDIxSDVhMiAyIDAgMCAxLTItMlY1YTIgMiAwIDAgMSAyLTJoMTFsNSA1djExYTIgMiAwIDAgMS0yIDJ6Ij48L3BhdGg+PHBvbHlsaW5lIHBvaW50cz0iMTcgMjEgMTcgMTMgNyAxMyA3IDIxIj48L3BvbHlsaW5lPjxwb2x5bGluZSBwb2ludHM9IjcgMyA3IDggMTUgOCI+PC9wb2x5bGluZT48L3N2Zz4=) !important;
  height: 24px !important;
  width: 24px !important;
  opacity: 0.6 !important;
}
</style>
