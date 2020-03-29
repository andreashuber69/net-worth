<!-- https://github.com/andreashuber69/net-worth#-- -->
<template>
  <v-dialog persistent v-model="isOpen" max-width="960px">
    <v-card>
      <v-card-title class="headline">{{ title }}</v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-container grid-list-md>
            <v-layout wrap>
              <Select large="true" :info="typeInputInfo" v-model="type"></Select>
              <TextField :info="assetInfo" property="location" v-model="data"></TextField>
              <TextField :info="assetInfo" property="description" v-model="data"></TextField>
              <TextField :info="assetInfo" property="address" v-model="data"></TextField>
              <TextField :info="assetInfo" property="weight" v-model="data"></TextField>
              <Select :info="assetInfo" property="weightUnit" v-model="data"></Select>
              <TextField :info="assetInfo" property="fineness" v-model="data"></TextField>
              <TextField :info="assetInfo" property="value" v-model="data"></TextField>
              <Select :info="assetInfo" property="valueCurrency" v-model="data"></Select>
              <TextField :info="assetInfo" property="quantity" v-model="data"></TextField>
              <TextArea :info="assetInfo" property="notes" v-model="data"></TextArea>
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

<script src="./AssetEditor.vue.ts" lang="ts">
</script>

<style scoped>
</style>
