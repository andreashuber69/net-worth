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
  <tr>
    <td>{{ checkedValue.type }}</td>
    <td>{{ checkedValue.description }}</td>
    <td :title="checkedValue.locationHint">{{ checkedValue.location }}</td>
    <td>{{ checkedValue.unit }}</td>
    <td class="text-xs-right pr-0">{{ finenessInteger }}</td>
    <td class="text-xs-left pl-0">{{ finenessFraction }}</td>
    <td class="text-xs-right pr-0">{{ unitValueInteger }}</td>
    <td class="text-xs-left pl-0">{{ unitValueFraction }}</td>
    <td class="text-xs-right pr-0">{{ quantityInteger }}</td>
    <td class="text-xs-left pl-0">{{ quantityFraction }}</td>
    <td class="text-xs-right pr-0 total">{{ totalValueInteger }}</td>
    <td class="text-xs-left pl-0 total">{{ totalValueFraction }}</td>
    <td class="justify-center layout px-0">
      <v-btn icon class="mx-0" @click="edit">
        <v-icon color="teal">edit</v-icon>
      </v-btn>
      <v-btn icon class="mx-0" @click="remove">
        <v-icon color="pink">delete</v-icon>
      </v-btn>
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
