import io from 'socket.io-client'

const bind = (emitter, cb, types) => {
  types.forEach(type => {
    emitter.on(type, msg => {
      msg = msg || {}
      msg.type = type
      cb(msg)
    })
  })
}

export default (opts = {}) => {
  const rocket = io(opts.rocketURL)

  return {
    onRocketData: cb => rocket.on('rocket-data', cb),
    onParachuteArmed: cb => rocket.on('parachute-armed', cb),
    onParachuteDisarmed: cb => rocket.on('parachute-disarmed', cb),
    onParachuteDeployed: cb => rocket.on('parachute-deployed', cb),
    onStrategyData: cb => rocket.on('strategy-data', cb),
    onStrategyCustomEvent: cb => rocket.on('strategy-custom-event', cb),
    onStrategyLog: cb => rocket.on('strategy-log', cb),
    onStrategyError: cb => rocket.on('strategy-error', cb),

    onData: cb => bind(rocket, cb, [
      'rocket-data',
      'parachute-armed',
      'parachute-disarmed',
      'parachute-deployed',
      'strategy-data',
      'strategy-custom-event',
      'strategy-log',
      'strategy-error'
    ]),

    deployParachute: () => rocket.emit('deploy-parachute'),
    resetParachute: () => rocket.emit('reset-parachute'),
    armParachute: () => rocket.emit('arm-parachute'),
    disarmParachute: () => rocket.emit('disarm-parachute'),

    activateStrategy: key => rocket.emit('activate-strategy', key),
    updateStrategy: data => rocket.emit('update-strategy', data),
    deactivateStrategy: key => rocket.emit('deactivate-strategy', key),

    openAir: () => invokeParticle("openAir"),
    closeAir: () => invokeParticle("closeAir"),
    openWater: () => invokeParticle("openWater"),
    closeWater: () => invokeParticle("closeWater"),
    launch: () => invokeParticle("launch"),

    getPressure: () => invokeParticle('pressure', 'GET')
  }
}

function invokeParticle(name, method = 'POST') {
  // Default options are marked with *
    return fetch(`https://api.particle.io/v1/devices/1f003a000f47363336383437/${name}`, {
        method, // *GET, POST, PUT, DELETE, etc.
        headers: {
          Authorization: "Bearer c05e71a71f3a227f98da1d4f12fd8599970c5a15",
          "Content-Type": "application/json; charset=utf-8",
          // "Content-Type": "application/x-www-form-urlencoded",
      },
        body: method === 'GET' ? undefined : JSON.stringify({ args: 'none' }), // body data type must match "Content-Type" header
    })
    .then(response => response.json()); // parses response to JSON
}