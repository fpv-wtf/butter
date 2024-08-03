# butter
### Episode 3: The ¯\\\_(ツ)_/¯ Strikes Back

## Purpose
This program will enable fastboot on DJI Air Unit (Lite), DJI FPV Goggles V1 and DJI FPV Goggles V2. This means you can recover or forcefully downgrade your devices firmware ignoring antirollback.

## Supported platforms
- Windows 64bit
- Linux x64, armhf, aarch64

Sorry OS X users, you will need to find a friend with a supported PC. If someone has any ideas on how to make the recovery USB device that shows up for 5 seconds during DJI device power up successfully enumerate on OS X in libusb (or at all) we're all ears.

## Usage
**First time V2 Goggles** users should:
- Use the [01.00.0606](https://bin.fpv.tools/butter/packages/gp150_01.00.0606_recovery.zip) package and follow the included README.txt to downgrade
- Go to [https://fpv.wtf/root](https://fpv.wtf/root) and root their device - DO NOT install wtfos yet
- Switch the Goggles to DJI FPV mode from the device menus
- Use [DJI Assistant (DJI FPV series)](https://www.dji.com/ee/downloads/softwares/dji-assistant-2-dji-fpv-series) to upgrade to the latest firmware
- Go to [https://fpv.wtf/wtfos](https://fpv.wtf/root) to install wtfos

**For all other purposes**, please find the appropriate package below and follow the included README.txt:
- **Goggles V1**
  - [01.00.0608](https://bin.fpv.tools/butter/packages/gl150_01.00.0608_recovery.zip)
  - [01.00.0606](https://bin.fpv.tools/butter/packages/gl150_01.00.0606_recovery.zip)
- **Goggles V2**
  - [01.07.0000](https://bin.fpv.tools/butter/packages/gl170_01.07.0000_recovery.zip)
  - [01.00.0606](https://bin.fpv.tools/butter/packages/gp150_01.00.0606_recovery.zip)
- Air Unit Lite (**Caddx Vista / Runcam Wasp**) for using with FPV Goggles V1/V2
  - [01.00.0608](https://bin.fpv.tools/butter/packages/lt150_01.00.0608_recovery.zip)
- Air Unit Lite (**Caddx Vista**) for using with with FPV Goggles V1/V2
  - [01.00.0606](https://bin.fpv.tools/butter/packages/lt150_01.00.0606_recovery.zip)
- Air Unit Lite (**Caddx Vista / Runcam Wasp**) for using with Goggles 2/Integra
  - [01.01.0000](https://bin.fpv.tools/butter/packages/lt150_01.01.0000_recovery.zip)
- **Air Unit** for using with Goggles V1/V2
  - [01.00.0608](https://bin.fpv.tools/butter/packages/wm150_01.00.0608_recovery.zip)
  - [01.00.0606](https://bin.fpv.tools/butter/packages/wm150_01.00.0606_recovery.zip)
- **Air Unit** for using with Goggles 2/Integra
  - [01.01.0000](https://bin.fpv.tools/butter/packages/wm150_01.01.0000_recovery.zip)

## Troubleshooting

### Unable to connect to DJI Recovery device

If flashing your device with butter never gets past "[ ] Waiting for DJI Recovery device to enumerate.." here's what you can do:
- Make sure you've installed the proper drivers using driver_installer.exe
- Try another USB cable
- Try another USB port (2.0 if you have one) 
- Try restarting your PC
- Try another PC

Usually some combination of cables and USB ports will work. If not, find a friend with a PC willing to help out. Raspberry PIs are also known to work. 

### Firmware version not changed after flashing

Flashing with butter completes sucsesfully (you see individual partitions such as system, system2, vendor, vendor_2 being flashed with the script) but Assistant still shows me the old version number.

This is normal, the FW version is stored separately in the data partition in flash and doesn't always get wiped during a restore. Just proceed to rooting.

## Advanced usage

Windows users need to install [drivers](https://github.com/fpv-wtf/driver-installer/releases) first.

To boot your device for fastboot flashing launch the butter binary and power on your device.

```
butter-x86_64-w64-mingw32.exe [device]
```
Where device is one of:
- wm150
- lt150
- gl150
- gl170

If no argument is supplied you can select the device interactively.

Then use `fastboot` to flash your devices partitions. Note that you will need raw partition images. Methods for using DDD firmware archives will be released at a later date. See [Usage](#Usage) for pre-converted archives.

## Generating new packages

### With Docker

For most users, it's reccomended to run the packager via [docker](https://www.docker.com/products/docker-desktop/).

Given:

- firmware .bin files obtained from [DDD](https://www.dankdronedownloader.com/DDD2/app/) in the folder `./firmwares`
- an empty output folder for packages at `./packages`

on Linux we need to run:
```
docker run -v "$(pwd)"/firmwares:/app/firmwares -v "$(pwd)"/packages:/app/packages fpvwtf/butter-packager
```
on Windows with Powershell we need to run:
```
docker run -v ${PWD}\firmwares:/app/firmwares -v ${PWD}\packages:/app/packages fpvwtf/butter-packager
```

Note that `./` becomes `"$(pwd)"` on Linux or `${PWD}` in PowerShell on Windows because docker needs non-relative paths for mounts.

### Without Docker

Clone this repository and put your firmware .bin files obtained from [DDD](https://www.dankdronedownloader.com/DDD2/app/) into `packager/firmwares/`. You'll have to figure out any dependency issues as they come up, or see the included Dockerfile for reference.

Then run:
```
cd packager
make
```
You should find the output packages in `packager/packages/`

### Building many packages at once
Firmwares can be extracted in parralel, but note the separate invocation for the packages target. The Makefile has some issues.
```
cd packager
make -j32 firmwares
make packages
make superpack
```

## Todo
- Add support for DDD tar archives

## Why isn't it spelled wrong?
[Because](https://www.youtube.com/watch?v=3ds0vWfoTwU).

## Support the effort
If you'd like, you can support the effort on [Open Collective](https://opencollective.com/fpv-wtf/donate?amount=10).
