<!-- https://github.com/andreashuber69/net-worth#-- -->
<template>
  <v-flex xs12 sm12 :md6="!large" v-if="isPresent">
    <v-text-field :label="label" :hint="hint" v-model="propertyValue"
      :required="isRequired" :type="type" :min="min" :max="max" :step="step" :rules="[validate]">
    </v-text-field>
  </v-flex>
</template>

<script src="./TextField.vue.ts" lang="ts">
</script>

<style scoped>
</style>
