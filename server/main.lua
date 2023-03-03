local save, freeze, bringPlayer, gotoPlayer = {}, {}, {}, {}

local function getFileData(path, file)
    return json.decode(LoadResourceFile(RESOURCE_NAME, path .. '/' .. file))
end

local function updateFileData(path, file, data)
    return SaveResourceFile(RESOURCE_NAME, path .. '/' .. file, json.encode(data, { indent=true }))
end

local function formatTimecycles(timecycles)
    local formatedTimecycles = {}

    for i=1, #timecycles do
        local v = timecycles[i]
        table.insert(formatedTimecycles, { label = v.Name, value = tostring(joaat(v.Name)) })
    end

    return formatedTimecycles
end

local function formatVanillaInteriors(vanillaInteriors)
    local formatedLocations = {}
    local count = 0

    for i=1, #vanillaInteriors do
        local v = vanillaInteriors[i]
        if v.Locations[1] then
            count += 1
            formatedLocations[count] = {
                name = v.Name,
                x = math.floor(v.Locations[1].Position.X *10^2)/10^2,
                y = math.floor(v.Locations[1].Position.Y *10^2)/10^2,
                z = math.floor(v.Locations[1].Position.Z *10^2)/10^2,
                heading = 0,
                metadata = {
                    dlc = v.DlcName,
                    ytyp = v.FilePath,
                    ymap = v.Locations[1].FilePath,
                    totalEntitiesCount = v.TotalEntitiesCount
                }
            }
        end
    end

    return formatedLocations
end

local function formatRadioStations(radioStations)
    local formatedRadioStations = {}

    for i=1, #radioStations do
        local v = radioStations[i]
        table.insert(formatedRadioStations, { label = v.RadioName, value = v.RadioName })
    end

    return formatedRadioStations
end

local function formatStaticEmitters(staticEmitters)
    local formatedStaticEmitters = {}

    for i=1, #staticEmitters do
        local v = staticEmitters[i]
        table.insert(formatedStaticEmitters, {
            name = v.Name,
            coords = vec3(v.Position.X, v.Position.Y, v.Position.Z),
            flags = v.Flags,
            interior = v.Interior,
            room = v.Room,
            radiostation = v.RadioStation
        })
    end

    return formatedStaticEmitters
end

