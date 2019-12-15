<!--
   Copyright (C) 2018-2019 Andreas Huber Dönni

   This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public
   License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later
   version.

   This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
   warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

   You should have received a copy of the GNU General Public License along with this program. If not, see
   <http://www.gnu.org/licenses/>.
-->

<template>
  <v-app>
    <v-navigation-drawer v-model="isDrawerVisible" app dark temporary>
      <v-list dense nav>
        <v-list-item link @click="onNewClicked">
          <v-list-item-icon>
            <v-icon>note_add</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>New</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="onOpenClicked">
          <v-list-item-icon>
            <v-icon>open_in_browser</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Open...</v-list-item-title>
            <input
              ref="fileInput" type="file" :accept="model.fileExtension"
              style="display:none" @change="onFileInputChanged">
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="onSaveClicked">
          <v-list-item-icon>
            <v-icon>save</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Save</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="onSaveAsClicked">
          <v-list-item-icon>
            <v-icon>save</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Save As...</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="onAboutClicked">
          <v-list-item-icon>
            <v-icon>help</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>About</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app dark color="primary">
      <v-app-bar-nav-icon @click.stop="onMenuClicked"></v-app-bar-nav-icon>
      <v-toolbar-title class="hidden-xs-only"><v-icon>account_balance_wallet</v-icon><span>&nbsp;&nbsp;{{ model.title }}</span></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon title="Add new asset" @click.stop="$refs.assetList.onAdd">
        <v-icon>add</v-icon>
      </v-btn>
      <v-btn icon title="Refresh" @click.stop="onRefreshClicked">
        <v-icon>refresh</v-icon>
      </v-btn>
      <v-menu max-height="300px">
        <template v-slot:activator="{ on }">
          <v-btn text title="Change grouping" v-on="on">
            {{ groupBy }} <v-icon right>arrow_drop_down</v-icon> 
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="newGroupBy in groupBys" :key="newGroupBy" @click="groupBy = newGroupBy">
            <v-list-item-title>{{ newGroupBy }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-menu max-height="300px">
        <template v-slot:activator="{ on }">
          <v-btn text title="Change valuation currency" v-on="on">
            {{ model.currency }} <v-icon right>arrow_drop_down</v-icon> 
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="newCurrency in model.currencies" :key="newCurrency" @click="model.currency = newCurrency">
            <v-list-item-title>{{ newCurrency }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
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
