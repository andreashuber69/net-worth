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
