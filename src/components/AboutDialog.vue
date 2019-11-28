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
  <v-dialog v-model="isOpen" width="960px">
    <v-card>
      <v-card-title class="headline">{{ title }}</v-card-title>
      <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card flat>
              <v-card-text class="subheading px-0">Copyright &copy; 2018-{{ new Date(Date.now()).getUTCFullYear() }} Andreas Huber Dönni</v-card-text>
            </v-card>
          </v-flex> 
          <v-flex xs12 sm4>
            <v-btn
              :href="`https://github.com/andreashuber69/${packageName}/blob/master/README.md#--`" target="_blank"
              color="primary" block flat class="ma-0">
              Documentation
            </v-btn>
          </v-flex> 
          <v-flex xs12 sm4>
            <v-btn
              :href="`https://github.com/andreashuber69/${packageName}/issues`" target="_blank"
              color="primary" block flat class="ma-0">
              Issues
            </v-btn>
          </v-flex> 
          <v-flex xs12 sm4>
            <v-btn
              :href="`https://raw.githubusercontent.com/andreashuber69/${packageName}/master/LICENSE`" target="_blank"
              color="primary" block flat class="ma-0">
              License
            </v-btn>
          </v-flex> 
          <v-flex xs12>
            <v-card flat>
              <v-card-text class="subheading px-0">
                This application would not work without the help of the following data providers, who generously offer
                their services free of charge:
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs12 sm6 md4>
            <v-btn href="https://cryptocompare.com" target="_blank" block flat class="ma-0">
              <img src="../assets/cryptocompare.png" height="36"/>
            </v-btn>
          </v-flex>
          <v-flex xs12 sm6 md4>
            <v-btn href="https://blockchain.info" target="_blank" block flat class="ma-0">
              <img src="../assets/blockchain.svg" height="36"/>
            </v-btn>
          </v-flex>
          <v-flex xs12 sm6 md4>
            <v-btn href="https://blockcypher.com" target="_blank" block flat class="ma-0">
              <img src="../assets/blockcypher.svg" height="36"/>
            </v-btn>
          </v-flex>
          <v-flex xs12 sm6 md4>
            <v-btn href="https://blockscout.com/etc/mainnet" target="_blank" block flat class="ma-0">
              <img src="../assets/blockscout.svg" height="36"/>&nbsp;&nbsp;blockscout.com
            </v-btn>
          </v-flex>
          <v-flex xs12 sm6 md4>
            <v-btn href="https://ethplorer.io" target="_blank" block flat class="ma-0">
              <img src="../assets/ethplorer.png" height="36"/>
            </v-btn>
          </v-flex>
          <v-flex xs12 sm6 md4>
            <v-btn href="https://explorer.bitcoingold.org" target="_blank" block flat class="ma-0">
              <img src="../assets/bitcoingold.png" height="36"/>
            </v-btn>
          </v-flex>
          <v-flex xs12 sm6 md4>
            <v-btn href="https://chain.so" target="_blank" block flat class="ma-0">
              <img src="../assets/sochain.png" height="36"/>
            </v-btn>
          </v-flex>
          <v-flex xs12 sm6 md4>
            <v-btn href="https://quandl.com" target="_blank" block flat class="ma-0">
              <img src="../assets/quandl.svg" height="36"/>
            </v-btn>
          </v-flex>
          <v-flex xs12>
            <v-card flat>
              <v-card-text class="caption px-0">{{ userAgent }}</v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="isOpen = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script src="./AboutDialog.vue.ts" lang="ts">
</script>

<style scoped>
</style>
