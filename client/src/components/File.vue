<template>
  <div class="file">
    <b-link class="header" @click="onClick">
      <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path><line x1="16" y1="8" x2="2" y2="22"></line><line x1="17" y1="15" x2="9" y2="15"></line></svg>
      <span :class="active ? 'name active' : 'name'">{{filename}}</span>
    </b-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      filename: this.file.split('.')[0],
      active: false
    }
  },
  props: {
    prefix: {
      type: String,
      required: true
    },
    directory: {
      type: String,
      required: true
    },
    file: {
      type: String,
      required: true
    }
  },
  methods: {
    onClick(evt) {
      evt.preventDefault()
      this.$emit('select', this.file)
      this.setActive(true)
    },
    setActive(active) {
      this.active = active
    }
  }
}
</script>

<style scoped>
.icon {
  margin-right: 0.1rem;
  height: 1.2rem;
  opacity: 0.7;
}
.header {
  display: block;
  width: 100%;
}
.header:not(:hover) .name {
  color: rgb(33, 37, 41);
}
.header:not(:hover) .icon {
  color: rgb(33, 37, 41);
}
.name.active {
  color: #007BFF !important;
  font-weight: 600;
}
</style>
