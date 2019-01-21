<template>
  <custom-form :fields="fields" :submit="submit"/>
</template>

<script>
import CustomForm from './CustomForm'

export default {
  data() {
    return {
      fields: [
        {
          name: 'username',
          title: 'Username',
          type: 'text',
          placeholder: 'Your username here',
          default: ''
        },
        {
          name: 'password',
          title: 'Password',
          type: 'password',
          placeholder: 'Your password here',
          default: ''
        }
      ]
    }
  },
  methods: {
    submit(form) {
      return this.$http.post('production/rest/user/login', form).then(response => {
        this.$emit('submit', response.data)
      })
    }
  },
  components: {
    CustomForm
  }
}
</script>
