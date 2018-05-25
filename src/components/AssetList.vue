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
    <AssetEditor :value="checkedValue" ref="editor"></AssetEditor>
    <v-data-table :items="checkedValue.assets" :pagination.sync="pagination" hide-actions class="elevation-1">
      <template slot="headers" slot-scope="props">
        <th :class="['text-xs-left column sortable', sortDirection, getActive('type')]" @click="changeSort('type')">Type <v-icon small>arrow_upward</v-icon></th>
        <th class="hidden-xs-only text-xs-left">Description</th>
        <th class="hidden-md-and-down text-xs-left">Location</th>
        <th class="hidden-sm-and-down text-xs-left">Unit</th>
        <th colspan="2" class="hidden-md-and-down">Fineness</th>
        <th colspan="2" class="hidden-sm-and-down">Unit Value<br>({{ checkedValue.selectedCurrency }})</th>
        <th colspan="2" class="hidden-sm-and-down">Quantity</th>
        <th colspan="2" class="total">Total Value<br>({{ checkedValue.selectedCurrency }})</th>
        <th>Actions</th>
      </template>
      <template slot="items" slot-scope="props">
        <AssetListRow :value="props.item" v-on:edit="edit" v-on:remove="remove"></AssetListRow>
      </template>
      <template slot="footer">
        <td class="total">Grand Total</td>
        <td class="hidden-xs-only"></td>
        <td class="hidden-md-and-down"></td>
        <td class="hidden-sm-and-down"></td>
        <td colspan="2" class="hidden-md-and-down"></td>
        <td colspan="2" class="hidden-sm-and-down"></td>
        <td colspan="2" class="hidden-sm-and-down"></td>
        <td class="text-xs-right pr-0 total">{{ totalValueInteger }}</td>
        <td class="text-xs-left pl-0 total">{{ totalValueFraction }}</td>
        <td></td>
      </template>
    </v-data-table>
  </div>
</template>

<script src="./AssetList.vue.ts" lang="ts">
</script>

<style scoped>
.total {
  font-weight: bold;
}
</style>
