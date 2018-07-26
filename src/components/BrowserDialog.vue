<!--
   Copyright (C) 2018 Andreas Huber Dönni

   This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public
   License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later
   version.

   This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
   warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

   You should have received a copy of the GNU General Public License along with this program. If not, see
   <http://www.gnu.org/licenses/>.
-->

<template>
  <v-dialog persistent v-model="isOpen" width="600">
    <v-card>
      <v-card-title class="headline">Untested Browser</v-card-title>
      <v-card-text>
        <p>
          Asset Manager is regularily tested mostly on <strong>Chromium</strong> and <strong>Firefox</strong>. While it
          should work on most other recently released browsers, it is more likely that browser-specific bugs are
          present.
        </p>
        <p>
          Most other popular browsers are proprietary software. That is, at least some of the behavior of your browser
          is probably determined by source code that is not publicly available. Because the makers of proprietary
          software tend to focus on flashy user interfaces and other features suitable to increase the market share of
          their product, sound software design and user data privacy often take a back seat. They usually get away with
          that practice because the behavior of their software cannot be independently verified.
        </p>
        <p>
          <strong>
            TL;DR Please consider using Asset Manager on Chromium or Firefox and refrain from using services that sync
            your browser data accross devices.
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
