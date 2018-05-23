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
  <v-dialog persistent v-model="isOpen" max-width="800px">
    <v-btn slot="activator" color="primary" dark class="mb-2">New Asset</v-btn>
    <v-card>
      <v-card-title>
        <span class="headline">{{ title }}</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-container grid-list-md>
            <v-layout wrap>
              <Select :inputInfo="typeInputInfo" v-model="type" :validator="validateSelect">                
              </Select>
              <TextField :inputInfo="assetInfo.description" v-model="data.description" :validator="validateTextField">
              </TextField>
              <TextField :inputInfo="assetInfo.location" v-model="data.location" :validator="validateTextField">
              </TextField>
              <TextField :inputInfo="assetInfo.address" v-model="data.address" :validator="validateTextField">
              </TextField>
              <TextField :inputInfo="assetInfo.weight" v-model="data.weight" :validator="validateTextField"></TextField>
              <Select :inputInfo="assetInfo.weightUnit" v-model="data.weightUnit" :validator="validateSelect">                
              </Select>
              <TextField :inputInfo="assetInfo.fineness" v-model="data.fineness" :validator="validateTextField">
              </TextField>
              <TextField :inputInfo="assetInfo.quantity" v-model="data.quantity" :validator="validateTextField">
              </TextField>
            </v-layout>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn @click.native="reset">Reset</v-btn>
        <v-spacer></v-spacer>
        <v-btn @click.native="save">Save</v-btn>
        <v-btn @click.native="cancel">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script src="./AssetEditor.vue.ts" lang="ts">
</script>

<style scoped>
</style>
