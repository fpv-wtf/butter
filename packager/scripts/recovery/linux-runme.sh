#!/bin/bash
set -e

echo "Please connect and power on your device"
DEVICE=$(cat firmware/device)
ARCH=$(uname -m)

case $ARCH in

  "x86_64")
    BIN="x86_64-linux-gnu"
    ;;
  "armv"*)
    BIN="arm-linux-gnueabihf"
    ;;
  "aarch64"*)
    BIN="aarch64-linux-gnu"
    ;;
  *)
    echo "Your platform ${ARCH} is not supported."
    exit 1
    ;;
esac

#this is bugged on some raspis
#if ! command -v fastboot &> /dev/null
#then
#    echo "Error: fastboot not found. please install it eg. via 'sudo apt install fastboot'."
#    exit
#fi

bin/butter-${BIN} ${DEVICE}

cd firmware
fastboot erase blackbox

while IFS="" read -r p || [ -n "$p" ]
do
  fastboot flash $p
done < partitions

fastboot reboot

echo "Flashing complete"
