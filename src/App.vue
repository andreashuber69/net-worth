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
          <v-list-tile @click="onNewClicked">
            <v-list-tile-action>
              <v-icon>note_add</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>New</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile @click="onOpenClicked">
            <v-list-tile-action>
              <v-icon>open_in_browser</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Open...</v-list-tile-title>
              <input
                ref="fileInput" type="file" :accept="model.fileExtension"
                style="display:none" @change="onFileInputChanged">
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile @click="onSaveClicked">
            <v-list-tile-action>
              <v-icon>save</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Save</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile @click="onSaveAsClicked">
            <v-list-tile-action>
              <v-icon>save</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Save As...</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
      <v-toolbar app dark color="primary">
        <v-toolbar-side-icon @click.stop="onMenuClicked"></v-toolbar-side-icon>
        <v-toolbar-title class="hidden-xs-only"><v-icon>account_balance_wallet</v-icon>&nbsp;&nbsp;{{ model.title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon title="Add new asset" class="ml-1 mr-0" @click.stop="assetList.onAdd">
          <v-icon>add</v-icon>
        </v-btn>
        <v-menu title="Change grouping" max-height="300px">
          <v-toolbar-title slot="activator" class="ml-2 mr-0">
            <span>{{ groupBy }}</span>
            <v-icon>arrow_drop_down</v-icon>
          </v-toolbar-title>
          <v-list>
            <v-list-tile
              v-for="newGroupBy in groupBys" :key="newGroupBy" @click="groupBy = newGroupBy">
              <v-list-tile-title v-text="newGroupBy"></v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        <v-menu title="Change valuation currency" max-height="300px">
          <v-toolbar-title slot="activator" class="ml-2 mr-3">
            <span>{{ model.currency }}</span>
            <v-icon>arrow_drop_down</v-icon>
          </v-toolbar-title>
          <v-list>
            <v-list-tile
              v-for="newCurrency in model.currencies" :key="newCurrency" @click="model.currency = newCurrency">
              <!-- Without the explicit width, the dropdown ends up being too narrow for most currencies on Firefox. -->
              <v-list-tile-title v-text="newCurrency" style="width:50px"></v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-toolbar>
      <v-content>
        <v-container>
          <v-layout justify-center>
            <SaveAsDialog ref="saveAsDialog"/>
            <AssetList :value="model" ref="assetList"/>
          </v-layout>
        </v-container>
      </v-content>
      <v-footer app dark color="primary" height="auto">
        <v-layout justify-center>
          <v-dialog persistent v-model="areDataProvidersVisible" width="400">
            <v-btn slot="activator" flat round>Data Providers</v-btn>
            <v-card>
              <v-card-title class="headline">Data Providers</v-card-title>
              <v-container>
                <v-layout column justify-center>
                  <p class="text-xs-center">
                    Asset Manager would not work without the following data providers, who generously offer their
                    services free of charge:
                  </p>
                  <v-btn href="https://coinmarketcap.com" target="_blank" flat>
                    <img src="./assets/coinmarketcap.svg" height="36"/>
                  </v-btn>
                  <v-btn href="https://blockchain.info" target="_blank" flat>
                    <img src="./assets/blockchain.svg" height="36"/>
                  </v-btn>
                  <v-btn href="https://blockcypher.com" target="_blank" flat>
                    <img src="./assets/blockcypher.svg" height="36"/>
                  </v-btn>
                  <v-btn href="https://gastracker.io" target="_blank" flat>
                    <img src="./assets/gastracker.png" height="36"/>&nbsp;Gastracker.io
                  </v-btn>
                  <v-btn href="https://ethplorer.io" target="_blank" flat>
                    <img src="./assets/ethplorer.png" height="36"/>
                  </v-btn>
                  <v-btn href="https://btgexp.com" target="_blank" flat>
                    <img src="./assets/btgexp.jpg" height="36"/>
                  </v-btn>
                  <v-btn href="https://chain.so" target="_blank" flat>
                    <img src="./assets/sochain.png" height="36"/>
                  </v-btn>
                  <v-btn href="https://quandl.com" target="_blank" flat>
                    <img src="./assets/quandl.svg" height="36"/>
                  </v-btn>
                </v-layout>
              </v-container>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="areDataProvidersVisible = false">Close</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-btn href="https://github.com/andreashuber69/asset-manager" target="_blank" flat round>Source Code</v-btn>
        </v-layout>
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
