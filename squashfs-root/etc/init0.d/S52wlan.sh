#!/bin/sh

xmldbc -P /etc/services/WIFI/rtcfg.php -V ACTION="INIT" > /var/init_wifi_mod.sh

# set initial arguments for module 2.4g 4360b0 (it has no srom values)
nvram set devpath0=pci/2/1
nvram set 0:boardvendor=0x14e4
nvram set 0:devid=0x43a1
nvram set 0:sromrev=11
nvram set 0:boardflags=0x1000
nvram set 0:boardflags2=0x100002
nvram set 0:venvid=0x14e4
nvram set 0:boardflags3=0x3
nvram set 0:regrev=0
nvram set 0:aa2g=7
nvram set 0:agbg0=71
nvram set 0:agbg1=71
nvram set 0:agbg2=71
nvram set 0:txchain=7
nvram set 0:rxchain=7
nvram set 0:antswitch=0
nvram set 0:femctrl=3
nvram set 0:tssiposslope2g=1
nvram set 0:epagain2g=0
nvram set 0:pdgain2g=14
nvram set 0:tworangetssi2g=0
nvram set 0:papdcap2g=0
nvram set 0:gainctrlsph=0
nvram set 0:tempthresh=255
nvram set 0:tempoffset=255
nvram set 0:rawtempsense=0x1ff
nvram set 0:measpower=0x7f
nvram set 0:xtalfreq=65535
nvram set 0:phycal_tempdelta=255
nvram set 0:measpower1=0x7f
nvram set 0:measpower2=0x7f
nvram set 0:tssifloor2g=0x3ff
nvram set 0:pdoffset2g40ma0=15
nvram set 0:pdoffset2g40ma1=15
nvram set 0:pdoffset2g40ma2=15
nvram set 0:pdoffset2g40mvalid=1
nvram set 0:pdoffset40ma0=0
nvram set 0:pdoffset40ma1=0
nvram set 0:pdoffset40ma2=0
nvram set 0:pdoffset80ma0=0
nvram set 0:pdoffset80ma1=0
nvram set 0:pdoffset80ma2=0
nvram set 0:cckbw202gpo=0
nvram set 0:cckbw20ul2gpo=0
# nvram set 0:mcsbw202gpo=0xFFFDA800
nvram set 0:mcsbw202gpo=0x0
# nvram set 0:mcsbw402gpo=0xFFFFFFFF
nvram set 0:mcsbw402gpo=0x0
# nvram set 0:dot11agofdmhrbw202gpo=0xDB97
nvram set 0:dot11agofdmhrbw202gpo=0x0
nvram set 0:ofdmlrbw202gpo=0
nvram set 0:sb40and80lr5ghpo=0
nvram set 0:dot11agduphrpo=0
nvram set 0:dot11agduplrpo=0
nvram set 0:sar2g=18
nvram set 0:rxgainerr2ga0=63
nvram set 0:rxgainerr2ga1=31
nvram set 0:rxgainerr2ga2=31
# nvram set 0:maxp2ga0=106
nvram set 0:maxp2ga0=102
# nvram set 0:pa2ga0=0xFF35,0x18F7,0xFCF5
nvram set 0:pa2ga0=0xFF29,0x1b86,0xFCa9
nvram set 0:rxgains2gelnagaina0=4
nvram set 0:rxgains2gtrisoa0=7
nvram set 0:rxgains2gtrelnabypa0=1
# nvram set 0:maxp2ga1=106
nvram set 0:maxp2ga1=102
# nvram set 0:pa2ga1=0xFF36,0x18D1,0xFCF9
nvram set 0:pa2ga1=0xFF2e,0x1c4d,0xFC99
nvram set 0:rxgains2gelnagaina1=4
nvram set 0:rxgains2gtrisoa1=7
nvram set 0:rxgains2gtrelnabypa1=1
# nvram set 0:maxp2ga2=106
nvram set 0:maxp2ga2=102
# nvram set 0:pa2ga2=0xFF3E,0x1912,0xFCF7
nvram set 0:pa2ga2=0xFF27,0x1ac0,0xFcc0
nvram set 0:rxgains2gelnagaina2=4
nvram set 0:rxgains2gtrisoa2=7
nvram set 0:rxgains2gtrelnabypa2=1
# ledbh#, # is gpio number, 0x80 is low active, 0x3 is behavior, more detail in wlioctl.h (WL_LED_RADIO)
nvram set 0:ledbh0=0x8B
nvram set 0:ledbh1=0x8B
nvram set 0:ledbh2=0x8B
# nvram set 0:ledbh13=0x83
nvram set 0:ledbh13=0x8B

