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
  <tr @click="onRowClicked">
    <td :class="getClass('expand')">
      <div v-if="checkedValue.isExpandable">
        <v-icon v-if="!checkedValue.isExpanded">expand_more</v-icon>
        <v-icon v-if="checkedValue.isExpanded">expand_less</v-icon>
      </div>
    </td>
    <td :class="getClass(groupBy)" :title="groupByHint">{{ groupByContent }}</td>
    <td :class="getClass(otherGroupBys[0])" :title="otherGroupByHints[0]">{{ otherGroupByContents[0] }}</td>
    <td :class="getClass('description')" :title="checkedValue.notes">{{ checkedValue.description }}</td>
    <td :class="getClass('unit')">{{ checkedValue.unit }}</td>
    <td :class="getClass('fineness')">{{ fineness }}</td>
    <td :class="getClass('unitValue')" :title="checkedValue.unitValueHint">{{ unitValue }}</td>
    <td :class="getClass('quantity')" :title="checkedValue.quantityHint">{{ quantity }}</td>
    <td :class="getClass('totalValue')">{{ totalValue }}</td>
    <td :class="getClass('percent')">{{ percent }}</td>
    <td :class="getClass('more')">
      <v-menu v-if="checkedValue.hasActions">
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on"><v-icon>more_vert</v-icon></v-btn>
        </template>
        <v-list>
          <v-list-item @click="onEditClicked">
            <v-list-item-title>Edit</v-list-item-title>
          </v-list-item>
          <v-list-item @click="onDeleteClicked">
            <v-list-item-title>Delete</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </td>
  </tr>
</template>

<script src="./AssetListRow.vue.ts" lang="ts">
</script>

<style scoped>
.total {
  font-weight: bold;
}

td {
  white-space: nowrap;
}
</style>
