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
  <div>
    <v-dialog v-model="dialog" max-width="500px">
      <v-btn slot="activator" color="primary" dark class="mb-2">New Asset</v-btn>
      <v-card>
        <v-card-title>
          <span class="headline">New Asset</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-select label="Type" v-model="editor.info" :items="editor.infos" item-text="type"></v-select>
              </v-flex>
              <v-flex xs12 sm6 v-if="editor.info.hasDescription">
                <v-text-field label="Description" v-model="editor.description"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 v-if="editor.info.hasLocation">
                <v-text-field label="Location" v-model="editor.location"></v-text-field>
              </v-flex>
              <v-flex xs6 v-if="editor.info.hasWeight">
                <v-text-field label="Weight" v-model="editor.weight" type="number" min="0" step="0.001"></v-text-field>
              </v-flex>
              <v-flex xs6 v-if="editor.info.hasWeightUnit">
                <v-select label="Unit" v-model="editor.weightUnit" :items="editor.weightUnits" item-text="abbreviation"></v-select>
              </v-flex>
              <v-flex xs6 v-if="editor.info.hasFineness">
                <v-select label="Fineness" v-model="editor.fineness" :items="editor.finenesses"></v-select>
              </v-flex>
              <v-flex xs6 v-if="editor.info.hasQuantity">
                <v-text-field label="Quantity" v-model="editor.quantity" type="number" min="0" :step="editor.info.quantityStep"></v-text-field>
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
    <v-data-table :items="model.assets" hide-actions class="elevation-1">
      <template slot="headers" slot-scope="props">
        <th class="text-xs-left">Type</th>
        <th class="text-xs-left">Description</th>
        <th class="text-xs-left">Location</th>
        <th class="text-xs-left">Unit</th>
        <th colspan="2">Fineness</th>
        <th colspan="2">Unit Value<br>({{ model.selectedCurrency }})</th>
        <th colspan="2">Quantity</th>
        <th colspan="2" class="total">Total Value<br>({{ model.selectedCurrency }})</th>
      </template>
      <template slot="items" slot-scope="props">
        <AssetListRow :modelProp="props.item"></AssetListRow>
      </template>
      <template slot="footer">
        <td colspan="10" class="total">Grand Total</td>
        <td class="text-xs-right pr-0 total">{{ totalValueInteger }}</td>
        <td class="text-xs-left pl-0 total">{{ totalValueFraction }}</td>
      </template>
    </v-data-table>
    <v-btn @click="add">Add</v-btn>
  </div>
</template>

<script src="./AssetList.vue.ts" lang="ts">
</script>

<style scoped>
.total {
  font-weight: bold;
}
</style>
