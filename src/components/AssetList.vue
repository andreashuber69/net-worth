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
