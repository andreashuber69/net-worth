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
    <v-select v-model="model.selectedCurrency" :items="model.currencies"></v-select>
    <table>
      <tr>
        <th>Location</th>
        <th>Description</th>
        <th>Type</th>
        <th>Unit</th>
        <th class="number" colspan="2">Fineness</th>
        <th class="number" colspan="2">Unit Value</th>
        <th class="number" colspan="2">Quantity</th>
        <th class="number" colspan="2">Total Value</th>
      </tr>
      <AssetListRow v-for="(asset, index) in model.assets" :key="index" :assetProp="asset"></AssetListRow>
      <tr>
        <td class="total" colspan="10">Grand Total</td>
        <td class="total integer">{{ totalValueInteger }}</td>
        <td class="total fraction">{{ totalValueFraction }}</td>
      </tr>
    </table>
    <v-btn @click="add">Add</v-btn>
  </div>
</template>

<script src="./AssetList.vue.ts" lang="ts">
</script>

<style scoped>
th.number {
  text-align: center;
}

tr:nth-child(even) {
  background-color: lightgoldenrodyellow;
}
</style>
