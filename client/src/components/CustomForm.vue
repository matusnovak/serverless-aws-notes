<template>
  <b-form @submit="onSubmit" @cancel="onCancel" novalidate>
    <b-form-group v-for="field in fields" :key="field.name" label="Username:">
      <b-form-input :id="'input-' + field.name"
                    :type="field.type"
                    v-model="form[field.name]"
                    required
                    placeholder="Enter a username"
                    @input="$v.form[field.name].$touch()"
                    :state="$v.form[field.name].$dirty ? !$v.form[field.name].$error : null"
                    :aria-describedby="field.name"/>
      <b-tooltip v-if="$v.form[field.name].$invalid" :target="'input-' + field.name" placement="bottom">
        {{getErrorFor(field.name)}}
      </b-tooltip>
    </b-form-group>

    <b-alert show variant="danger" dismissible v-if="!!message">{{message}}</b-alert>

    <div v-if="!!submit" class="text-center">
      <b-button type="submit" variant="primary">Submit</b-button>
    </div>
  </b-form>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from "vuelidate/lib/validators"

function definedAndFalse(value) {
  return value != undefined && !value
}

export default {
  data() {
    return {
      form: this.fields.reduce((obj, item) => {
        obj[item.name] = item.default || ''
        return obj
      }, {}),
      valid: this.fields.reduce((obj, item) => {
        obj[item.name] = item.validation || {required}
        return obj
      }, {}),
      message: ''
    }
  },
  mixins: [
    validationMixin
  ],
  validations() {
    return {
      form: this.valid
    }
  },
  props: {
    fields: {
      type: Array,
      required: true
    },
    submit: {
      type: Function,
      required: false,
      default: null
    }
  },
  methods: {
    validate() {
      if (!this.$v.$invalid) {
        return true
      } else {
        this.$v.$touch()
        return false
      }
    },
    getErrorFor(name) {
      if (definedAndFalse(this.$v.form[name].required)) return "Field is required"
      if (definedAndFalse(this.$v.form[name].minLength)) return `Name must have at least ${this.$v.form[name].$params.minLength.min} letters.`
      if (definedAndFalse(this.$v.form[name].maxLength)) return `Name must have maximum of ${this.$v.form[name].$params.maxLength.min} letters.`
      else return "Invalid"
    },
    onSubmit(evt) {
      evt.preventDefault()
      this.message = ''
      if (this.validate()) {
        Promise.resolve(this.submit(this.form)).catch(err => {
          this.message = err.response.data.message || err.message
        })
      }
    },
    onCancel() {
    }
  }
}
</script>
<style>
.error {
  height: 1rem;
}
</style>
