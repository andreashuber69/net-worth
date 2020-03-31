<!-- https://github.com/andreashuber69/net-worth#-- -->
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
      <template v-slot:item.fineness="{ header: { value: name }, value }">
        <NumericTableCell :maxPrefix="maxPrefixes.get(name)" :maxDigits="6" :value="value">
        </NumericTableCell>
      </template>
      <template v-slot:item.unitValue="{ item, header: { value: name }, value }">
        <NumericTableCell
          :maxPrefix="maxPrefixes.get(name)" :maxDigits="2" :minDigits="2"
          :value="value" :title="item.unitValueHint" :isLoading="loading">
        </NumericTableCell>
      </template>
      <template v-slot:item.quantity="{ item, header: { value: name }, value }">
        <NumericTableCell
          :maxPrefix="maxPrefixes.get(name)" :maxDigits="6"
          :value="value" :title="item.quantityHint" :isLoading="loading">
        </NumericTableCell>
      </template>
      <template v-slot:item.totalValue="{ header: { value: name }, value }">
        <NumericTableCell
          :maxPrefix="maxPrefixes.get(name)" :maxDigits="2" :minDigits="2" :isTotal="true"
          :value="value" :isLoading="loading">
        </NumericTableCell>
      </template>
      <template v-slot:item.percent="{ header: { value: name }, value }">
        <NumericTableCell
          :maxPrefix="maxPrefixes.get(name)" :maxDigits="1" :minDigits="1" :isTotal="true"
          :value="value" :isLoading="loading">
        </NumericTableCell>
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
            <NumericTableCell
              :maxPrefix="maxPrefixes.get('totalValue')" :maxDigits="2" :minDigits="2" :isTotal="true"
              :value="grandTotalValue" :isLoading="loading">
            </NumericTableCell>
          </td>
          <td>
            <NumericTableCell
              :maxPrefix="maxPrefixes.get('percent')" :maxDigits="1" :minDigits="1" :isTotal="true" :value="100">
            </NumericTableCell>
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
