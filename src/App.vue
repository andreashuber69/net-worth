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
      <v-toolbar app>
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
          <AssetList :modelProp="model"/>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script src="./App.vue.ts" lang="ts">
</script>

<style>
</style>
