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
  <v-dialog persistent v-model="isOpen" width="400">
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
            <img src="../assets/coinmarketcap.svg" height="36"/>
          </v-btn>
          <v-btn href="https://blockchain.info" target="_blank" flat>
            <img src="../assets/blockchain.svg" height="36"/>
          </v-btn>
          <v-btn href="https://blockcypher.com" target="_blank" flat>
            <img src="../assets/blockcypher.svg" height="36"/>
          </v-btn>
          <v-btn href="https://gastracker.io" target="_blank" flat>
            <img src="../assets/gastracker.png" height="36"/>&nbsp;Gastracker.io
          </v-btn>
          <v-btn href="https://ethplorer.io" target="_blank" flat>
            <img src="../assets/ethplorer.png" height="36"/>
          </v-btn>
          <v-btn href="https://btgexp.com" target="_blank" flat>
            <img src="../assets/btgexp.jpg" height="36"/>
          </v-btn>
          <v-btn href="https://chain.so" target="_blank" flat>
            <img src="../assets/sochain.png" height="36"/>
          </v-btn>
          <v-btn href="https://quandl.com" target="_blank" flat>
            <img src="../assets/quandl.svg" height="36"/>
          </v-btn>
        </v-layout>
      </v-container>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="isOpen = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script src="./DataProvidersDialog.vue.ts" lang="ts">
</script>

<style scoped>
</style>
