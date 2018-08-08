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
  <v-dialog persistent v-model="isOpen" width="600px">
    <v-card>
      <v-card-title class="headline">Untested Browser</v-card-title>
      <v-card-text>
        <p>
          {{ applicationTitle }} is regularly tested on <strong>Chromium</strong> and <strong>Firefox</strong> only.
          While it should work on your browser, there's the possibility of browser-specific bugs.
        </p>
        <p>
          I would recommend to use Chromium or Firefox because most other popular browsers are proprietary software.
          That is, at least part of the behavior of your browser is probably determined by source code that is not
          publicly available. Because the makers of proprietary software tend to focus on features suitable to increase
          the market share of their product, sound software design and user data privacy often take a back seat. They
          usually get away with that practice because the behavior of their software cannot be independently verified.
        </p>
        <p>
          <strong>
            TL;DR To maximize your privacy, please consider using {{ applicationTitle }} on Chromium or Firefox and
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
