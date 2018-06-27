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
    <td class="pr-0">
      <div v-if="checkedValue.isExpandable">
        <v-icon v-if="!checkedValue.isExpanded">expand_more</v-icon>
        <v-icon v-if="checkedValue.isExpanded">expand_less</v-icon>
      </div>
    </td>
    <td class="pl-0">{{ checkedValue.type }}</td>
    <td class="hidden-xs-only">{{ checkedValue.description }}</td>
    <td class="hidden-md-and-down" :title="checkedValue.locationHint">{{ checkedValue.location }}</td>
    <td class="hidden-sm-and-down">{{ checkedValue.unit }}</td>
    <td class="hidden-md-and-down text-xs-right pr-0">{{ finenessInteger }}</td>
    <td class="hidden-md-and-down text-xs-left pl-0">{{ finenessFraction }}</td>
    <td class="hidden-sm-and-down text-xs-right pr-0">{{ unitValueInteger }}</td>
    <td class="hidden-sm-and-down text-xs-left pl-0">{{ unitValueFraction }}</td>
    <td class="hidden-sm-and-down text-xs-right pr-0">{{ quantityInteger }}</td>
    <td class="hidden-sm-and-down text-xs-left pl-0">{{ quantityFraction }}</td>
    <td class="total text-xs-right pr-0">{{ totalValueInteger }}</td>
    <td class="total text-xs-left px-0">{{ totalValueFraction }}</td>
    <td class="px-0">
      <v-menu v-if="checkedValue.hasActions" class="pl-0">
        <v-btn slot="activator" icon>
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
</style>
