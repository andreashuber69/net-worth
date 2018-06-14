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
              <input ref="fileInput" type="file" accept=".json" style="display:none" @change="onFileInputChanged">
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
      <v-footer app height="auto">
        <v-container fill-height fluid>
          <v-layout row>
            <v-flex class="text-xs-right pr-2">
              Data Providers
            </v-flex>
            <v-flex>
              <a href="https://coinmarketcap.com" target="_blank" class="px-2">
                <img src="./assets/coinmarketcap.svg" height="12" alt="coinmarketcap.com"/>
              </a>
              <a href="https://blockchain.info" target="_blank" class="px-2">
                <img src="./assets/blockchain.svg" height="12" alt="blockchain.info"/>
              </a>
              <a href="https://ethplorer.io" target="_blank" class="px-2">
                <img src="./assets/ethplorer.png" height="12" alt="ethplorer.io"/>
              </a>
              <a href="https://quandl.com" target="_blank" class="px-2">
                <img src="./assets/quandl.svg" height="12" alt="quandl.com"/>
              </a>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex>
              <a href="https://github.com/andreashuber69/asset-manager" target="_blank" class="px-2">
                GitHub
              </a>
            </v-flex>
          </v-layout>
        </v-container>
      </v-footer>
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
