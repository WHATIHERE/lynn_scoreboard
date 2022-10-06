let job_status = {
    police: 0,
    ambulance: 0,
    unemployed: 0,
    phone_number: null,
    user_data: null,
    total: 0,
    playerId: 0
}
let listPlayers = []
var ESX = null

RegisterCommand('jssync', async (source) => {

    emit('esx:getSharedObject', (obj) => {
        ESX = obj
    })

    let playerId = source
    let identifiers = ESX.GetIdentifier(playerId)
    let sql = `SELECT * from users WHERE identifier = 'char1:${identifiers}'`
    exports.oxmysql.query(sql, (result) => {
        job_status.phone_number = result[0].phone_number
        job_status.name = result[0].firstname + ' ' + result[0].lastname
    })
    // exports.oxmysql.query(`SELECT * FROM users WHERE identifier = 'char1:${identifiers}'`, function (result) {
    //     if (result) {
    //         result.forEach((v) => {
    //             job_status.phone_number = v.phone_number
    //             job_status.name = v.firstname + ' ' + v.lastname
    //             // console.log('JJ SQL', v.identifier, v.firstname, v.lastname, v.phone_number)
    //             // console.log(job_status.name, job_status.phone_number)
    //         })
    //     }
    // })
})


on('esx:playerLoaded', (source) => {
    job_status.total = job_status.total + 1

    emit('esx:getSharedObject', (obj) => {
        ESX = obj
    })
    let playerId = source
    let xPlayer = ESX.GetPlayerFromId(playerId)
    job_status.playerId = source
    job_name = xPlayer.job.name
    if (job_name == 'police') {
        job_status.police++
    } else if (job_name == 'ambulance') {
        job_status.ambulance++
    } else {
        job_status.unemployed++
    }

    listPlayers.push({
        id: playerId,
        job_name: job_name
    })
    let identifiers = ESX.GetIdentifier(playerId)
    let sql = `SELECT * from users WHERE identifier = 'char1:${identifiers}'`
    exports.oxmysql.query(sql, (result) => {
        job_status.user_data = result[0]
        // console.log(job_status)
        emitNet("fip:scoreboard:update", -1, job_status)
    })
})

on('esx:playerDropped', (source) => {
    job_status.total = job_status.total - 1
    emit('esx:getSharedObject', (obj) => {
        ESX = obj
    })
    let playerId = source
    let xPlayer = ESX.GetPlayerFromId(playerId)
    job_name = xPlayer.job.name
    if (job_name == 'police') {
        job_status.police--
    } else if (job_name == 'ambulance') {
        job_status.ambulance--
    } else {
        job_status.unemployed--
    }
    // slice the array form the player id
    listPlayers.splice(listPlayers.findIndex((player) => player.id == source), 1)
    emitNet("fip:scoreboard:update", -1, job_status)
})

on('esx:setJob', (source) => {
    emit('esx:getSharedObject', (obj) => {
        ESX = obj
    })
    let playerId = source
    let xPlayer = ESX.GetPlayerFromId(playerId)
    new_job_name = xPlayer.job.name
    let old_player = listPlayers.find(player => {
        if (player.id == playerId) {
            return player.job_name
        }
    })
    old_job = old_player.job_name

    if (old_job == 'police') {
        job_status.police--
    } else if (old_job == 'ambulance') {
        job_status.ambulance--
    } else {
        job_status.unemployed--
    }

    listPlayers.findIndex(player => {
        if (player.id == playerId) {
            player.job_name = new_job_name
        }
    })

    if (new_job_name == 'police') {
        job_status.police++
    } else if (new_job_name == 'ambulance') {
        job_status.ambulance++
    } else {
        job_status.unemployed++
    }
    emitNet("fip:scoreboard:update", -1, job_status)
})

