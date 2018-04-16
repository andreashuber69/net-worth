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
    <td :title="asset.location">{{ asset.shortLocation }}</td>
    <td>{{ asset.description }}</td>
    <td>{{ asset.type }}</td>
    <td>{{ asset.unit }}</td>
    <td>{{ asset.fineness }}</td>
    <td>{{ asset.formattedUnitValue }}</td>
    <td>{{ asset.formattedQuantity }}</td>
    <td>{{ asset.formattedTotalValue }}</td>
  </tr>
</template>

<script src="./Asset.vue.ts" lang="ts">
</script>

<style scoped>
</style>
