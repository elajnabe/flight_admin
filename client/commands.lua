RegisterCommand('flight_admin:open', function()
    if not Config.perimission('menu') then return end
    if  IsNuiFocused() or IsPauseMenuActive() then return end
    FUNC.openUI()
end) RegisterKeyMapping('flight_admin:open', locale('command_openui', '~o~>~w~'), 'keyboard', Config.openMenuKey)

RegisterCommand('goback', function()
    if not Config.perimission('teleport') then return end

    if not Client.lastCoords then
        lib.notify({title = 'Flight Admin', description = locale('cannot_goback'),
            type = 'error', position = 'top'})
    else
        FUNC.setPlayerCoords(cache.vehicle, Client.lastCoords.x, Client.lastCoords.y, Client.lastCoords.z)
        Client.lastCoords = GetEntityCoords(cache.ped)
        lib.notify({title = 'Flight Admin', description = locale('teleport_success'),
            type = 'success', position = 'top'})
    end
end)

RegisterCommand('tpm', function()
    if not Config.perimission('teleport') then return end
    local marker = GetFirstBlipInfoId(8)

    if marker == 0 then
        lib.notify({title = 'Flight Admin', description = locale('no_marker'),
            type = 'error', position = 'top'})
    else
        local coords = GetBlipInfoIdCoord(marker)
        DoScreenFadeOut(100)
        Wait(100)

        local vehicle = cache.seat == -1 and cache.vehicle
        Client.lastCoords = GetEntityCoords(cache.ped)
        FUNC.freezePlayer(true, vehicle)

        local z, inc, int = 0.0, 20.0, 0
        while z < 800.0 do
            Wait(0)

            local found, groundZ = GetGroundZFor_3dCoord(coords.x, coords.y, z, false)
            if int == 0 then
                int = GetInteriorAtCoords(coords.x, coords.y, z)
                if int ~= 0 then inc = 2.0 end
            end

            if found then FUNC.setPlayerCoords(vehicle, coords.x, coords.y, groundZ) break end

            FUNC.setPlayerCoords(vehicle, coords.x, coords.y, z)
            z += inc
        end

        FUNC.freezePlayer(false, vehicle)
        SetGameplayCamRelativeHeading(0)
        DoScreenFadeIn(750)
    end
end) RegisterKeyMapping('tpm', locale('command_tpm', '~o~>~w~'), 'keyboard', Config.teleportMarkerKey)

RegisterCommand('noclip', function()
    if not Config.perimission('noclip') then return end
    Client.noClip = not Client.noClip
    SetFreecamActive(Client.noClip)
end) RegisterKeyMapping('noclip', locale('command_noclip', '~o~>~w~'), 'keyboard', Config.toggleNoclipKey)
