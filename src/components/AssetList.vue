<!--
   Copyright (C) 2018-2019 Andreas Huber Dönni

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
    <!-- TODO: Use new syntax -->
    <v-data-table
      :items="checkedValue.assets.grouped" item-key="key" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc"
      :loading="isLoading" :headers-length="16" :server-items-length="checkedValue.assets.grouped.length"
      hide-default-footer class="elevation-1">
      <template slot="header" slot-scope="props">
          <tr>
            <th :class="getHeaderClass('expand')"></th>
            <th
              :class="getHeaderClass(checkedValue.assets.ordering.groupBy)"
              @click="changeSort(checkedValue.assets.ordering.groupBy)">
              {{ checkedValue.assets.ordering.groupByLabel }} <v-icon small>arrow_upward</v-icon>
            </th>
            <th
              :class="getHeaderClass(checkedValue.assets.ordering.otherGroupBys[0])"
              @click="changeSort(checkedValue.assets.ordering.otherGroupBys[0])">
              {{ checkedValue.assets.ordering.otherGroupByLabels[0] }} <v-icon small>arrow_upward</v-icon>
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
          </tr>
      </template>
      <v-progress-linear slot="progress" indeterminate></v-progress-linear>
      <template slot="item" slot-scope="props">
        <AssetListRow :value="props.item" :visibleColumnCount="optionalColumnCount" @edit="onEdit" @delete="onDelete">
        </AssetListRow>
      </template>
      <div class="text-center" slot="no-data">
        No assets, yet. Add new ones with the <strong>+</strong> button (top right) or load existing assets with
        <strong>Open...</strong> in the menu (top left).
      </div>
      <template slot="body.append">
        <tr>
          <td :colspan="grandTotalLabelColumnCount" :class="getFooterClass('grandTotalLabel')">Grand Total</td>
          <td :class="getFooterClass('totalValueInteger')">{{ grandTotalValueInteger }}</td>
          <td :class="getFooterClass('totalValueFraction')">{{ grandTotalValueFraction }}</td>
          <td :class="getFooterClass('percentInteger')">100</td>
          <td :class="getFooterClass('percentFraction')">.0</td>
          <td :class="getFooterClass('more')"></td>
        </tr>
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
