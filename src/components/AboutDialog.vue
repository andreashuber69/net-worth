<!-- https://github.com/andreashuber69/net-worth#-- -->
<template>
  <v-dialog v-model="isOpen" width="960px">
    <v-card>
      <v-card-title class="headline">{{ title }}</v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout row wrap>
            <v-flex xs12>
              <v-card flat>
                <v-card-text class="text-center px-0">
                  Copyright &copy; 2018-{{ new Date(Date.now()).getUTCFullYear() }} Andreas Huber
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs12 sm4>
              <v-btn
                :href="`https://github.com/andreashuber69/${packageName}/blob/master/README.md#--`" target="_blank"
                color="primary" block text class="ma-0">
                Documentation
              </v-btn>
            </v-flex>
            <v-flex xs12 sm4>
              <v-btn
                :href="`https://github.com/andreashuber69/${packageName}/issues`" target="_blank"
                color="primary" block text class="ma-0">
                Issues
              </v-btn>
            </v-flex>
            <v-flex xs12 sm4>
              <v-btn
                :href="`https://raw.githubusercontent.com/andreashuber69/${packageName}/master/LICENSE`" target="_blank"
                color="primary" block text class="ma-0">
                License
              </v-btn>
            </v-flex>
            <v-flex xs12>
              <v-card flat>
                <v-card-text class="text-center px-0">
                  This application would not work without the help of the following data providers, who generously offer
                  their services free of charge:
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs12 sm6 md4>
              <v-btn href="https://cryptocompare.com" target="_blank" block text class="ma-0">
                <v-img :src="require('@/assets/cryptocompare.png')" max-width="200" height="36" contain></v-img>
              </v-btn>
            </v-flex>
            <v-flex xs12 sm6 md4>
              <v-btn href="https://blockchair.com" target="_blank" block text class="ma-0">
                <v-img :src="require('@/assets/blockchair.svg')" max-width="200" height="36" contain></v-img>
              </v-btn>
            </v-flex>
            <v-flex xs12 sm6 md4>
              <v-btn href="https://blockscout.com/etc/mainnet" target="_blank" block text class="ma-0">
                <v-img :src="require('@/assets/blockscout.svg')" max-width="36" height="36" contain></v-img>
                <span>blockscout.com</span>
              </v-btn>
            </v-flex>
            <v-flex xs12 sm6 md4>
              <v-btn href="https://ethplorer.io" target="_blank" block text class="ma-0">
                <v-img :src="require('@/assets/ethplorer.png')" max-width="200" height="36" contain></v-img>
              </v-btn>
            </v-flex>
            <v-flex xs12 sm6 md4>
              <v-btn href="https://explorer.bitcoingold.org" target="_blank" block text class="ma-0">
                <v-img :src="require('@/assets/bitcoingold.png')" max-width="200" height="36" contain></v-img>
              </v-btn>
            </v-flex>
            <v-flex xs12 sm6 md4>
              <v-btn href="https://quandl.com" target="_blank" block text class="ma-0">
                <v-img :src="require('@/assets/quandl.svg')" max-width="200" height="36" contain></v-img>
              </v-btn>
            </v-flex>
            <v-flex xs12>
              <v-card flat>
                <v-card-text class="caption text-center px-0">{{ userAgent }}</v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
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
