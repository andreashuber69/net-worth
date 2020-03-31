<!-- https://github.com/andreashuber69/net-worth#-- -->
<template>
  <v-flex xs12 sm12 v-if="isPresent">
    <v-textarea :label="label" :hint="hint" v-model="propertyValue" :required="isRequired" :rules="[validate]">
    </v-textarea>
  </v-flex>
</template>

<script src="./TextArea.vue.ts" lang="ts">
</script>

<style scoped>
</style>
