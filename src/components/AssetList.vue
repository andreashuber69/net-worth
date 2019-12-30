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
    <v-data-table
      :items="checkedValue.assets.grouped" item-key="key" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc"
      :server-items-length="checkedValue.assets.grouped.length" hide-default-header hide-default-footer
      class="elevation-1">
      <template v-slot:header>
        <thead class="v-data-table-header">
          <tr>
            <th :class="getHeaderClass('expand')"></th>
            <th
              :class="getHeaderClass(checkedValue.assets.ordering.groupBys[0])"
              @click="changeSort(checkedValue.assets.ordering.groupBys[0])">
              {{ checkedValue.assets.ordering.groupByLabels[0] }} <v-icon small class="v-data-table-header__icon">arrow_upward</v-icon>
            </th>
            <th
              :class="getHeaderClass(checkedValue.assets.ordering.groupBys[1])"
              @click="changeSort(checkedValue.assets.ordering.groupBys[1])">
              {{ checkedValue.assets.ordering.groupByLabels[1] }} <v-icon small class="v-data-table-header__icon">arrow_upward</v-icon>
            </th>
            <th :class="getHeaderClass('description')" @click="changeSort('description')">
              Description <v-icon small class="v-data-table-header__icon">arrow_upward</v-icon>
            </th>
            <th :class="getHeaderClass('unit')">Unit</th>
            <th :class="getHeaderClass('fineness')">Fineness</th>
            <th :class="getHeaderClass('unitValue')" @click="changeSort('unitValue')">
              Unit Value<br>({{ checkedValue.currency }}) <v-icon small class="v-data-table-header__icon">arrow_upward</v-icon>
            </th>
            <th :class="getHeaderClass('quantity')">Quantity</th>
            <th :class="getHeaderClass('totalValue')" @click="changeSort('totalValue')">
              Total Value<br>({{ checkedValue.currency }}) <v-icon small class="v-data-table-header__icon">arrow_upward</v-icon>
            </th>
            <th :class="getHeaderClass('percent')">%</th>
            <th :class="getHeaderClass('more')"></th>
          </tr>
          <!--
            The loading indicator and the no data hint should rather be implemented with the associated slots (progress
            and no-data). However, it appears these currently do not work correctly when the number of columns changes
            (not even when we set the headers-length property accordingly).
          -->
          <tr v-if="isLoading" class="v-data-table__progress">
            <th :colspan="totalColumnCount">
              <v-progress-linear indeterminate></v-progress-linear>
            </th>
          </tr>
        </thead>
      </template>
      <!-- cSpell:ignore prepend -->
      <template v-slot:body.prepend>
        <tr v-if="checkedValue.assets.grouped.length === 0">
          <td :colspan="totalColumnCount" class="pl-3 pr-3">
            No assets, yet. Add new ones with the <strong>+</strong> button (top right) or load existing assets with
            <strong>Open...</strong> in the menu (top left).
          </td>
        </tr>
      </template>
      <template v-slot:item="{ item }">
        <AssetListRow :value="item" :visibleColumnCount="optionalColumnCount" @edit="onEdit" @delete="onDelete">
        </AssetListRow>
      </template>
      <template v-slot:body.append>
        <tr>
          <td :colspan="grandTotalLabelColumnCount" :class="getFooterClass('grandTotalLabel')">Grand Total</td>
          <td :class="getFooterClass('totalValue')">{{ grandTotalValue }}</td>
          <td :class="getFooterClass('percent')">100.0</td>
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

th {
  white-space: nowrap;
}

::v-deep .v-data-table__empty-wrapper {
  display: none; /* apparently, there's no easier way to completely hide the default no data row. */
}
</style>
