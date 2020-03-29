<!-- https://github.com/andreashuber69/net-worth#-- -->
<template>
  <v-dialog persistent v-model="isOpen" max-width="400px">
    <v-card>
      <v-card-title class="headline">Save As</v-card-title>
      <v-card-text>
        <v-form ref="form" @submit="e => e.preventDefault()">
          <v-container grid-list-md>
            <v-layout wrap>
              <TextField large="true" :info="nameInfo" v-model="name"></TextField>
            </v-layout>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click.native="onCancelClicked">Cancel</v-btn>
        <v-btn color="primary" @click.native="onSaveClicked">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script src="./SaveAsDialog.vue.ts" lang="ts">
</script>

<style scoped>
</style>
