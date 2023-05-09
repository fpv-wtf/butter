.PHONY: firmwares packages superpack htdocs upload mdlink clean clean-htdocs clean-tmp clean-packages deps/butter

GL170_ROOTABLE=01.00.0606
GL170_LATEST=$(shell cat config/latest-gl170)
SUPERPACK_PATH=packages/gl170_$(GL170_LATEST)_superpack
#this is dumb, but it's relative to the above
SUPERPACK_ZIP=../../htdocs/packages/gl170_$(GL170_LATEST)_superpack.zip


bins := $(wildcard firmwares/*.bin)
fwtargets := $(patsubst firmwares/%.bin,packages/%_recovery,$(bins))

fwpackages:= $(wildcard packages/*_recovery packages/*_superpack)
fwzips:= $(patsubst packages/%,htdocs/packages/%.zip,$(fwpackages))

all: firmwares packages

#.ONESHELL:
#firmwares:
##	rm -rf packages
#	mkdir packages
#	mkdir -p tmp
#	cd tmp;
#	for name in ../firmwares/*.bin; do
#		node ../extractor.js $${name} ../packages/;
#	done;
#	cd ..
#	rm -rf tmp
#

deps/sdat2img/sdat2img.py:
	git submodule update --init --recursive

.PHONY:
packages/%_recovery: firmwares/%.bin deps/sdat2img/sdat2img.py
	mkdir -p tmp/
	cd tmp/ && node ../extractor.js ../$< ../packages/

firmwares: $(fwtargets)

.ONESHELL:
packages: deps/margerine.exe deps/driver_installer.exe deps/butter
	for name in packages/*_recovery; do
		mkdir -p $${name}/firmware 
		if ls $${name}/*.img 1> /dev/null 2>&1; then
			mv $${name}/*.img $${name}/firmware;
		fi
		export device=`echo $${name} | cut -d_ -f1 | cut -d/ -f2` 
		echo $${device} > $${name}/firmware/device 
		echo $${name} 
		cp config/partitions-$${device} $${name}/firmware/partitions 
		if grep -q "env.img" config/partitions-$${device}; then
			cp config/env-$${device} $${name}/firmware/env.img 
		fi
		mkdir -p $${name}/bin
		cp deps/butter-* $${name}/bin/ 
		cp deps/driver_installer.exe $${name}/ 
		cp scripts/recovery/* $${name}/
		cp deps/platform-tools/fastboot* $${name}/bin/ 
		cp deps/platform-tools/AdbWin* $${name}/bin/ 
	done

deps/driver_installer.exe:
	wget -O deps/driver_installer.exe https://github.com/fpv-wtf/driver-installer/releases/latest/download/driver_installer.exe

deps/margerine.exe:
	wget -O deps/margerine.exe https://github.com/fpv-wtf/margerine/releases/latest/download/margerine.exe

deps/butter: deps/butter-x86_64-w64-mingw32.exe deps/butter-x86_64-linux-gnu deps/butter-arm-linux-gnueabihf deps/butter-aarch64-linux-gnu

.PHONY:
latest/download/butter-%:
	echo 

deps/butter-%:latest/download/butter-%
	wget -O $@ https://github.com/fpv-wtf/butter/releases/$<

superpack: deps/margerine.exe deps/driver_installer.exe deps/butter
	rm -rf $(SUPERPACK_PATH)
	mkdir $(SUPERPACK_PATH)
	cp -r packages/gp150_$(GL170_ROOTABLE)_recovery/firmware $(SUPERPACK_PATH)/$(GL170_ROOTABLE)
#skip upgrade for the first flash, waste of time and write cycles
	grep -v "upgrade.img" packages/gp150_$(GL170_ROOTABLE)_recovery/firmware/partitions > $(SUPERPACK_PATH)/$(GL170_ROOTABLE)/partitions
	cp -r packages/gl170_$(GL170_LATEST)_recovery/firmware $(SUPERPACK_PATH)/$(GL170_LATEST)
	mkdir $(SUPERPACK_PATH)/bin
	cp deps/driver_installer.exe $(SUPERPACK_PATH)
	cp scripts/superpack/* $(SUPERPACK_PATH)/
	cp deps/margerine.exe deps/platform-tools/fastboot* deps/platform-tools/AdbWin* deps/butter-x86_64-w64-mingw32.exe $(SUPERPACK_PATH)/bin
	mkdir $(SUPERPACK_PATH)/data
	cp config/latest-gl170 $(SUPERPACK_PATH)/data/latest

htdocs/packages/%.zip:packages/%
	mkdir -p htdocs/packages/
	cd $< && zip -9 -r ../../$@ ./*

htdocs: $(fwzips)
	node genindex.js json > htdocs/packages.json

upload: htdocs
	aws s3 sync --delete ./htdocs s3://bin.fpv.tools/butter/ --acl public-read

mdlinks: 
	node genindex.js md 

clean: clean-packages clean-htdocs clean-tmp clean-deps

clean-htdocs:
	rm -rf htdocs/*
clean-packages:
	rm -rf packages/*
clean-tmp:
	rm -rf tmp/*

clean-deps:
	rm -rf deps/margerine.exe
	rm -rf deps/butter*
	rm -rf deps/driver_installer.exe