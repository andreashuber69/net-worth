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
  <div id="app">
    <v-app>
      <v-navigation-drawer v-model="isDrawerVisible" temporary app>
        <v-list dense>
          <v-list-tile @click="onOpenClicked">
            <v-list-tile-action>
              <v-icon>open_in_browser</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Open...</v-list-tile-title>
              <input ref="fileInput" type="file" style="display:none" @change="onFileInputChanged">
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile @click="onSaveClicked">
            <v-list-tile-action>
              <v-icon>save</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Save...</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
      <v-toolbar app>
        <v-toolbar-side-icon @click.stop="onMenuIconClicked"></v-toolbar-side-icon>
        <v-toolbar-title>Asset Manager</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <!--
            TODO: The following element should be centered vertically inside the toolbar, but somehow this does not seem
            to be possible...
          -->
          <v-select v-model="model.selectedCurrency" :items="model.currencies" single-line class="my-3"></v-select>
        </v-toolbar-items>
      </v-toolbar>
      <v-content>
        <v-container>
          <AssetList :value="model"/>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script src="./App.vue.ts" lang="ts">
</script>

<style>
/* https://stackoverflow.com/questions/3790935/can-i-hide-the-html5-number-input-s-spin-box */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>