#implict txbf calibration data for 2G
nvram set 0:rpcal2g=0
TXBFCAL=`devdata get -e rpcal2g`
[ $TXBFCAL != "" ] && nvram set 0:rpcal2g=$TXBFCAL


# set initial arguments for module 5g 4360b0 (it has no srom values)
nvram set devpath1=pci/1/1
nvram set 1:boardvendor=0x14e4
nvram set 1:devid=0x43a2
nvram set 1:sromrev=11
nvram set 1:boardflags=0x30000000
nvram set 1:boardflags2=0x300002
nvram set 1:venid=0x14e4
nvram set 1:boardflags3=0x0
nvram set 1:regrev=0
nvram set 1:aa5g=7
nvram set 1:aga0=71
nvram set 1:aga1=133
nvram set 1:aga2=133
nvram set 1:txchain=7
nvram set 1:rxchain=7
nvram set 1:antswitch=0
nvram set 1:femctrl=3
nvram set 1:tssiposslope5g=1
nvram set 1:epagain5g=0
nvram set 1:pdgain5g=4
nvram set 1:tworangetssi5g=0
nvram set 1:papdcap5g=0
nvram set 1:gainctrlsph=0
nvram set 1:measpower=0x7f
nvram set 1:xtalfreq=65535
nvram set 1:phycal_tempdelta=255
nvram set 1:measpower1=0x7f
nvram set 1:measpower2=0x7f
nvram set 1:pdoffset40ma0=4369
nvram set 1:pdoffset40ma1=4369
nvram set 1:pdoffset40ma2=4369
nvram set 1:pdoffset80ma0=0
nvram set 1:pdoffset80ma1=0
nvram set 1:pdoffset80ma2=0
nvram set 1:subband5gver=0x4
nvram set 1:mcsbw205glpo=0
nvram set 1:mcsbw405glpo=0
nvram set 1:mcsbw805glpo=0
nvram set 1:mcsbw1605glpo=0
# nvram set 1:mcsbw205gmpo=0xFFFDA800
nvram set 1:mcsbw205gmpo=0x0
# nvram set 1:mcsbw405gmpo=0xFFFDA800
nvram set 1:mcsbw405gmpo=0x0
# nvram set 1:mcsbw805gmpo=0xFFFDA844
nvram set 1:mcsbw805gmpo=0x0
nvram set 1:mcsbw1605gmpo=0
# nvram set 1:mcsbw205ghpo=0xFFFDA800
nvram set 1:mcsbw205ghpo=0x0
# nvram set 1:mcsbw405ghpo=0xFFFDA800
nvram set 1:mcsbw405ghpo=0x0
# nvram set 1:mcsbw805ghpo=0xFFFDA844
nvram set 1:mcsbw805ghpo=0x0
nvram set 1:mcsbw1605ghpo=0
nvram set 1:mcslr5glpo=0
nvram set 1:mcslr5gmpo=0
nvram set 1:mcslr5ghpo=0
nvram set 1:sb40and80lr5ghpo=0
nvram set 1:dot11agduphrpo=0
nvram set 1:dot11agduplrpo=0
nvram set 1:pcieingress_war=15
nvram set 1:sar5g=15
nvram set 1:rxgainerr5ga0=63,63,63,63
nvram set 1:rxgainerr5ga1=31,31,31,31
nvram set 1:rxgainerr5ga2=31,31,31,31
nvram set 1:rxgains5gmelnagaina0=2
nvram set 1:rxgains5gmtrisoa0=5
nvram set 1:rxgains5gmtrelnabypa0=1
nvram set 1:rxgains5ghelnagaina0=2
nvram set 1:rxgains5ghtrisoa0=5
nvram set 1:rxgains5ghtrelnabypa0=1
nvram set 1:rxgains5gelnagaina0=1
nvram set 1:rxgains5gtrisoa0=7
nvram set 1:rxgains5gtrelnabypa0=1
# nvram set 1:maxp5ga0=54,90,90,106
nvram set 1:maxp5ga0=102,102,102,102
# nvram set 1:pa5ga0=0xff4c,0x18df,0xfd12,0xff52,0x195d,0xfd11,0xff49,0x1a47,0xfcdc,0xff48,0x1a85,0xfcce
# nvram set 1:pa5ga0=0xff3b,0x1a0d,0xfcd1,0xff34,0x19c0,0xfcd7,0xff30,0x18c7,0xfcf1,0xff32,0x194d,0xfce5
# nvram set 1:pa5ga0=0xff40,0x1a47,0xfcd0,0xff3d,0x1a7a,0xfccd,0xff4b,0x1af2,0xfccc,0xff2a,0x18b6,0xfcf0
nvram set 1:pa5ga0=0xff45,0x1b8f,0xfcb4,0xff3d,0x1af7,0xfcbe,0xff46,0x1b8a,0xfcb4,0xff43,0x1b06,0xfcc1
nvram set 1:rxgains5gmelnagaina1=2
nvram set 1:rxgains5gmtrisoa1=4
nvram set 1:rxgains5gmtrelnabypa1=1
nvram set 1:rxgains5ghelnagaina1=2
nvram set 1:rxgains5ghtrisoa1=4
nvram set 1:rxgains5ghtrelnabypa1=1
nvram set 1:rxgains5gelnagaina1=1
nvram set 1:rxgains5gtrisoa1=6
nvram set 1:rxgains5gtrelnabypa1=1
# nvram set 1:maxp5ga1=54,90,90,106
nvram set 1:maxp5ga1=102,102,102,102
# nvram set 1:pa5ga1=0xff5c,0x19ba,0xfd12,0xff3e,0x1932,0xfcf5,0xff4d,0x1a9f,0xfcdd,0xff47,0x1a5d,0xfcda
# nvram set 1:pa5ga1=0xff27,0x189d,0xfcea,0xff46,0x1a57,0xfcd3,0xff34,0x1958,0xfce2,0xff26,0x1845,0xfcfa
# nvram set 1:pa5ga1=0xff34,0x19a4,0xfcd8,0xff26,0x186a,0xfcf8,0xff3e,0x1a8d,0xfcca,0xff2f,0x19ce,0xfcd2
nvram set 1:pa5ga1=0xff3c,0x1acd,0xfcc1,0xff45,0x1b14,0xfcc5,0xff42,0x1b04,0xfcc5,0xff3f,0x1aab,0xfccc
nvram set 1:rxgains5gmelnagaina2=3
nvram set 1:rxgains5gmtrisoa2=4
nvram set 1:rxgains5gmtrelnabypa2=1
nvram set 1:rxgains5ghelnagaina2=3
nvram set 1:rxgains5ghtrisoa2=4
nvram set 1:rxgains5ghtrelnabypa2=1
nvram set 1:rxgains5gelnagaina2=1
nvram set 1:rxgains5gtrisoa2=5
nvram set 1:rxgains5gtrelnabypa2=1
# nvram set 1:maxp5ga2=54,90,90,106
nvram set 1:maxp5ga2=102,102,102,102
# nvram set 1:pa5ga2=0xff38,0x18f3,0xfcef,0xff4f,0x1a3d,0xfcef,0xff4a,0x1ade,0xfcd1,0xff43,0x1aca,0xfcc0
# nvram set 1:pa5ga2=0xff24,0x1864,0xfcf0,0xff2c,0x18ba,0xfcf2,0xff24,0x17eb,0xfd05,0xff2b,0x18af,0xfcf5
# nvram set 1:pa5ga2=0xff3b,0x1a91,0xfcc7,0xff38,0x1a52,0xfcd0,0xff35,0x19e3,0xfcd6,0xff28,0x18b6,0xfcf3
nvram set 1:pa5ga2=0xff3d,0x1aee,0xfcc1,0xff33,0x1a56,0xfcc4,0xff3f,0x1b04,0xfcc1,0xff47,0x1b48,0xfcc2
# ledbh#, # is gpio number, 0x80 is low active, 0x3 is behavior, more detail in wlioctl.h (WL_LED_RADIO)
nvram set 1:ledbh0=0x8B
nvram set 1:ledbh1=0x8B
nvram set 1:ledbh2=0x8B
# nvram set 1:ledbh14=0x83
nvram set 1:ledbh14=0x8B

#implict txbf calibration data for 5G
nvram set 1:rpcal5gb0=0
TXBFCAL=`devdata get -e rpcal5gb0`
[ $TXBFCAL != "" ] && nvram set 1:rpcal5gb0=$TXBFCAL
nvram set 1:rpcal5gb1=0
TXBFCAL=`devdata get -e rpcal5gb1`
[ $TXBFCAL != "" ] && nvram set 1:rpcal5gb1=$TXBFCAL
nvram set 1:rpcal5gb2=0
TXBFCAL=`devdata get -e rpcal5gb2`
[ $TXBFCAL != "" ] && nvram set 1:rpcal5gb2=$TXBFCAL
nvram set 1:rpcal5gb3=0
TXBFCAL=`devdata get -e rpcal5gb3`
[ $TXBFCAL != "" ] && nvram set 1:rpcal5gb3=$TXBFCAL


#we only insert wifi modules in init. 
xmldbc -P /etc/services/WIFI/init_wifi_mod.php >> /var/init_wifi_mod.sh
chmod +x /var/init_wifi_mod.sh
/bin/sh /var/init_wifi_mod.sh

#initial wifi interfaces
service PHYINF.WIFI start
