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
          <v-list-tile @click="onAboutClicked">
            <v-list-tile-action>
              <v-icon>help</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>About</v-list-tile-title>
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
      <v-content :style="{
        'background-image': `url(${require('./assets/background.png')})`,
        'background-repeat': 'repeat'
      }">
        <v-container>
          <v-layout justify-center>
            <BrowserDialog/>
            <AssetList :value="model" ref="assetList"/>
            <SaveAsDialog ref="saveAsDialog"/>
            <AboutDialog ref="aboutDialog"/>
          </v-layout>
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
