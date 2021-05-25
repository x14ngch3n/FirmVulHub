#!/bin/bash
# first, remove all previous binwalked data
# find $1 -type d -name "_*.extracted" -prune -exec rm -r "{}" \;
DIRNAME=$2
mkdir -p $DIRNAME"/" &
tar -xvzf $1 -C $DIRNAME
COMPRESSED=$(find $DIRNAME -type f -exec file {} \; | grep compress | awk -F ":" '{print $1}' | grep -v '.html' | grep -v '.js' | grep -v '.swf')
MAX_DEPTH=5
THRESHOLD=50
for file in $COMPRESSED; do
    echo $file
    tot_files=$(find $DIRNAME -type f | wc -l)
    pt=$(dirname $file)
    for depth in $(seq 0 $MAX_DEPTH); do
        # remove already binwalked directory, if any
        f=$(basename $file)
        rm -r $pt"/_"$f".extracted" >/dev/null 2>&1
        # try again with updated depth
        binwalk -eMq -d=$depth $file --directory $pt"/"
        # check if enough
        curr_files=$(find $DIRNAME -type f | wc -l)
        if (($curr_files > ($tot_files + $THRESHOLD))); then
            break
        fi
    done
done
