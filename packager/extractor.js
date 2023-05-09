const { execSync } = require('child_process')
const fs = require("fs")
var path = require('path')
const { cwd } = require('process')

const infile = process.argv[2]
const package = path.basename(infile).slice(0, -4);

const toolsdir = __dirname+"/deps/"

const doCleanup = false


var sigcfg;

const keys = {
    gp150: {
        decrypt:"UFIE-2020-04"
    },    
    gl170: {
        decrypt:"UFIE-2020-04"
    },
    gl150: {
        decrypt:"UFIE-2018-07"
    },
    wm150: {
        decrypt:"UFIE-2018-07"
    },
    lt150: {
        decrypt:"UFIE-2018-07"
    }

}
var match = infile.match(new RegExp(Object.keys(keys).join("|"), 'i'))
if(!match) {
    console.log("device key config missing "+infile)
    process.exit(1)
}
var device = match[0]
console.log(device)

const exec = (command) => {
    console.log(command)
    return execSync(command)
}

var sigfiles = []
if(infile.endsWith(".bin")) {
    
    if(!fs.existsSync(package)) {
        fs.mkdirSync(package)
    }
    exec(`tar -xvf ${infile} -C ${package}`);
    sigfiles.push(...fs.readdirSync(package).filter((file) => { console.log(file); return new RegExp("(.*)_(0801|2801|2805)_(.*).pro.fw.sig").test(file)}).map((file) => {
        return package+"/"+file;
     }))

}
else if(infile.endsWith(".sig")) {
    sigfiles = [infile]
}

const isFileHead = (file, head) => {
    const fd = fs.openSync(file)
    const headBuff = Buffer.alloc(head.length)
    fs.readSync(fd, headBuff, 0, head.length)
    return headBuff.toString() === head
}

const versions = sigfiles.map((file) => {
    const sig = path.dirname(file)+"/"+device+".cfg.sig";
    if(fs.existsSync(sig)) {
        sigcfg = process.cwd()+"/"+sig;
        const cfg = fs.readFileSync(sig, {encoding:"utf8"});
        const regex = /release version="([0-9\.]*)"/g;
        return regex.exec(cfg)[1];

    }
    else {
        const regex = /.*_(.*)\.pro\.fw\.sig/g;
        return regex.exec(file)[1];
    }
})

//lazy because only one sig file at a time in this version
const dir = process.argv[3]+"/"+device+"_"+versions[0]+"_recovery";
if(!fs.existsSync(dir))
    fs.mkdirSync(dir)
const deleteme = cwd()+"/"+package;
process.chdir(dir)

const decryptSigFile = (sigfile, key) => {
    console.log("decrypting .sig file: "+sigfile)
    console.log("cwd is "+cwd())
    const stdout = exec("python "+toolsdir+"dji-firmware-tools/dji_imah_fwsig.py -vv "+(keys[device].verify ? "-k "+keys[device].verify : "-f")+ " -k "+key+" -u -i "+sigfile);
    if(!/Decrypted chunks checksum (.*) matches./.test(stdout.toString())) {
        console.error("Decrypted file checksum mismatch for: "+sigfile)
    }
    else {
        console.log("Decryption successful")
    }
}

var binfiles = []
sigfiles.forEach(sigfile => {
    //umm, ugh, don't look here. yes, this is kinda wrong.
    decryptSigFile("../../tmp/"+sigfile, keys[device].decrypt)
    binfiles.push(...fs.readdirSync(process.cwd()).filter((file) => { return new RegExp(path.basename(sigfile).slice(0, -4)+"_(.*).bin").test(file)}))
})

const clean = (file) => {
    if(doCleanup) {
        fs.unlink(file)
    }
}
const zipfiles = binfiles.filter(file => isFileHead(file, "PK"))
zipfiles.forEach(file => execSync("unzip -o "+file))

const brfiles = fs.readdirSync(process.cwd()).filter(file => file.endsWith(".br"))
brfiles.forEach(file => execSync("brotli -f -d "+file))

const tlfiles = fs.readdirSync(process.cwd()).filter(file => file.endsWith(".transfer.list"))
tlfiles.forEach(file => {
    const part = file.slice(0, -(".transfer.list".length))
    exec(`set -e
    python ${toolsdir}sdat2img/sdat2img.py ${part}.transfer.list  ${part}.new.dat  ${part}.img.raw
    img2simg ${part}.img.raw ${part}.img
    rm ${part}.img.raw`)
})

if(device == "gp150" || device == "gl170") {
    exec(`set -e
    sudo rm -rf mount
    mkdir -p mount
    rm -rf upgrade_raw.img
    
    mkdir -p mount/part_a
    mkdir -p mount/part_b
    mkdir -p mount/debugimgs
    ln -s /blackbox/upgrade/part_a  mount/backup
    ln -s /blackbox/upgrade/part_b  mount/signimgs
    cp ${sigcfg} mount/part_a/
    cp ${sigcfg} mount/part_b/
    mke2fs -d mount/ -b 4096 -T ext4 upgrade_raw.img 128000
    tune2fs -c0 -i0 -O ^metadata_csum upgrade_raw.img
    #cp upgrade_raw.img upgrade.img
    img2simg upgrade_raw.img upgrade.img
    rm upgrade_raw.img`)
}

/*
  sudo umount mount/ || true
    sudo rm -rf mount
    mkdir -p mount
    rm -rf upgrade_raw.img
    truncate -s 524288000 upgrade_raw.img
    mke2fs -b 4096 -T ext4 upgrade_raw.img
    tune2fs -c0 -i0 -O ^metadata_csum upgrade_raw.img
    sudo mount upgrade_raw.img mount/
    sudo mkdir -p mount/part_a
    sudo mkdir -p mount/part_b
    sudo mkdir -p mount/debugimgs
    sudo ln -s /blackbox/upgrade/part_a  mount/backup
    sudo ln -s /blackbox/upgrade/part_b  mount/signimgs
    sudo cp ${sigcfg} mount/part_a/
    sudo cp ${sigcfg} mount/part_b/
    sudo umount mount/
    #cp upgrade_raw.img upgrade.img
    img2simg upgrade_raw.img upgrade.img
    #rm upgrade_raw.img
*/

const cleanup = fs.readdirSync(process.cwd()).filter(file => !file.endsWith(".img"))

cleanup.forEach((path) => {
    fs.rmSync(path, { recursive:true, force: true})
}) 

fs.rmSync(deleteme, { recursive:true, force: true})