local function filterCustomLocations()
    -- Filter custom locations to update 'locations.json'
    local customLocations = {}
    for _, v in ipairs(Server.locations) do
        if v.custom then
            customLocations[#customLocations+1] = v
        end
    end
    return customLocations
end

lib.callback.register('flight_admin:getData', function()
    local data = {}
    
    local customLocations = getFileData('shared/data', 'locations.json')
    local locations = formatVanillaInteriors(getFileData('shared/data', 'mloInteriors.json'))
    for _, v in ipairs(customLocations) do
        v.custom = true
        table.insert(locations, v)
    end
    Server.locations = locations

    return {
        locations = locations,
        peds = getFileData('shared/data', 'pedList.json'),
        vehicles = getFileData('shared/data', 'vehicleList.json'),
        weapons = getFileData('shared/data', 'weaponList.json'),
        timecycles = formatTimecycles(getFileData('shared/data', 'timecycleModifiers.json')),
        staticEmitters = formatStaticEmitters(getFileData('shared/data', 'staticEmitters.json')),
        radioStations = formatRadioStations(getFileData('shared/data', 'radioStations.json'))
    }
end)

RegisterNetEvent('flight_admin:tpIntoVeh', function(id)
    if not Config.perimission('intovehicle') then return end
    local admin = GetPlayerPed(source)
    local targetPed = GetPlayerPed(id)
    local vehicle = GetVehiclePedIsIn(targetPed,false)
    local seat = -1
    if vehicle ~= 0 then
        for i=0,8,1 do
            if GetPedInVehicleSeat(vehicle,i) == 0 then
                seat = i
                break
            end
        end
        if seat ~= -1 then
            SetPedIntoVehicle(admin,vehicle,seat)
        end
    end
end)

RegisterNetEvent('flight_admin:server:setNoClip', function(id)
    if save[id] == nil then save[id] = false end
    save[id] = not save[id]
    TriggerClientEvent("flight_admin:setNoClip", id, save[id])
    TriggerClientEvent("flight_admin:updatePlayerData", source)
end)

lib.callback.register('flight_admin:getPlayerData', function()
    local data = {}
    local players = GetPlayers()
    for k, v in pairs(players) do
        local datastore = {
            license = "none",
            discord = "none",
            steam = "none",
            fivem = "none",
            ip = "none",
            live = "none",
            xbl = "none",
            id = "none",
            rank = "none",
            label = "none",
            health = "none",
            armor = "none",
            name = "none",
            noclip = save[k],
            freeze = freeze[k],
            bringPlayer = bringPlayer[k],
            gotoPlayer = gotoPlayer[source]
        }
        for i = 0, GetNumPlayerIdentifiers(k) - 1 do
            local identifier = GetPlayerIdentifier(k, i)
            if identifier:find('license') and not datastore["license"] == "none" then
                datastore["license"] = identifier
            elseif identifier:find('discord') then
                datastore["discord"] = identifier
            elseif identifier:find('steam') then
                datastore["steam"] = identifier
            elseif identifier:find('fivem') then
                datastore["fivem"] = identifier
            elseif identifier:find('ip') then
                datastore["ip"] = identifier
            elseif identifier:find('live') then
                datastore["live"] = identifier
            elseif identifier:find('xbl') then
                datastore["xbl"] = identifier
            end
        end
        datastore["name"] = GetPlayerName(k)
        datastore["id"] = k
        data[#data + 1] = datastore
    end
    return data
end)

lib.callback.register('flight_admin:renameLocation', function(source, data)
    local result

    for index, location in ipairs(Server.locations) do
        if location.custom and location.name == data.oldName then
            location.name = data.newName
            result = { index = index, data = location }
        end
    end
    assert(result ~= nil, "Error while trying to rename location. Location not found!")

    local success = updateFileData('shared/data', 'locations.json', filterCustomLocations())
    assert(success == true, "Unable to update 'shared/data/locations.json' file.")

    return result
end)

lib.callback.register('flight_admin:createCustomLocation', function(source, data)
    local newLocation = {
        name = data.name,
        x = math.round(data.coords.x, 3),
        y = math.round(data.coords.y, 3),
        z = math.round(data.coords.z, 3),
        heading = math.round(data.heading, 3),
        custom = true
    }

    -- Register new location at index 1
    table.insert(Server.locations, 1, newLocation)

    local success = updateFileData('shared/data', 'locations.json', filterCustomLocations())
    assert(success == true, "Unable to update 'shared/data/locations.json' file.")

    return newLocation
end)

lib.callback.register('flight_admin:deleteLocation', function(source, data)
    local foundIndex
    for k, v in ipairs(Server.locations) do
        if v.custom and v.name == data then
            foundIndex = k
            break
        end
    end
    if not foundIndex then return false end

    table.remove(Server.locations, foundIndex)

    local success = updateFileData('shared/data', 'locations.json', filterCustomLocations())
    assert(success == true, "Unable to update 'shared/data/locations.json' file.")
    return foundIndex
end)

if Shared.ox_inventory then
    local function getAmmo(weaponName)
        local file = ('data/%s.lua'):format('weapons')
        local datafile = LoadResourceFile('ox_inventory', file)
        local path = ('@@%s/%s'):format('ox_inventory', file)

        if not datafile then
            warn(('no datafile found at path %s'):format(path:gsub('@@', '')))
            return {}
        end

        local func, err = load(datafile, path)

        if not func or err then
            return error(err, 0)
        end

        return func().Weapons[weaponName:upper()].ammoname
    end

    lib.callback.register('flight_admin:giveWeaponToPlayer', function(source, weaponName)
        local success = false

        local ammoName = getAmmo(weaponName)

        if exports.ox_inventory:CanCarryItem(source, weaponName, 1) then
            exports.ox_inventory:AddItem(source, weaponName, 1, { ammo = 100 })
            success = true

            if exports.ox_inventory:CanCarryItem(source, ammoName, 1) then
                local ammoCount = exports.ox_inventory:Search(source, 'count', ammoName)
                if ammoCount < 100 then
                    exports.ox_inventory:AddItem(source, ammoName, 100 - ammoCount)
                end
            end
        end
        
        return success
    end)
end

RegisterCommand('flag', function(source, args)
    if source > 0 then return end

    local totalFlags = tonumber(args[1])
    local type = 'ytyp'
    local all_flags = { 
        portal = { 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192 },
        room = { 1, 2, 4, 8, 16, 32, 64, 128, 256, 512 },
        ytyp = { 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072, 262144, 524288, 1048576, 2097152, 4194304, 8388608, 16777216, 33554432, 67108864, 134217728, 268435456, 536870912, 1073741824, 2147483648 }
    }
    
    if not all_flags[type] then return end
    
    local flags = {}
    for _, flag in ipairs(all_flags[type]) do
        if totalFlags & flag ~= 0 then
            flags[#flags+1] = tostring(flag)
        end
    end

    local result = {}
    for i, flag in ipairs(flags) do
        result[#result+1] = tostring(flag)
    end

    print(json.encode(result , {indent=true}))
end)

RegisterNetEvent('flight_admin:Announce', function(message)
    if not Config.perimission('announce') then return end
    TriggerClientEvent("txAdmin:receiveAnnounce", -1, message, GetPlayerName(source))
end)

RegisterNetEvent('flight_admin:revive', function(id)
    if not Config.perimission('revive') then return end
    if not id then id = source end
    print("Attempted to revive id: "..id.." Set your revive function here: server/main.lua")
end)

RegisterNetEvent('flight_admin:warnPlayer', function(id)
    if not Config.perimission('warn') then return end
    if not id then return end
    print("Attempted to warn id: "..id.." Set your warn function here: server/main.lua")
end)

RegisterNetEvent('flight_admin:setMaxHealth', function(id)
    if not Config.perimission('heal') then return end
    TriggerClientEvent("flight_admin:setMaxHealthPlayer", id)
end)

RegisterNetEvent('flight_admin:tpCoordsPlayer', function(data)
    if not Config.perimission('tpCoords') then return end
    TriggerClientEvent("flight_admin:tpCoordsPlayer", tonumber(data.id.id), data)
end)

RegisterNetEvent('flight_admin:tpMarkerPlayer', function(id)
    if not Config.perimission('tpMarker') then return end
    TriggerClientEvent("flight_admin:tpMarkerPlayer", tonumber(id))
end)

RegisterNetEvent('flight_admin:freezePlayer', function(player)
    if not Config.perimission('freeze') then return end
    frozen = not frozen
    freeze[player] = frozen
    FreezeEntityPosition(GetPlayerPed(player), frozen)
    TriggerClientEvent("flight_admin:updatePlayerData", source)
end)

RegisterNetEvent('flight_admin:killPlayer', function(player)
    if not Config.perimission('kill') then return end
    TriggerClientEvent("flight_admin:killPlayer", tonumber(player))
end)

RegisterNetEvent('flight_admin:trollPlayer', function(data)
    print("Attempted to troll id: "..data.id.." this event is not ready yet")
end)

RegisterNetEvent('flight_admin:bringPlayer', function(player)
    local coords = GetEntityCoords(GetPlayerPed(source))
    SetEntityCoords(GetPlayerPed(tonumber(player)), coords.x, coords.y, coords.z)
    bringPlayer[tonumber(player)] = coords
    TriggerClientEvent("flight_admin:updatePlayerData", source)
end)

RegisterNetEvent('flight_admin:bringBackPlayer', function(player)
    local coords = bringPlayer[tonumber(player)]
    SetEntityCoords(GetPlayerPed(tonumber(player)), coords.x, coords.y, coords.z)
    bringPlayer[tonumber(player)] = nil
    TriggerClientEvent("flight_admin:updatePlayerData", source)
end)

RegisterNetEvent('flight_admin:gotoPlayer', function(player)
    local coords = GetEntityCoords(GetPlayerPed(tonumber(player)))
    SetEntityCoords(GetPlayerPed(source), coords.x, coords.y, coords.z)
    gotoPlayer[source] = GetEntityCoords(GetPlayerPed(tonumber(source)))
    TriggerClientEvent("flight_admin:updatePlayerData", source)
end)

RegisterNetEvent('flight_admin:goBackPlayer', function(player)
    local coords = gotoPlayer[source]
    SetEntityCoords(GetPlayerPed(source), coords.x, coords.y, coords.z)
    gotoPlayer[source] = nil
    TriggerClientEvent("flight_admin:updatePlayerData", source)
end)

RegisterNetEvent('flight_admin:kickPlayer', function(data)
    -- data.id | player server id
    -- data.reason | player kick reason
    print("Attempted to kick id: "..data.id.." Set your kick function here: server/main.lua")
end)

RegisterNetEvent('flight_admin:banPlayer', function(data)
    -- data.id | player server id
    -- data.reason | player ban reason
    -- data.duration | player ban duration
    print("Attempted to ban id: "..data.id.." Set your ban function here: server/main.lua")
end)