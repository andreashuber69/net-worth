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
  <v-dialog persistent v-model="isOpen" max-width="500px">
    <v-btn slot="activator" color="primary" dark class="mb-2">New Asset</v-btn>
    <v-card>
      <v-card-title>
        <span class="headline">New Asset</span>
      </v-card-title>
      <v-card-text>
        <v-form v-model="isValid" ref="form">
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-select label="Type" v-model="info" :items="infos" item-text="type"></v-select>
              </v-flex>
              <v-flex xs12 sm6 v-if="info.hasDescription">
                <v-text-field
                  label="Description" :hint="info.descriptionHint" v-model="description" required ref="description"
                  :rules="[() => validate('description')]">
                </v-text-field>
              </v-flex>
              <v-flex xs12 sm6 v-if="info.hasLocation">
                <v-text-field
                  label="Location" :hint="info.locationHint" v-model="location" ref="location"
                  :rules="[() => validate('location')]">
                </v-text-field>
              </v-flex>
              <v-flex xs12 sm6 v-if="info.hasAddress">
                <v-text-field
                  label="Address" hint="The public address or xpub of the wallet." v-model="address" ref="address"
                  :rules="[() => validate('address'),() => validateAddressAndQuantity(quantityVisited)]" @blur="() => addressVisited = true">
                </v-text-field>
              </v-flex>
              <v-flex xs6 v-if="info.hasWeight">
                <v-text-field
                  label="Weight" hint="The weight of a single item, expressed in Unit." v-model="weight" required
                  type="number" min="0.001" step="0.001" ref="weight" :rules="[() => validate('weight')]">
                </v-text-field>
              </v-flex>
              <v-flex xs6 v-if="info.hasWeightUnit">
                <v-select
                  label="Unit" hint="The unit the of the Weight." v-model="weightUnit" :items="weightUnits" item-text="abbreviation" required
                  ref="weightUnit" :rules="[() => validate('weightUnit')]">
                </v-select>
              </v-flex>
              <v-flex xs6 v-if="info.hasFineness">
                <v-select
                  label="Fineness" hint="The precious metal fineness." v-model="fineness" :items="finenesses" required combobox
                  type="number" min="0.5" max="0.999999" step="0.000001" ref="fineness" :rules="[() => validate('fineness')]">
                </v-select>
              </v-flex>
              <v-flex xs6 v-if="info.hasQuantity">
                <v-text-field
                  label="Quantity" :hint="info.quantityHint" v-model="quantity" :required="info.isQuantityRequired"
                  type="number" min="1" :step="info.quantityStep" ref="quantity"
                  :rules="[() => validate('quantity'),() => validateAddressAndQuantity(addressVisited)]" @blur="() => quantityVisited = true">
                </v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
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
