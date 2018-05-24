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
  <v-flex xs12 :sm6="!large" v-if="checkedInfo.isVisible">
    <v-select :label="checkedInfo.label" :hint="checkedInfo.hint" v-model="checkedValue"
      :items="checkedInfo.items" :item-text="checkedInfo.itemText"
      :required="checkedInfo.isRequired" ref="control" :rules="[validate]" >
    </v-select>
  </v-flex>
</template>

<script src="./Select.vue.ts" lang="ts">
</script>

<style scoped>
</style>
