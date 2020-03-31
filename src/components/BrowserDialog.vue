<!-- https://github.com/andreashuber69/net-worth#-- -->
<template>
  <v-dialog persistent v-model="isOpen" width="600px">
    <v-card>
      <v-card-title class="headline">Untested Browser</v-card-title>
      <v-card-text>
        <p>
          {{ applicationTitle }} is regularly tested on <strong>Brave</strong> and <strong>Firefox</strong> only.
          While it should work on your browser, there's the possibility of browser-specific bugs.
        </p>
        <p>
          I would recommend to use Brave or Firefox because most other popular browsers are proprietary software.
          That is, at least part of the behavior of your browser is probably determined by source code that is not
          publicly available. Because the makers of proprietary software tend to focus on features suitable to increase
          the market share of their product, sound software design and user data privacy often take a back seat. They
          usually get away with that practice because the behavior of their software cannot be independently verified.
        </p>
        <p>
          <strong>
            TL;DR To maximize your privacy, please consider using {{ applicationTitle }} on Brave or Firefox and
            refrain from using services that sync your browser data across devices.
          </strong>
        </p>
        <v-checkbox v-model="dontShowDialog" label="Don't show this again"></v-checkbox>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="isOpen = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script src="./BrowserDialog.vue.ts" lang="ts">
</script>

<style scoped>
</style>
