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
    <v-layout row justify-center>
      <AssetEditor :value="checkedValue" ref="editor"></AssetEditor>
    </v-layout>
    <v-data-table
      :items="checkedValue.assets" item-key="key" :pagination.sync="pagination" :loading="isLoading" :headers-length="14"
      :total-items="checkedValue.assets.length" hide-actions class="elevation-1">
      <template slot="headers" slot-scope="props">
        <th :class="getHeaderClass('expand')"></th>
        <th :class="getHeaderClass('type')" @click="changeSort('type')">Type <v-icon small>arrow_upward</v-icon></th>
        <th :class="getHeaderClass('description')" @click="changeSort('description')">
          Description <v-icon small>arrow_upward</v-icon>
        </th>
        <th :class="getHeaderClass('location')" @click="changeSort('location')">
          Location <v-icon small>arrow_upward</v-icon>
        </th>
        <th :class="getHeaderClass('unit')">Unit</th>
        <th colspan="2" :class="getHeaderClass('fineness')">Fineness</th>
        <th colspan="2" :class="getHeaderClass('unitValue')">Unit Value<br>({{ checkedValue.selectedCurrency }})</th>
        <th colspan="2" :class="getHeaderClass('quantity')">Quantity</th>
        <th colspan="2" :class="getHeaderClass('totalValue')" @click="changeSort('totalValue')">
          Total Value <v-icon small>arrow_upward</v-icon><br>({{ checkedValue.selectedCurrency }})
        </th>
        <th :class="getHeaderClass('more')"></th>
      </template>
      <v-progress-linear slot="progress" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <AssetListRow :value="props.item" @edit="onEdit" @delete="onDelete"></AssetListRow>
      </template>
      <template slot="footer">
        <td colspan="2" :class="getFooterClass('grandTotal')">Grand Total ({{ checkedValue.selectedCurrency }})</td>
        <td :class="getFooterClass('description')"></td>
        <td :class="getFooterClass('location')"></td>
        <td :class="getFooterClass('unit')"></td>
        <td colspan="2" :class="getFooterClass('fineness')"></td>
        <td colspan="2" :class="getFooterClass('unitValue')"></td>
        <td colspan="2" :class="getFooterClass('quantity')"></td>
        <td :class="getFooterClass('totalValueInteger')">{{ totalValueInteger }}</td>
        <td :class="getFooterClass('totalValueFraction')">{{ totalValueFraction }}</td>
        <td :class="getFooterClass('more')"></td>
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
