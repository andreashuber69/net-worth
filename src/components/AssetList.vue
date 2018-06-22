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
    <v-data-table
      :items="checkedValue.assets" item-key="key" :pagination.sync="pagination" :loading="isLoading"
      :total-items="checkedValue.assets.length" hide-actions class="elevation-1">
      <template slot="headers" slot-scope="props">
        <th class="pr-0"></th>
        <th :class="['text-xs-left column sortable pl-0', sortDirection, getActive('type')]" @click="changeSort('type')">
          Type <v-icon small>arrow_upward</v-icon>
        </th>
        <th
          :class="['hidden-xs-only text-xs-left column sortable', sortDirection, getActive('description')]"
          @click="changeSort('description')">
          Description <v-icon small>arrow_upward</v-icon>
        </th>
        <th
          :class="['hidden-md-and-down text-xs-left column sortable', sortDirection, getActive('location')]"
          @click="changeSort('location')">
          Location <v-icon small>arrow_upward</v-icon>
        </th>
        <th class="hidden-sm-and-down text-xs-left">Unit</th>
        <th colspan="2" class="hidden-md-and-down">Fineness</th>
        <th colspan="2" class="hidden-sm-and-down">Unit Value<br>({{ checkedValue.selectedCurrency }})</th>
        <th colspan="2" class="hidden-sm-and-down">Quantity</th>
        <th
          colspan="2" :class="['total column sortable', sortDirection, getActive('totalValue')]"
          @click="changeSort('totalValue')">
          Total Value <v-icon small>arrow_upward</v-icon><br>({{ checkedValue.selectedCurrency }})
        </th>
        <th>Actions</th>
      </template>
      <v-progress-linear slot="progress" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <AssetListRow :value="props.item" @edit="onEdit" @delete="onDelete"></AssetListRow>
      </template>
      <template slot="footer">
        <td class="pr-0"></td>
        <td class="total pl-0">Grand Total</td>
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
