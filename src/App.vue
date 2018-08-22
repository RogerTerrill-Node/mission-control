<template>
  <div id="app">
    <div class="background">
      <Logo :scale="900"/>
    </div>
    <div class="graph-wrapper">
      <LineChart :data="rocketData" :headers="['Time', 'Altitude']"/>
    </div>
    <div class="rocket-wrapper">
      <Rocket class="rocket" :rocketData="rocketData" :width="300" :height="500"/>
    </div>
    <Tabs>
      <Tab title="Logs">
        <Logger :logStream="bus" />
      </Tab>
      <Tab title="Parsed">
        <Parsed :rocketData="rocketData" />
      </Tab>
      <Tab :armed="armed" title="Actions">
        <Actions
          @arm-parachute="armParachute"
          @disarm-parachute="disarmParachute"
          @deploy-parachute="deployParachute"
          @reset-parachute="resetParachute"
        />
      </Tab>
      <Tab title="Strategies">
        <Strategies
          :strategies="strategies"
          @activate-strategy="activateStrategy"
          @deactivate-strategy="deactivateStrategy"
          @update-strategy="updateStrategy"
        />
      </Tab>
      <Tab title="Launcher">
        <div>
          <Button label="Open Water" @click="openWater" />
          <Button label="Close Water" @click="closeWater" />
          <Button label="Open Air" @click="openAir" />
          <Button label="Close Air" @click="closeAir" />
          <Button label="Launch" @click="launch" />
          {{pressure}}
          <Gauge :progress="70" />
        </div>
      </Tab>
    </Tabs>
  </div>
</template>

<script>
import Vue from 'vue'

import api from './api'
import Actions from './components/actions.vue'
import Button from './components/button.vue'
import Gauge from './components/gauge.vue'
import LineChart from './components/lineChart.vue'
import Logo from './components/logo.vue'
import Logger from './components/logger.vue'
import Parsed from './components/parsed.vue'
import Rocket from './components/model.vue'
import Strategies from './components/strategies.vue'
import Tabs from './components/tabs.vue'
import Tab from './components/tab.vue'

const rocketApi = api({
  // rocketURL: 'http://10.0.0.118'
  // rocketURL: 'localhost:1235'
  // rocketURL: 'ws://10.0.0.141'
  rocketURL: 'ws://10.0.0.50'
})

const bus = new Vue()

rocketApi.onData(msg => {
  bus.$emit('data', msg)
})

rocketApi.onRocketData(msg => {
  bus.$emit('rocket-data', msg)
})

rocketApi.onStrategyData(msg => {
  bus.$emit('strategy-data', msg)
})

rocketApi.onStrategyLog(msg => {
  bus.$emit('strategy-log', msg)
})

rocketApi.onStrategyError(msg => {
  bus.$emit('strategy-error', msg)
})

setInterval(() => {
  rocketApi.getPressure().then(resp => {
    bus.$emit('particle-pressure', resp.result)
  })
}, 2000)

export default {
  name: 'app',
  components: {
    Actions,
    Button,
    Gauge,
    LineChart,
    Logger,
    Logo,
    Parsed,
    Rocket,
    Strategies,
    Tabs,
    Tab
  },
  data: () => ({
    rocketData: {},
    strategies: [],
    armed: false,
    bus,
    pressure: -1
  }),
  computed: {
    accelerometer () {
      return this.rocketData.accelerometer || {}
    },
    altitude () {
      // Convert meters to feet
      return Math.round((this.rocketData.altitude || 0) * 3.28084)
    },
    gyroscope () {
      return this.rocketData.gyroscope || {}
    },
    magnetometer () {
      return this.rocketData.magnetometer || {}
    }
  },
  methods: {
    armParachute(){
      rocketApi.armParachute(),
      this.armed = true
      },
    disarmParachute(){
      rocketApi.disarmParachute(),
      this.armed = false
      },
    deployParachute: rocketApi.deployParachute,
    resetParachute: rocketApi.resetParachute,
    activateStrategy: rocketApi.activateStrategy,
    updateStrategy: rocketApi.updateStrategy,
    deactivateStrategy: rocketApi.deactivateStrategy,
    openAir: rocketApi.openAir,
    closeAir: rocketApi.closeAir,
    openWater: rocketApi.openWater,
    closeWater: rocketApi.closeWater,
    launch:rocketApi.launch
  },
  mounted() {
    bus.$on('rocket-data', msg => {
      this.rocketData = msg
    })
    bus.$on('strategy-data', msg => {
      this.strategies = msg
    })
    bus.$on('strategy-log', msg => {
      console.log('strategy log:', JSON.stringify(msg, null, 2))
    })
    bus.$on('strategy-error', msg => {
      console.error('strategy error:', JSON.stringify(msg, null, 2))
    })
    bus.$on('particle-pressure', msg => {
      this.pressure = msg
    })
  }
}
</script>

<style>
body {
  background-color: #7b7b7b;
  margin: 0;
  font-family: sans-serif;
}

.background {
  position: absolute;
  height: 100%;
  opacity: 0.05;
  text-align: center;
  width: 100%;
  z-index: -1;
}

#app {
  height: 100vh;
  display: flex;
}

.graph-wrapper {
  width: 100%;
}

.rocket-wrapper {
  position: absolute;
  text-align: center;
  width: 100%;
}

.rocket {
  float: right;
  margin-top: -80px;
}
</style>
