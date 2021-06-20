<!-- https://github.com/andreashuber69/net-worth#-- -->
<template>
  <v-app>
    <v-navigation-drawer v-model="isDrawerVisible" app dark temporary>
      <v-list dense nav>
        <v-list-item link @click="onNewClicked">
          <v-list-item-icon>
            <v-icon>note_add</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>New</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="onOpenClicked">
          <v-list-item-icon>
            <v-icon>open_in_browser</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Open...</v-list-item-title>
            <input
              ref="fileInput" type="file" :accept="model.fileExtension"
              style="display:none" @change="onFileInputChanged">
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="onSaveClicked">
          <v-list-item-icon>
            <v-icon>save</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Save</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="onSaveAsClicked">
          <v-list-item-icon>
            <v-icon>save</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Save As...</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="canInstall" link @click="onInstallClicked">
          <v-list-item-icon>
            <v-icon>add_circle_outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Install...</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="onAboutClicked">
          <v-list-item-icon>
            <v-icon>help</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>About</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app dark color="primary">
      <v-app-bar-nav-icon title="Open menu" @click.stop="isDrawerVisible = !isDrawerVisible"></v-app-bar-nav-icon>
      <v-toolbar-title class="hidden-xs-only"><v-icon>account_balance_wallet</v-icon><span class="application-title">&nbsp;&nbsp;{{ model.title }}</span></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon title="Add new asset" @click.stop="$refs.assetList.onAdd">
        <v-icon>add</v-icon>
      </v-btn>
      <v-btn icon title="Refresh" @click.stop="onRefreshClicked">
        <v-icon>refresh</v-icon>
      </v-btn>
      <v-menu max-height="300px">
        <template v-slot:activator="{ on }">
          <v-btn text title="Change grouping" v-on="on">
            {{ groupBy }} <v-icon right>arrow_drop_down</v-icon> 
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="newGroupBy in groupBys" :key="newGroupBy" @click="groupBy = newGroupBy">
            <v-list-item-title>{{ newGroupBy }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-menu max-height="300px">
        <template v-slot:activator="{ on }">
          <v-btn text title="Change valuation currency" v-on="on">
            {{ model.currency }} <v-icon right>arrow_drop_down</v-icon> 
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="newCurrency in model.currencies" :key="newCurrency" @click="model.currency = newCurrency">
            <v-list-item-title>{{ newCurrency }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main :style="{
      'background-image': `url(${require('./assets/background.png')})`,
      'background-repeat': 'repeat'
    }">
      <v-container>
        <v-layout justify-center>
          <AssetList :value="model" ref="assetList"/>
        </v-layout>
      </v-container>
      <BrowserDialog/>
      <SaveAsDialog ref="saveAsDialog"/>
      <AboutDialog ref="aboutDialog"/>
    </v-main>
  </v-app>
</template>

<script src="./App.vue.ts" lang="ts">
</script>

<style>
/* https://stackoverflow.com/questions/3790935/can-i-hide-the-html5-number-input-s-spin-box */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
<style scoped>
.application-title {
  vertical-align: middle;
}
</style>