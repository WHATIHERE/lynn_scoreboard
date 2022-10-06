// let status = null
let status = {
   police: 0,
   ambulance: 0,
   unemployed: 0
}
let myScript = GetCurrentResourceName()
let toggle = false
if (myScript == 'jjx_scoreboard') {
   setTick(async () => {
      await Wait(0);

      if (IsControlJustReleased(0, 38)) {
         toggle = !toggle
         if (toggle) {
            displayAlert(myScript)
            SendNUIMessage({
               type: "is_open",
               status: status,
            })
         } else {
            SendNUIMessage({
               type: "is_close"
            })
         }

      }
   });

   function displayAlert(text) {
      SetTextComponentFormat("STRING")
      AddTextComponentString(text)
      DisplayHelpTextFromStringLabel(0, 0, 1, -1)
   }

} else {
   console.log('You are not using the correct resource name. Please rename the resource to "fip_scoreboard"')
}

onNet("fip:scoreboard:update", (data) => {
   status = data
   console.log('DEBUG: ' + JSON.stringify(status))
})


