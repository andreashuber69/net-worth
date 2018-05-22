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
              <v-flex xs12>
                <v-select
                  label="Type" v-model="info" :items="infos" required item-text="type"
                  ref="type" :rules="[() => validate('type')]">                  
                </v-select>
              </v-flex>
              <v-flex xs12 sm6 v-if="info.description.isVisible">
                <v-text-field
                  label="Description" :hint="info.description.hint" v-model="data.description"
                  :required="info.description.isRequired" ref="description" :rules="[() => validate('description')]">
                </v-text-field>
              </v-flex>
              <v-flex xs12 sm6 v-if="info.location.isVisible">
                <v-text-field
                  label="Location" :hint="info.location.hint" v-model="data.location"
                  :required="info.location.isRequired" ref="location" :rules="[() => validate('location')]">
                </v-text-field>
              </v-flex>
              <v-flex xs12 sm6 v-if="info.address.isVisible">
                <v-text-field
                  label="Address" :hint="info.address.hint" v-model="data.address"
                  :required="info.address.isRequired" ref="address" :rules="[() => validate('address')]">
                </v-text-field>
              </v-flex>
              <v-flex xs6 v-if="info.weight.isVisible">
                <v-text-field
                  label="Weight" :hint="info.weight.hint" v-model="data.weight"
                  :required="info.weight.isRequired" type="number" min="0.001" step="0.001"
                  ref="weight" :rules="[() => validate('weight')]">
                </v-text-field>
              </v-flex>
              <v-flex xs6 v-if="info.weightUnit.isVisible">
                <v-select
                  label="Unit" :hint="info.weightUnit.hint" v-model="data.weightUnit" :items="weightUnits"
                  :required="info.weightUnit.isRequired" ref="weightUnit" :rules="[() => validate('weightUnit')]">
                </v-select>
              </v-flex>
              <v-flex xs6 v-if="info.fineness.isVisible">
                <v-text-field
                  label="Fineness" :hint="info.fineness.hint" v-model="data.fineness"
                  :required="info.fineness.isRequired" type="number" min="0.5" max="0.999999" step="0.000001"
                  ref="fineness" :rules="[() => validate('fineness')]">
                </v-text-field>
              </v-flex>
              <v-flex xs6 v-if="info.quantity.isVisible">
                <v-text-field
                  label="Quantity" :hint="info.quantity.hint" v-model="data.quantity"
                  :required="info.quantity.isRequired" type="number" min="1" :step="info.quantityStep"
                  ref="quantity" :rules="[() => validate('quantity')]">
                </v-text-field>
              </v-flex>
              <TextView v-model="data.quantity"></TextView>
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
