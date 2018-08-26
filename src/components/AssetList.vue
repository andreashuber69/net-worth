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
      <AssetEditor ref="editor"></AssetEditor>
    </v-layout>
    <v-data-table
      :items="checkedValue.assets" item-key="key" :pagination.sync="pagination" :loading="isLoading" :headers-length="16"
      :total-items="checkedValue.assets.length" hide-actions class="elevation-1">
      <template slot="headers" slot-scope="props">
        <th :class="getHeaderClass('expand')"></th>
        <th :class="getHeaderClass(checkedValue.ordering.groupBy)" @click="changeSort(checkedValue.ordering.groupBy)">
          {{ checkedValue.ordering.groupByLabel }} <v-icon small>arrow_upward</v-icon>
        </th>
        <th
          :class="getHeaderClass(checkedValue.ordering.otherGroupBys[0])"
          @click="changeSort(checkedValue.ordering.otherGroupBys[0])">
          {{ checkedValue.ordering.otherGroupByLabels[0] }} <v-icon small>arrow_upward</v-icon>
        </th>
        <th :class="getHeaderClass('description')" @click="changeSort('description')">
          Description <v-icon small>arrow_upward</v-icon>
        </th>
        <th :class="getHeaderClass('unit')">Unit</th>
        <th colspan="2" :class="getHeaderClass('fineness')">Fineness</th>
        <th colspan="2" :class="getHeaderClass('unitValue')" @click="changeSort('unitValue')">
          Unit Value <v-icon small>arrow_upward</v-icon><br>({{ checkedValue.currency }})
        </th>
        <th colspan="2" :class="getHeaderClass('quantity')">Quantity</th>
        <th colspan="2" :class="getHeaderClass('totalValue')" @click="changeSort('totalValue')">
          Total Value <v-icon small>arrow_upward</v-icon><br>({{ checkedValue.currency }})
        </th>
        <th colspan="2" :class="getHeaderClass('percent')">%</th>
        <th :class="getHeaderClass('more')"></th>
      </template>
      <v-progress-linear slot="progress" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <AssetListRow :value="props.item" :visibleColumnCount="optionalColumnCount" @edit="onEdit" @delete="onDelete">
        </AssetListRow>
      </template>
      <div class="text-xs-center" slot="no-data">
        No assets, yet. Add new ones with the <strong>+</strong> button (top right) or load existing assets with
        <strong>Open...</strong> in the menu (top left).
      </div>
      <template slot="footer">
        <td :colspan="grandTotalLabelColumnCount" :class="getFooterClass('grandTotalLabel')">Grand Total</td>
        <td :class="getFooterClass('totalValueInteger')">{{ grandTotalValueInteger }}</td>
        <td :class="getFooterClass('totalValueFraction')">{{ grandTotalValueFraction }}</td>
        <td :class="getFooterClass('percentInteger')">100</td>
        <td :class="getFooterClass('percentFraction')">.0</td>
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
