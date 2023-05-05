const fs = require("fs")
const { execSync } = require('child_process')
const { log } = require("console")

const exec = (command) => {
    //console.log(command)
    return execSync(command).toString()
}
const htdocs = __dirname+"/htdocs/packages/"
var packages = fs.readdirSync(htdocs)
    .filter(file => file.endsWith(".zip"))
    .map(file => {
        var [device, version, type] = file.split('.').slice(0, -1).join('.').split("_")
        if(device == "gp150") device = "gl170"
        const sha1sum = exec("sha1sum "+htdocs+file).split(" ")[0]
        const url = "https://bin.fpv.tools/butter/packages/"+file
        return {device, version, type, sha1sum, url}
    })
    .sort((a, b) => {
        const aver = parseInt(a.version.split('.').join(""))
        const bver = parseInt(b.version.split('.').join(""))
        return bver - aver;
    })
    .reduce((devices, package) => {
        if(!devices[package.device]) {
            devices[package.device] = []
        }
        const p = {...package}
        delete p.device
        devices[package.device].push(p)
        return devices
    }, {})

if(process.argv.length < 3) {
    console.log(packages)
}
else if(process.argv[2] == "json") {
    console.log(JSON.stringify(packages, null, 4))
}
else if(process.argv[2] == "md") {
    const types = {
        "lt150":"Air Unit Lite (**Caddx Vista / Runcam Wasp**) for Goggles V1/V2",
        "lt150_1_old":"Air Unit Lite (**Caddx Vista**) for Goggles V1/V2",
        "lt150_2_o3":"Air Unit Lite (**Caddx Vista / Runcam Wasp**) for Goggles 2/Integra",
        "wm150": "**Air Unit** for Goggles V1/V2",
        "wm150_o3": "**Air Unit** for Goggles 2/Integra",
        "gl150": "**Goggles V1**",
        "gl170": "**Goggles V2**"
    }

    function sortObj(obj) {
        return Object.keys(obj).sort().reduce(function (result, key) {
          result[key] = obj[key];
          return result;
        }, {});
      }

    const superpacks = packages.gl170.filter(package  => package.type == "superpack")
    if(superpacks) {
        const package = superpacks[0]
        console.log("## Usage")
        console.log("**For first time V2 Goggles** users on Windows it's reccomended to use the following superpack:")
        console.log("- ["+package.version+" superpack]("+package.url+")")
        console.log("")
        console.log("This will downgrade your goggles to a rootable version, root them using margerine and finally upgrade them to the latest included firmware version.")
        console.log("Follow the included README.txt")
        console.log("")
    }

    packages.lt150_1_old = packages.lt150.filter(package =>{
        const version = parseInt(package.version.split(".").join(""))
        return version < 1000608
    })
    packages.lt150_2_o3 = packages.lt150.filter(package =>{
        const version = parseInt(package.version.split(".").join(""))
        return version >= 1010000
    })
    packages.lt150 = packages.lt150.filter(package =>{
        const version = parseInt(package.version.split(".").join(""))
        return version < 1010000 && version >= 1000608
    })
    packages.wm150_o3 = packages.wm150.filter(package =>{
        const version = parseInt(package.version.split(".").join(""))
        return version >= 1010000
    })
    packages.wm150 = packages.wm150.filter(package =>{
        const version = parseInt(package.version.split(".").join(""))
        return version < 1010000 
    })
    packages.gl170 = packages.gl170.filter(package =>{
        return package.type !="superpack"
    })
    packages = sortObj(packages)
    console.log("**For all other purposes**, please find the appropriate package below and follow the included README.txt:")
    for (var device in packages){
        console.log("- "+types[device])
        for (var i in packages[device]) {
            const package = packages[device][i]
            console.log("  - ["+package.version+"]("+package.url+")")
        }
    }
    console.log("")


}
