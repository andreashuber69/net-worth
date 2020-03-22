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
      :headers="headers" :options.sync="options" :loading="loading" :items="checkedValue.assets.grouped" item-key="key"
      :server-items-length="checkedValue.assets.grouped.length" hide-default-footer :mobile-breakpoint="0"
      class="elevation-1" @click:row="$event.expand()" v-resize="adjustTableColumnCount">
      <template v-slot:header.unitValue="{ header }">
        {{ header.text }}<br>({{ checkedValue.currency }})
      </template>
      <template v-slot:header.totalValue="{ header }">
        {{ header.text }}<br>({{ checkedValue.currency }})
      </template>
      <template v-slot:item.expand="{ item }">
        <v-icon v-if="item.isExpandable && !item.isExpanded">expand_more</v-icon>
        <v-icon v-if="item.isExpandable && item.isExpanded">expand_less</v-icon>
      </template>
      <template v-slot:item.description="{ item, value }">
        <span :title="item.notes">{{ value }}</span>
      </template>
      <template v-slot:item.fineness="{ header, value }">
        <span class="prefix">{{ getPrefix(header.value, value) }}</span>
        <span>{{ format(value, 6) }}</span>
      </template>
      <template v-slot:item.unitValue="{ item, header, value }">
        <template v-if="value !== undefined || !loading">
          <span class="prefix">{{ getPrefix(header.value, value) }}</span>
          <span :title="item.unitValueHint">{{ format(value, 2, 2) }}</span>
        </template>
        <v-skeleton-loader v-else type="text"></v-skeleton-loader>
      </template>
      <template v-slot:item.quantity="{ item, header, value }">
        <template v-if="value !== undefined || !loading">
          <span class="prefix">{{ getPrefix(header.value, value) }}</span>
          <span :title="item.quantityHint">{{ format(value, 6) }}</span>
        </template>
        <v-skeleton-loader v-else type="text"></v-skeleton-loader>
      </template>
      <template v-slot:item.totalValue="{ header, value }">
        <template v-if="value !== undefined || !loading">
          <span class="prefix total">{{ getPrefix(header.value, value) }}</span>
          <span class="total">{{ format(value, 2, 2) }}</span>
        </template>
        <v-skeleton-loader v-else type="text"></v-skeleton-loader>
      </template>
      <template v-slot:item.percent="{ header, value }">
        <template v-if="value !== undefined || !loading">
          <span class="prefix total">{{ getPrefix(header.value, value) }}</span>
          <span class="total">{{ format(value, 1, 1) }}</span>
        </template>
        <v-skeleton-loader v-else type="text"></v-skeleton-loader>
      </template>
      <template v-slot:item.more="{ item }">
        <v-menu v-if="item.hasActions">
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on"><v-icon>more_vert</v-icon></v-btn>
          </template>
          <v-list>
            <v-list-item @click="onEdit(item)">
              <v-list-item-title>Edit</v-list-item-title>
            </v-list-item>
            <v-list-item @click="onDelete(item)">
              <v-list-item-title>Delete</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
      <!-- cSpell:ignore prepend -->
      <template v-slot:body.prepend>
        <tr v-if="checkedValue.assets.grouped.length === 0">
          <td class="no-data" :colspan="totalColumnCount">
            No assets, yet. Add new ones with the <strong>+</strong> button (top right) or load existing assets with
            <strong>Open...</strong> in the menu (top left).
          </td>
        </tr>
      </template>
      <template v-slot:body.append>
        <tr>
          <td :colspan="grandTotalLabelColumnCount" class="total">Grand Total</td>
          <td v-if="isVisible('totalValue')">
            <template v-if="!loading">
              <span class="prefix total">{{ getPrefix('totalValue', grandTotalValue) }}</span>
              <span class="total">{{ format(grandTotalValue, 2, 2) }}</span>
            </template>
            <v-skeleton-loader v-else type="text"></v-skeleton-loader>
          </td>
          <td>
            <span class="prefix total">{{ getPrefix('percent', 100) }}</span>
            <span class="total">100.0</span>
          </td>
          <td></td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script src="./AssetList.vue.ts" lang="ts">
</script>

<style scoped>
.prefix {
  visibility: hidden;
}

.total {
  font-weight: bold;
}

::v-deep .v-data-table th, ::v-deep .v-data-table td {
  padding: 0 12px;
  white-space: nowrap;
}

::v-deep .v-data-table__progress th {
  padding: 0;
}

td.no-data {
  white-space: unset;
  text-align: center;
}

::v-deep .v-data-table__empty-wrapper {
  display: none; /* apparently, there's no easier way to completely hide the default no data row. */
}
</style>
