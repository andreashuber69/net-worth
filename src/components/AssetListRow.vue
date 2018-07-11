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
  <tr @click="onRowClicked">
    <td :class="getClass('expand')">
      <div v-if="checkedValue.isExpandable">
        <v-icon v-if="!checkedValue.isExpanded">expand_more</v-icon>
        <v-icon v-if="checkedValue.isExpanded">expand_less</v-icon>
      </div>
    </td>
    <td :class="getClass('type')">{{ checkedValue.type }}</td>
    <td :class="getClass('description')" :title="checkedValue.notes">{{ checkedValue.description }}</td>
    <td :class="getClass('location')" :title="checkedValue.locationHint">{{ checkedValue.location }}</td>
    <td :class="getClass('unit')">{{ checkedValue.unit }}</td>
    <td :class="getClass('finenessInteger')">{{ finenessInteger }}</td>
    <td :class="getClass('finenessFraction')">{{ finenessFraction }}</td>
    <td :class="getClass('unitValueInteger')">{{ unitValueInteger }}</td>
    <td :class="getClass('unitValueFraction')">{{ unitValueFraction }}</td>
    <td :class="getClass('quantityInteger')">{{ quantityInteger }}</td>
    <td :class="getClass('quantityFraction')">{{ quantityFraction }}</td>
    <td :class="getClass('totalValueInteger')">{{ totalValueInteger }}</td>
    <td :class="getClass('totalValueFraction')">{{ totalValueFraction }}</td>
    <td :class="getClass('more')">
      <v-menu v-if="checkedValue.hasActions">
        <v-btn slot="activator" class="mx-0" icon>
          <v-icon>more_vert</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile :disabled="!checkedValue.isEditable" @click="onEditClicked">
            <v-list-tile-title>Edit</v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click="onDeleteClicked">
            <v-list-tile-title>Delete</v-list-tile-title>
          </v-list-tile>
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
