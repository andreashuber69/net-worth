<!-- https://github.com/andreashuber69/net-worth#-- -->
<template>
  <v-flex xs12 sm12 :md6="!large" v-if="isPresent">
    <v-select :label="label" :hint="hint" v-model="propertyValue"
      :required="isRequired" :items="items" :rules="[validate]">
    </v-select>
  </v-flex>
</template>

<script src="./Select.vue.ts" lang="ts">
</script>

<style scoped>
</style>
