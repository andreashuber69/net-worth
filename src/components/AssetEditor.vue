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
  <v-dialog v-model="isDialogOpen" max-width="500px">
    <v-btn slot="activator" color="primary" dark class="mb-2">New Asset</v-btn>
    <v-card>
      <v-card-title>
        <span class="headline">New Asset</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
              <v-select label="Type" v-model="info" :items="infos" item-text="type"></v-select>
            </v-flex>
            <v-flex xs12 sm6 v-if="info.hasDescription">
              <v-text-field label="Description" required v-model="description"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 v-if="info.hasLocation">
              <v-text-field label="Location" required v-model="location"></v-text-field>
            </v-flex>
            <v-flex xs6 v-if="info.hasWeight">
              <v-text-field label="Weight" required v-model="weight" type="number" min="0" step="0.001" :error-messages="weightMsg" @blur="(evt) => weightMsg = validate(evt)"></v-text-field>
            </v-flex>
            <v-flex xs6 v-if="info.hasWeightUnit">
              <v-select label="Unit" required v-model="weightUnit" :items="weightUnits" item-text="abbreviation"></v-select>
            </v-flex>
            <v-flex xs6 v-if="info.hasFineness">
              <v-select label="Fineness" required combobox v-model="fineness" :items="finenesses" type="number" min="0.5" max="0.999999" step="0.000001"></v-select>
            </v-flex>
            <v-flex xs6 v-if="info.hasQuantity">
              <v-text-field label="Quantity" required v-model="quantity" type="number" min="0" :step="info.quantityStep"></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
        <v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script src="./AssetEditor.vue.ts" lang="ts">
</script>

<style scoped>
</style>
