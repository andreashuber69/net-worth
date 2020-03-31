<!-- https://github.com/andreashuber69/net-worth#-- -->
<template>
  <div>
    <template v-if="value !== undefined || !isLoading">
      <span class="prefix" v-bind:class="{ total: isTotal }">{{ prefix }}</span>
      <span :title="title" v-bind:class="{ total: isTotal }">{{ valueFormatted }}</span>
    </template>
    <v-skeleton-loader v-else type="text"></v-skeleton-loader>
  </div>
</template>

<script src="./NumericTableCell.vue.ts" lang="ts">
</script>

<style scoped>
.prefix {
  visibility: hidden;
}

.total {
  font-weight: bold;
}
</style>
