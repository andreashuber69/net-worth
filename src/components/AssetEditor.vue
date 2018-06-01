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
              <Select large :info="typeInputInfo" v-model="type"></Select>
              <TextField :info="assetInfo" property="description" v-model="data" :validator="validateTextField">
              </TextField>
              <TextField :info="assetInfo" property="location" v-model="data" :validator="validateTextField">
              </TextField>
              <TextField :info="assetInfo" property="address" v-model="data" :validator="validateTextField">
              </TextField>
              <TextField :info="assetInfo" property="weight" v-model="data" :validator="validateTextField"></TextField>
              <Select :info="assetInfo" property="weightUnit" v-model="data"></Select>
              <TextField :info="assetInfo" property="fineness" v-model="data" :validator="validateTextField">
              </TextField>
              <TextField :info="assetInfo" property="quantity" v-model="data" :validator="validateTextField">
              </TextField>
            </v-layout>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn @click.native="onResetClicked">Reset</v-btn>
        <v-spacer></v-spacer>
        <v-btn @click.native="onSaveClicked">Save</v-btn>
        <v-btn @click.native="onCancelClicked">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script src="./AssetEditor.vue.ts" lang="ts">
</script>

<style scoped>
</style>
