# butter
### Episode 3: The ¯\\\_(ツ)_/¯ Strikes Back

## Purpose
This program will enable fastboot on DJI Air Unit (Lite), DJI FPV Goggles V1 and DJI FPV Goggles V2. This means you can recover or forcefully downgrade your devices firmware ignoring antirollback.

## Supported platforms
- Windows 64bit
- Linux x64, armhf, aarch64

Sorry OS X users, you will need to find a friend with a supported PC. If someone has any ideas on how to make the recovery USB device that shows up for 5 seconds during DJI device power up successfully enumerate on OS X in libusb (or at all) we're all ears.

## Usage
For end users looking to recover/root the recommend method is to download premade flashing packages available at:
- [Air Unit - V01.00.0608](https://mega.nz/file/4ygSlZLZ#ZJ7aEwO0s-1ucK1QJTDf1gzA6ZXRncBP_8IH0U_5iQQ)
- [Air Unit Lite / Caddx Vista / Runcam Link - V01.00.0608](https://mega.nz/file/4yoAnDKZ#WB4n3KlsB69nIAt1p2gIdqZEsnNf_u1UgO0xPG9Oqx4)
- [Air Unit Lite / Caddx Vista - V01.00.0606](https://mega.nz/file/dioAEKYJ#d2i9YlhEUvSc7piR_TrwBkrSi1Wnjdc_RFzXIIT-kFE)
- [FPV Goggles V1 - V01.00.0608](https://mega.nz/file/YnI0TJYB#FVGdEwXERCzGnJCWPdDLZg2U2VWGJUZWo52WYCHyQkM)
- [FPV Goggles V2 - V01.00.0606](https://mega.nz/file/Uz4V1L4Q#XQAXasHy95XYuhj1Mc4yac5Gg-uX2kmrmay_yr92_iI)

A few additional V2 Goggles packages are available for particular use cases:
- [V01.02.0001](https://mega.nz/file/MrYhCRrb#hWEmJdTQir8e4-xccAJ9uqx5_zXOSvUH11mlhKcj7QA)
- [V01.04.0000](https://mega.nz/file/I3JgwA6J#h8Z-R2b2tn5iBFz4xhHqAu3Qr5YafIPT7KereEYnmdM)

Then simply follow the README.txt contained within.

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

This is normal, the FW version is stored separately in the data partition in flash and doesn't get wiped during a downgrade. Just proceed to rooting.

### Loss of O3 mode after re-installing wtfos

If O3 AU mode dissapears from the menus after upgrading to V01.04.0000 and re-installing wtfos, then please run the following in the CLI and then let the configurator do it's thing:
```
unrd slot_1.status_successful 0
unrd slot_1.status_active 0
unrd slot_2.status_active 1
reboot
```

Alternatively, if that doesn't work for some reason, please use this butter package to flash V01.04.0000 on your goggles and then re-install wtfos: https://mega.nz/file/I3JgwA6J#h8Z-R2b2tn5iBFz4xhHqAu3Qr5YafIPT7KereEYnmdM

## Advanced usage

Windows users need to install [drivers](https://github.com/fpv-wtf/driver-installer) first.

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

## Todo
- Add support for DDD tar archives

## Why isn't it spelled wrong?
[Because](https://www.youtube.com/watch?v=3ds0vWfoTwU).

## Support the effort
If you'd like, you can support the effort on [Open Collective](https://opencollective.com/fpv-wtf/donate?amount=10).
