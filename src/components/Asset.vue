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
    <td :title="asset.location">{{ shortLocation }}</td>
    <td>{{ asset.description }}</td>
    <td>{{ asset.type }}</td>
    <td>{{ asset.unit }}</td>
    <td class="integer">{{ finenessInteger }}</td>
    <td class="fraction">{{ finenessFraction }}</td>
    <td class="integer">{{ unitValueInteger }}</td>
    <td class="fraction">{{ unitValueFraction }}</td>
    <td class="integer">{{ quantityInteger }}</td>
    <td class="fraction">{{ quantityFraction }}</td>
    <td class="total integer">{{ totalValueInteger }}</td>
    <td class="total fraction">{{ totalValueFraction }}</td>
  </tr>
</template>

<script src="./Asset.vue.ts" lang="ts">
</script>

<style scoped>
</style>
